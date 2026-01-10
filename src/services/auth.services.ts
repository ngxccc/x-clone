import { TOKEN_TYPES, USER_VERIFY_STATUS } from "@/constants/enums.js";
import { ERROR_CODES, USERS_MESSAGES } from "@/constants/messages.js";
import { RefreshToken, User } from "@/models.js";
import { signToken } from "@/utils/jwt.js";
import {
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  BadRequestError,
} from "@/utils/errors.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import ms, { StringValue } from "ms";
import usersService from "./users.services.js";
import {
  ForgotPasswordBodyType,
  ResendVerificationEmailBodyType,
} from "@/schemas/auth.schemas.js";
import { getGoogleToken, getGoogleUserInfo } from "@/utils/google.js";

class AuthService {
  private generateRandomPassword() {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const specials = "!@#$%^&*()";

    const p1 = chars[Math.floor(Math.random() * chars.length)];
    const p2 = upper[Math.floor(Math.random() * upper.length)];
    const p3 = numbers[Math.floor(Math.random() * numbers.length)];
    const p4 = specials[Math.floor(Math.random() * specials.length)];

    // Thêm các ký tự ngẫu nhiên cho đủ độ dài
    const remaining = Math.random().toString(36).slice(-6) + p1 + p2 + p3 + p4;

    return remaining;
  }

  private generateRandomUsername(email: string) {
    let username = email.split("@")[0]!;

    username = username.replace(/[^a-zA-Z0-9._]/g, "");

    if (!username) username = "user";

    // Ví dụ kết quả: "nguyenvana_1715403921"
    username += `_${Date.now().toString()}`;

    return username;
  }

  private async signAccessAndRefreshToken(userId: string, deviceInfo?: string) {
    const jwtPayload = {
      userId: userId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      signToken(
        {
          ...jwtPayload,
          tokenType: TOKEN_TYPES.ACCESS_TOKEN,
        },
        "access",
      ),
      signToken(
        {
          ...jwtPayload,
          tokenType: TOKEN_TYPES.REFRESH_TOKEN,
        },
        "refresh",
      ),
    ]);

    const expiresIn = process.env.JWT_REFRESH_EXPIRE || "100d";
    const expiresMilliseconds = ms(expiresIn as StringValue);

    await RefreshToken.create({
      token: refreshToken,
      userId: userId,
      deviceInfo,
      expiryDate: new Date(Date.now() + expiresMilliseconds),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string, deviceInfo?: string) {
    const user = await usersService.findUserByEmailWithPassword(email);
    if (!user)
      throw new UnauthorizedError(
        USERS_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT,
        ERROR_CODES.EMAIL_NOT_FOUND,
      );

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new UnauthorizedError(
        USERS_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT,
        ERROR_CODES.PASSWORD_INCORRECT,
      );

    if (user.verify === USER_VERIFY_STATUS.UNVERIFIED)
      throw new ForbiddenError(
        USERS_MESSAGES.EMAIL_NOT_VERIFIED,
        ERROR_CODES.EMAIL_NOT_VERIFIED,
      );
    else if (user.verify === USER_VERIFY_STATUS.BANNED)
      throw new ForbiddenError(
        USERS_MESSAGES.ACCOUNT_IS_BANNED,
        ERROR_CODES.ACCOUNT_IS_BANNED,
      );

    return await this.signAccessAndRefreshToken(user.id, deviceInfo);
  }

  async loginGoogle(code: string, deviceInfo?: string) {
    const { access_token } = await getGoogleToken(code);

    const googleUserInfo = await getGoogleUserInfo(access_token);

    if (!googleUserInfo.email_verified)
      throw new BadRequestError(USERS_MESSAGES.GMAIL_NOT_VERIFIED);

    const user = await User.findOne({ email: googleUserInfo.email });

    if (user) {
      if (!user.googleId) {
        await User.findByIdAndUpdate(user.id, {
          $set: {
            googleId: googleUserInfo.sub,
            avatar: user.avatar ?? googleUserInfo.picture,
          },
        });
      }

      return await this.signAccessAndRefreshToken(user.id, deviceInfo);
    } else {
      const randomPassword = this.generateRandomPassword();

      // .create() tự động gọi Pre-save hook
      const newUser = await User.create({
        name: googleUserInfo.name,
        username: this.generateRandomUsername(googleUserInfo.email),
        email: googleUserInfo.email,
        googleId: googleUserInfo.sub,
        password: randomPassword,
        avatar: googleUserInfo.picture,
        dateOfBirth: new Date(),
        verify: USER_VERIFY_STATUS.VERIFIED,
      });

      return await this.signAccessAndRefreshToken(newUser.id, deviceInfo);
    }
  }

  async logout(refreshToken: string) {
    // Idempotent (Tính lũy đẳng)
    // Dù gọi 1 hay n lần thì kết quả res là như nhau (User đã đăng xuất)
    await RefreshToken.deleteOne({ token: refreshToken });

    return { success: true };
  }

  async verifyEmail(userId: string) {
    await usersService.updateVerifyStatus(userId);

    return { success: true };
  }

  async resendVerificationEmail(payload: ResendVerificationEmailBodyType) {
    const { email } = payload;

    const user = await usersService.findUserByEmail(email);

    if (!user)
      throw new NotFoundError(
        USERS_MESSAGES.USER_NOT_FOUND,
        ERROR_CODES.USER_NOT_FOUND,
      );

    if (user.verify === USER_VERIFY_STATUS.VERIFIED)
      throw new ConflictError(
        USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE,
        ERROR_CODES.EMAIL_IS_VERIFIED,
      );
    else if (user.verify === USER_VERIFY_STATUS.BANNED)
      throw new ForbiddenError(
        USERS_MESSAGES.ACCOUNT_IS_BANNED,
        ERROR_CODES.ACCOUNT_IS_BANNED,
      );

    const emailVerifyToken = await signToken(
      {
        userId: user.id,
        tokenType: TOKEN_TYPES.EMAIL_VERIFY_TOKEN,
      },
      "email",
    );

    await usersService.updateEmailVerifyToken(user.id, emailVerifyToken);

    // TODO: Gửi email cho user
    console.log(`RESEND EMAIL TO [${email}]: ${emailVerifyToken}`);

    return { success: true };
  }

  async forgotPassword(payload: ForgotPasswordBodyType) {
    const { email } = payload;

    const user = await usersService.findUserByEmail(email);

    if (!user) throw new NotFoundError(USERS_MESSAGES.USER_NOT_FOUND);

    if (user.verify === USER_VERIFY_STATUS.BANNED)
      throw new ForbiddenError(
        USERS_MESSAGES.ACCOUNT_IS_BANNED,
        ERROR_CODES.ACCOUNT_IS_BANNED,
      );

    const forgotPasswordToken = await signToken(
      {
        userId: user.id,
        tokenType: TOKEN_TYPES.FORGOT_PASSWORD_TOKEN,
      },
      "forgotPassword",
    );

    await usersService.updateForgotPasswordToken(user.id, forgotPasswordToken);

    // TODO: Gửi Email (Link: https://client.com/reset-password?token=...)
    console.log(`FORGOT PASSWORD TOKEN FOR [${email}]: ${forgotPasswordToken}`);

    return { success: true };
  }

  async resetPassword(userId: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Implicit Verification (Xác thực ngầm)
    await User.findByIdAndUpdate(userId, {
      $set: {
        password: hashedPassword,
        emailVerifyToken: "",
        verify: USER_VERIFY_STATUS.VERIFIED,
        forgotPasswordToken: "",
      },
    });

    return { success: true };
  }

  async refreshToken(
    userId: string,
    refreshToken: string,
    deviceInfo?: string,
  ) {
    const oldToken = await RefreshToken.findOneAndDelete({
      token: refreshToken,
      userId: userId,
    });

    if (!oldToken)
      throw new UnauthorizedError(
        USERS_MESSAGES.REFRESH_TOKEN_IS_USED_OR_NOT_EXIST,
      );

    // Refresh Token Rotation (Xoay vòng token)
    return await this.signAccessAndRefreshToken(userId, deviceInfo);
  }
}

const authService = new AuthService();
export default authService;

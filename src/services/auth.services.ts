import { TOKEN_TYPES, USER_VERIFY_STATUS } from "@/constants/enums.js";
import { ERROR_CODES, USERS_MESSAGES } from "@/constants/messages.js";
import { RefreshToken, User } from "@/models.js";
import { signToken, verifyToken } from "@/utils/jwt.js";
import {
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from "@/utils/errors.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import ms, { StringValue } from "ms";
import usersService from "./users.services.js";
import {
  ForgotPasswordReqType,
  LoginReqType,
  LogoutReqType,
  ResendVerificationEmailReqType,
  ResetPasswordReqType,
} from "@/schemas/auth.schemas.js";

class AuthService {
  async login(payload: LoginReqType, deviceInfo?: string) {
    const { email, password } = payload;

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

    const jwtPayload = {
      userId: user.id,
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
      userId: user._id,
      deviceInfo,
      expiryDate: new Date(Date.now() + expiresMilliseconds),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(payload: LogoutReqType) {
    const { refreshToken } = payload;
    // Idempotent (Tính lũy đẳng)
    // Dù gọi 1 hay n lần thì kết quả res là như nhau (User đã đăng xuất)
    await RefreshToken.deleteOne({ token: refreshToken });

    return { success: true };
  }

  async verifyEmail(userId: string) {
    await usersService.updateVerifyStatus(userId);

    return { success: true };
  }

  async resendVerificationEmail(payload: ResendVerificationEmailReqType) {
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

  async forgotPassword(payload: ForgotPasswordReqType) {
    const { email } = payload;

    const user = await usersService.findUserByEmail(email);

    if (!user) throw new NotFoundError(USERS_MESSAGES.USER_NOT_FOUND);

    if (user.verify === USER_VERIFY_STATUS.BANNED)
      throw new ForbiddenError(
        USERS_MESSAGES.ACCOUNT_IS_BANNED,
        ERROR_CODES.ACCOUNT_IS_BANNED,
      );

    if (user.forgotPasswordToken) {
      const decoded = verifyToken(user.forgotPasswordToken, "forgotPassword");
      const now = Math.floor(Date.now() / 1000);

      if (now - decoded.iat! < 60)
        throw new ConflictError(USERS_MESSAGES.RESEND_EMAIL_TOO_FAST);
    }

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

  async resetPassword(payload: ResetPasswordReqType) {
    const { forgotPasswordToken, password } = payload;

    const user =
      await usersService.findUserByForgotPasswordToken(forgotPasswordToken);

    if (!user)
      throw new NotFoundError(
        USERS_MESSAGES.USER_NOT_FOUND,
        ERROR_CODES.USER_NOT_FOUND,
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

    verifyToken(forgotPasswordToken, "forgotPassword");

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(user.id, {
      $set: { password: hashedPassword, forgotPasswordToken: "" },
    });

    return { success: true };
  }
}

const authService = new AuthService();
export default authService;

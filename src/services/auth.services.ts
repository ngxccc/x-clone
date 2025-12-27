import { TOKEN_TYPES, USER_VERIFY_STATUS } from "@/constants/enums.js";
import { ERROR_CODES, USERS_MESSAGES } from "@/constants/messages.js";
import { RefreshToken } from "@/models.js";
import { signToken } from "@/utils/jwt.js";
import { UnauthorizedError, ForbiddenError } from "@/utils/errors.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import ms, { StringValue } from "ms";
import usersService from "./users.services.js";

class AuthService {
  async login(email: string, password: string, deviceInfo?: string) {
    const user = await usersService.findUserByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedError(
        USERS_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT,
        ERROR_CODES.EMAIL_NOT_FOUND,
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError(
        USERS_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT,
        ERROR_CODES.PASSWORD_INCORRECT,
      );
    }

    if (user.verify === USER_VERIFY_STATUS.UNVERIFIED) {
      throw new ForbiddenError(
        USERS_MESSAGES.EMAIL_NOT_VERIFIED,
        ERROR_CODES.EMAIL_NOT_VERIFIED,
      );
    } else if (user.verify === USER_VERIFY_STATUS.BANNED) {
      throw new ForbiddenError(
        USERS_MESSAGES.ACCOUNT_IS_BANNED,
        ERROR_CODES.ACCOUNT_IS_BANNED,
      );
    }

    const payload = {
      userId: user.id,
    };

    const [accessToken, refreshToken] = await Promise.all([
      signToken(
        {
          ...payload,
          tokenType: TOKEN_TYPES.ACCESS_TOKEN,
        },
        "access",
      ),
      signToken(
        {
          ...payload,
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

  async logout(refreshToken: string) {
    // Idempotent (Tính lũy đẳng)
    // Dù gọi 1 hay n lần thì kết quả res là như nhau (User đã đăng xuất)
    const result = await RefreshToken.deleteOne({ token: refreshToken });

    return result;
  }

  async verifyEmail(userId: string) {
    const updateRes = await usersService.updateVerifyStatus(userId);

    return updateRes;
  }
}

const authService = new AuthService();
export default authService;

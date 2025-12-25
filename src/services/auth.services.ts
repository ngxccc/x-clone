import { TOKEN_TYPES } from "@/constants/enums.js";
import { USERS_MESSAGES } from "@/constants/messages.js";
import { RefreshToken } from "@/models.js";
import { signAccessToken, signRefreshToken } from "@/utils/jwt.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import ms, { StringValue } from "ms";
import usersService from "./users.services.js";

class AuthService {
  async login(email: string, password: string, deviceInfo?: string) {
    const user = await usersService.findUserByEmailWithPassword(email);
    if (!user) throw new Error(USERS_MESSAGES.EMAIL_NOT_FOUND);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error(USERS_MESSAGES.PASSWORD_INCORRECT);

    const payload = {
      userId: user._id,
    };

    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({
        ...payload,
        tokenType: TOKEN_TYPES.ACCESS_TOKEN,
      }),
      signRefreshToken({
        ...payload,
        tokenType: TOKEN_TYPES.REFRESH_TOKEN,
      }),
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
}
const authService = new AuthService();
export default authService;

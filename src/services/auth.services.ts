import { TOKEN_TYPES } from "@/constants/enums.js";
import { ERROR_CODES } from "@/constants/messages.js";
import { RefreshToken } from "@/models.js";
import { signToken } from "@/utils/jwt.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import ms, { StringValue } from "ms";
import usersService from "./users.services.js";

class AuthService {
  async login(email: string, password: string, deviceInfo?: string) {
    const user = await usersService.findUserByEmailWithPassword(email);
    if (!user) throw new Error(ERROR_CODES.EMAIL_NOT_FOUND);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error(ERROR_CODES.PASSWORD_INCORRECT);

    const payload = {
      userId: user._id,
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
}
const authService = new AuthService();
export default authService;

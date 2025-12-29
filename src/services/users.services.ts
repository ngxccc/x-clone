import { TOKEN_TYPES, USER_VERIFY_STATUS } from "@/constants/enums.js";
import { USERS_MESSAGES } from "@/constants/messages.js";
import { User } from "@/models.js";
import { RegisterReqType } from "@/schemas/auth.schemas.js";
import { NotFoundError } from "@/utils/errors.js";
import { signToken } from "@/utils/jwt.js";
import bcrypt from "bcrypt";

class UserService {
  async checkEmailExist(email: string) {
    // Mongoose unique cũng bắt được cái này
    // Nhưng check tay ở đây để trả về message thân thiện hơn.
    const user = await User.findOne({ email });
    return Boolean(user);
  }

  async register(payload: RegisterReqType) {
    const { username, email, password, dateOfBirth } = payload;

    const hashedPassword = await bcrypt.hash(password, 10);

    const emailVerifyToken = await signToken(
      {
        userId: "",
        tokenType: TOKEN_TYPES.EMAIL_VERIFY_TOKEN,
      },
      "email",
    );

    // Dùng .create() để kích hoạt Mongoose Validation & Hooks
    // Không dùng .insertOne vì nó không có Validation
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      dateOfBirth,
      emailVerifyToken,
    });

    return newUser.toObject();
  }

  async getMe(userId: string) {
    const user = await User.findById(userId);

    if (!user) throw new NotFoundError(USERS_MESSAGES.USER_NOT_FOUND);

    return user;
  }

  async findUserByEmail(email: string) {
    return await User.findOne({ email });
  }

  async findUserByEmailWithPassword(email: string) {
    return await User.findOne({ email }).select("+password");
  }

  async findUserByEmailVerifyToken(token: string) {
    return await User.findOne({ emailVerifyToken: token });
  }

  async findUserByForgotPasswordToken(token: string) {
    return await User.findOne({ forgotPasswordToken: token });
  }

  async updateVerifyStatus(userId: string) {
    return await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          verify: USER_VERIFY_STATUS.VERIFIED,
          emailVerifyToken: "",
        },
      },
      { new: true, runValidators: true },
    );
  }

  async updateEmailVerifyToken(userId: string, token: string) {
    return await User.findByIdAndUpdate(
      userId,
      { $set: { emailVerifyToken: token } },
      { new: true },
    );
  }

  async updateForgotPasswordToken(userId: string, token: string) {
    return await User.findByIdAndUpdate(
      userId,
      { $set: { forgotPasswordToken: token } },
      { new: true },
    );
  }
}

const usersService = new UserService();
export default usersService;

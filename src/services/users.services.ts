import { User } from "@/models.js";
import { RegisterReqType } from "@/schemas/auth.schemas.js";
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

    // Dùng .create() để kích hoạt Mongoose Validation & Hooks
    // Không dùng .insertOne vì nó không có Validation
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      dateOfBirth,
    });

    return newUser.toObject();
  }
}

const usersService = new UserService();
export default usersService;

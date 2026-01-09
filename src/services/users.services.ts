import { TOKEN_TYPES, USER_VERIFY_STATUS } from "@/constants/enums.js";
import { USERS_MESSAGES } from "@/constants/messages.js";
import { Follower, RefreshToken, User } from "@/models.js";
import { RegisterReqType } from "@/schemas/auth.schemas.js";
import {
  ChangePasswordBodyType,
  UpdateMeBodyType,
} from "@/schemas/users.schemas.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "@/utils/errors.js";
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
      // Chỉ được chuyền trực tiếp khi đã cấu hình pre-save hook
      // Nếu không phải tự hash password
      password,
      dateOfBirth,
      emailVerifyToken,
    });
    // Phải gọi hàm save để kích hoạt pre-save hook
    await newUser.save();

    return newUser.toObject();
  }

  async getMe(userId: string) {
    const user = await User.findById(userId);

    if (!user) throw new NotFoundError(USERS_MESSAGES.USER_NOT_FOUND);

    return user;
  }

  async getProfile(username: string, myUserId?: string) {
    const user = await User.findOne({ username }).select("-email");

    if (!user) throw new NotFoundError(USERS_MESSAGES.USER_NOT_FOUND);

    const isMyProfile = myUserId === user.id;
    let isFollowed = false;

    // Không cần check nếu user tự xem chính mình
    if (myUserId && !isMyProfile) {
      const follow = await Follower.findOne({
        followedId: myUserId,
        followerId: user.id,
      });
      isFollowed = Boolean(follow);
    }

    return {
      ...user.toObject(),
      isFollowed,
      isMyProfile,
    };
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

  async updateMe(userId: string, payload: UpdateMeBodyType) {
    const { username } = payload;

    if (username) {
      const user = await User.findOne({ username });

      if (user && user.id !== userId)
        throw new ConflictError(USERS_MESSAGES.USERNAME_ALREADY_EXISTS);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...payload, // Chỉ update những field có trong payload
        },
      },
      { new: true, runValidators: true },
    );

    if (!user) throw new NotFoundError(USERS_MESSAGES.USER_NOT_FOUND);

    return user;
  }

  async follow(userId: string, followedUserId: string) {
    if (userId === followedUserId)
      throw new BadRequestError(USERS_MESSAGES.CANNOT_DO_SELF);

    const followedUser = await User.findById(followedUserId);
    if (!followedUser) throw new NotFoundError(USERS_MESSAGES.USER_NOT_FOUND);

    // Handle để trả về lỗi thân thiện hơn
    const isFollowed = await Follower.findOne({
      followerId: userId,
      followedId: followedUserId,
    });
    if (isFollowed) throw new BadRequestError(USERS_MESSAGES.ALREADY_FOLLOWED);

    await Promise.all([
      Follower.create({
        followerId: userId,
        followedId: followedUserId,
      }),
      User.findByIdAndUpdate(userId, {
        $inc: { "stats.followingCount": 1 },
      }),
      User.findByIdAndUpdate(followedUserId, {
        $inc: { "stats.followersCount": 1 },
      }),
    ]);

    return { success: true };
  }

  async unfollow(userId: string, followedUserId: string) {
    if (userId === followedUserId)
      throw new BadRequestError(USERS_MESSAGES.CANNOT_DO_SELF);

    const deletedFollow = await Follower.findOneAndDelete({
      followerId: userId,
      followedId: followedUserId,
    });
    if (!deletedFollow)
      throw new BadRequestError(USERS_MESSAGES.ALREADY_UNFOLLOWED);

    await Promise.all([
      User.findByIdAndUpdate(userId, {
        $inc: { "stats.followingCount": -1 },
      }),
      User.findByIdAndUpdate(followedUserId, {
        $inc: { "stats.followersCount": -1 },
      }),
    ]);

    return { success: true };
  }

  async getFollowers(userId: string, limit: number, page: number) {
    const skip = (page - 1) * limit;

    const followers = await Follower.find({ followedId: userId })
      .skip(skip)
      .limit(limit)
      // Chuyển followerId thành cục object User
      // Dữ liệu lớn thì ta dùng aggregate & $lookup
      .populate({
        // Tìm đến bảng users và userId là followerId
        // Rồi gán các thông tin đó vào đây
        path: "followerId",
        select: "-email",
      });

    const total = await Follower.countDocuments({ followedId: userId });

    return {
      users: followers.map((f) => f.followerId),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getFollowing(userId: string, limit: number, page: number) {
    const skip = (page - 1) * limit;

    const following = await Follower.find({ followerId: userId })
      .skip(skip)
      .limit(limit)
      // Dữ liệu lớn thì ta dùng aggregate & $lookup
      .populate({
        // Tìm đến bảng users và userId là followedId
        // Rồi gán các thông tin đó vào đây
        path: "followedId",
        select: "-email",
      });

    const total = await Follower.countDocuments({ followerId: userId });

    return {
      users: following.map((f) => f.followedId),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async changePassword(userId: string, payload: ChangePasswordBodyType) {
    const { oldPassword, password } = payload;

    const user = await User.findById(userId).select("+password");
    if (!user) throw new NotFoundError(USERS_MESSAGES.USER_NOT_FOUND);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      throw new UnauthorizedError(USERS_MESSAGES.OLD_PASSWORD_NOT_MATCH);

    user.password = password;
    // Phải gọi hàm save để kích hoạt pre-save hook
    await user.save();

    await RefreshToken.deleteMany({ userId: userId });

    return { success: true };
  }
}

const usersService = new UserService();
export default usersService;

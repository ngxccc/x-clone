import { TOKEN_TYPES, USER_VERIFY_STATUS } from "@/common/constants/enums.js";
import type {
  ChangePasswordBodyType,
  UpdateMeBodyType,
} from "./users.schemas.js";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@/common/utils/errors.js";
import bcrypt from "bcrypt";
import RefreshToken from "../auth/models/RefreshToken.js";
import User from "./models/User.js";
import Follower from "./models/Follower.js";
import type { RegisterBodyType } from "../auth/auth.schemas.js";
import type { TokenService } from "@/common/utils/jwt.js";
import { ERROR_CODES } from "@/common/constants/error-codes.js";
import mongoose from "mongoose";

export class UserService {
  public constructor(private readonly tokenService: TokenService) {}

  public async checkEmailExist(email: string) {
    // Mongoose unique cũng bắt được cái này
    // Nhưng check tay ở đây để trả về message thân thiện hơn.
    const user = await User.findOne({ email });
    return Boolean(user);
  }

  public async register(payload: RegisterBodyType) {
    const { name, username, email, password, dateOfBirth } = payload;

    const emailVerifyToken = await this.tokenService.signToken(
      {
        userId: "",
        tokenType: TOKEN_TYPES.EMAIL_VERIFY_TOKEN,
      },
      "email",
    );

    // Dùng .create() để kích hoạt Mongoose Validation & Hooks
    // Không dùng .insertOne vì nó không có Validation
    const newUser = await User.create({
      name,
      username,
      email,
      // Chỉ được chuyền trực tiếp khi đã cấu hình pre-save hook
      // Nếu không phải tự hash password
      password,
      dateOfBirth,
      emailVerifyToken,
    });

    return newUser.toObject();
  }

  public async getMe(userId: string) {
    const user = await User.findById(userId);

    if (!user) throw new NotFoundError({ code: ERROR_CODES.USERS.NOT_FOUND });

    return user;
  }

  public async getProfile(username: string, myUserId?: string) {
    const user = await User.findOne({ username }).select("-email");

    if (!user) throw new NotFoundError({ code: ERROR_CODES.USERS.NOT_FOUND });

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

  public async findUserByEmail(email: string) {
    return await User.findOne({ email });
  }

  public async findUserByEmailWithPassword(email: string) {
    return await User.findOne({ email }).select("+password");
  }

  public async findUserByEmailVerifyToken(token: string) {
    return await User.findOne({ emailVerifyToken: token });
  }

  public async findUserByForgotPasswordToken(token: string) {
    return await User.findOne({ forgotPasswordToken: token });
  }

  public async updateVerifyStatus(userId: string) {
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

  public async updateEmailVerifyToken(userId: string, token: string) {
    return await User.findByIdAndUpdate(
      userId,
      { $set: { emailVerifyToken: token } },
      { new: true },
    );
  }

  public async updateForgotPasswordToken(userId: string, token: string) {
    return await User.findByIdAndUpdate(
      userId,
      { $set: { forgotPasswordToken: token } },
      { new: true },
    );
  }

  public async updateMe(userId: string, payload: UpdateMeBodyType) {
    const { username } = payload;

    if (username) {
      const user = await User.findOne({ username });

      if (user && user.id !== userId)
        throw new ConflictError({
          code: ERROR_CODES.USERS.USERNAME_ALREADY_EXISTS,
        });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...payload, // Chỉ update những field có trong payload
        },
      },
      { returnDocument: "after", runValidators: true },
    );

    if (!user) throw new NotFoundError({ code: ERROR_CODES.USERS.NOT_FOUND });

    return user;
  }

  public async follow(userId: string, followedUserId: string) {
    if (userId === followedUserId) {
      throw new BadRequestError({ code: ERROR_CODES.USERS.CANNOT_ACTION_SELF });
    }

    const [user, followedUser] = await Promise.all([
      User.findById(userId),
      User.findById(followedUserId),
    ]);

    if (!user || !followedUser)
      throw new NotFoundError({ code: ERROR_CODES.USERS.NOT_FOUND });

    if (
      user.verify === USER_VERIFY_STATUS.BANNED ||
      followedUser.verify === USER_VERIFY_STATUS.BANNED
    ) {
      throw new ForbiddenError({ code: ERROR_CODES.USERS.ACCOUNT_IS_BANNED });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await Follower.create(
        [
          {
            followerId: userId,
            followedId: followedUserId,
          },
        ],
        { session },
      );

      await User.findByIdAndUpdate(
        userId,
        {
          $inc: { "stats.followingCount": 1 },
        },
        { session },
      );

      await User.findByIdAndUpdate(
        followedUserId,
        {
          $inc: { "stats.followersCount": 1 },
        },
        { session },
      );

      await session.commitTransaction();
      return { success: true };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  public async unfollow(userId: string, followedUserId: string) {
    if (userId === followedUserId) {
      throw new BadRequestError({ code: ERROR_CODES.USERS.CANNOT_ACTION_SELF });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const deletedFollow = await Follower.findOneAndDelete(
        {
          followerId: userId,
          followedId: followedUserId,
        },
        { session },
      );

      if (!deletedFollow) {
        throw new BadRequestError({ code: ERROR_CODES.USERS.NOT_FOLLOWED_YET });
      }

      await User.findByIdAndUpdate(
        userId,
        {
          $inc: { "stats.followingCount": -1 },
        },
        { session },
      );

      await User.findByIdAndUpdate(
        followedUserId,
        {
          $inc: { "stats.followersCount": -1 },
        },
        { session },
      );

      await session.commitTransaction();
      return { success: true };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  public async getFollowers(userId: string, limit: number, cursor?: string) {
    const query: Record<string, unknown> = { followedId: userId };

    if (cursor) {
      query._id = { $lt: cursor };
    }

    const followers = await Follower.find(query)
      .sort({ _id: -1 })
      .limit(limit)
      // Chuyển followerId thành cục object User
      // Dữ liệu lớn thì ta dùng aggregate & $lookup
      .populate({
        // Tìm đến bảng users và userId là followerId
        // Rồi gán các thông tin đó vào đây
        path: "followerId",
        select: "-email",
      });

    const nextCursor =
      followers.length > 0
        ? followers[followers.length - 1]?._id.toString()
        : null;

    return {
      users: followers.map((f) => f.followerId),
      nextCursor,
      limit,
    };
  }

  public async getFollowing(userId: string, limit: number, cursor?: string) {
    const query: Record<string, unknown> = { followerId: userId };

    if (cursor) {
      query._id = { $lt: cursor };
    }

    const following = await Follower.find(query)
      .sort({ _id: -1 })
      .limit(limit)
      // Dữ liệu lớn thì ta dùng aggregate & $lookup
      .populate({
        // Tìm đến bảng users và userId là followedId
        // Rồi gán các thông tin đó vào đây
        path: "followedId",
        select: "-email",
      });

    const nextCursor =
      following.length > 0
        ? following[following.length - 1]?._id.toString()
        : null;

    return {
      users: following.map((f) => f.followedId),
      nextCursor,
      limit,
    };
  }

  public async changePassword(userId: string, payload: ChangePasswordBodyType) {
    const { oldPassword, password } = payload;

    const user = await User.findById(userId).select("+password");
    if (!user) throw new NotFoundError({ code: ERROR_CODES.USERS.NOT_FOUND });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      throw new UnauthorizedError({
        code: ERROR_CODES.USERS.OLD_PASSWORD_NOT_MATCH,
      });

    user.password = password;
    // Phải gọi hàm save để kích hoạt pre-save hook
    await user.save();

    await RefreshToken.deleteMany({ userId: userId });

    return { success: true };
  }
}

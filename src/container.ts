import { FileService } from "./common/utils/file";
import { GoogleService } from "./common/utils/google";
import { TokenService } from "./common/utils/jwt";
import { QueueService } from "./common/utils/queue";
import { VideoService } from "./common/utils/video";
import { AuthController, AuthMiddleware, AuthService } from "./modules/auth";
import { MediaController, MediaService, VideoWorker } from "./modules/medias";
import { UserController, UserService } from "./modules/users";
import { DatabaseService } from "./services/database.services";

const tokenService = new TokenService();
const fileService = new FileService();
const videoService = new VideoService();
const databaseService = new DatabaseService();
const googleService = new GoogleService();
const queueService = new QueueService();
const userService = new UserService(tokenService);
const authService = new AuthService(userService, tokenService, googleService);
const mediaService = new MediaService(fileService, queueService);
const videoWorker = new VideoWorker(videoService);

const userController = new UserController(userService);
const authController = new AuthController(userService, authService);
const mediaController = new MediaController(mediaService);
const authMiddleware = new AuthMiddleware(userService, tokenService);

export {
  userService,
  authService,
  mediaService,
  databaseService,
  googleService,
  queueService,
  tokenService,
  fileService,
  videoService,
  videoWorker,
  userController,
  authController,
  mediaController,
  authMiddleware,
};

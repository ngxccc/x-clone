import { VideoService } from "./common/utils/video";
import { AuthController, AuthMiddleware, AuthService } from "./modules/auth";
import { MediaController, MediaService, VideoWorker } from "./modules/medias";
import { UserController, UserService } from "./modules/users";
import { DatabaseService } from "./services/database.services";

const userService = new UserService();
const authService = new AuthService(userService);
const mediaService = new MediaService();
const databaseService = new DatabaseService();
const videoService = new VideoService();
const videoWorker = new VideoWorker(videoService);

const userController = new UserController(userService);
const authController = new AuthController(userService, authService);
const mediaController = new MediaController(mediaService);
const authMiddleware = new AuthMiddleware(userService);

export {
  userService,
  authService,
  mediaService,
  databaseService,
  videoService,
  videoWorker,
  userController,
  authController,
  mediaController,
  authMiddleware,
};

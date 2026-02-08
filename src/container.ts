import { AuthController, AuthMiddleware, AuthService } from "./modules/auth";
import { MediaController, MediaService } from "./modules/medias";
import { UserController, UserService } from "./modules/users";
import { DatabaseService } from "./services/database.services";

const userService = new UserService();
const authService = new AuthService(userService);
const mediaService = new MediaService();
const databaseService = new DatabaseService();

const userController = new UserController(userService);
const authController = new AuthController(userService, authService);
const mediaController = new MediaController(mediaService);
const authMiddleware = new AuthMiddleware(userService);

export {
  userService,
  authService,
  mediaService,
  databaseService,
  userController,
  authController,
  mediaController,
  authMiddleware,
};

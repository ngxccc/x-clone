import { uploadImageController } from "@/controllers/medias.controllers.js";
import { accessTokenValidator } from "@/middlewares/auth.middlewares.js";
import { Router } from "express";

const mediasRouter = Router();

mediasRouter.post("/upload-image", accessTokenValidator, uploadImageController);

export default mediasRouter;

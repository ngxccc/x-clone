import express from "express";
import authRouter from "./routes/auth.routes.js";
import databaseService from "./services/database.services.js";
import { defaultErrorHandler } from "./middlewares/error.middlewares.js";
import usersRouter from "./routes/users.routes.js";
import { NotFoundError } from "./utils/errors.js";
import { USERS_MESSAGES } from "./constants/messages.js";
import cors from "cors";

const app = express();
const port = process.env.PORT;

databaseService.connect();

// Bỏ qua lớp trung gian (Cloudflare / Nginx)
app.set("trust proxy", 1);

// Cấu hình CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// Middelware parse JSON from client
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);

app.use((_req, _res, next) => {
  next(new NotFoundError(USERS_MESSAGES.API_ENDPOINT_NOT_FOUND));
});

// Error Handler phải nằm sau tất cả các route
app.use(defaultErrorHandler);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

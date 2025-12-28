import express from "express";
import authRouter from "./routes/auth.routes.js";
import databaseService from "./services/database.services.js";
import { defaultErrorHandler } from "./middlewares/error.middlewares.js";

const app = express();
const port = process.env.PORT;

databaseService.connect();

// Bỏ qua lớp trung gian (Cloudflare / Nginx)
app.set("trust proxy", 1);

// Middelware parse JSON from client
app.use(express.json());

app.use("/api/auth", authRouter);

// Error Handler phải nằm sau tất cả các route
app.use(defaultErrorHandler);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

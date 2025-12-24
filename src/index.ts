import express from "express";
import authRouter from "./routes/auth.routes.js";
import databaseService from "./services/database.services.js";

const app = express();
const port = process.env.PORT;

databaseService.connect();

// Middelware parse JSON from client
app.use(express.json());

app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

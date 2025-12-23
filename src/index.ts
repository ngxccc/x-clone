import express from "express";
import productRouter from "./routes/product.routes.js";
import usersRouter from "./routes/users.routes.js";
import databaseService from "./services/database.services.js";

const app = express();
const port = 4000;

databaseService.connect();

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// Middelware parse JSON from client
app.use(express.json());

// Tạo route cha là /products
app.use("/products", productRouter);

app.use("/users", usersRouter);

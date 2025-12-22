import express from "express";
import productRouter from "./routes/product.routes.js";
import usersRouter from "./routes/users.routes.js";

const app = express();
const port = 4000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// Middelware parse JSON from client
app.use(express.json());

// Tạo route cha là /products
app.use("/products", productRouter);

app.use("/users", usersRouter);

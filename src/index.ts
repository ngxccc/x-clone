import express from "express";

const app = express();
const port = 4000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/products/:productId", (req, res) => {
  console.log(req.params);
  res.send(req.params);
});

import { NextFunction, Request, Response, Router } from "express";

const productRouter = Router();

// Đây gọi là Middleware handler
const checkId = (req: Request, res: Response, next: NextFunction) => {
  if (req.params.productId === "0") res.send("Lỗi: ID không được bằng 0!");
  next();
};

// Route con method: post, path: /create
// Với handler trả về client đoạn text
// Luôn đặt route tĩnh trước route động
// tránh route động coi route tĩnh là một param
productRouter.get("/create", (_, res) => {
  res.send("Trang tạo sản phẩm mới");
});

// Route động (có : phía trước)
productRouter.get("/:productId", checkId, (req, res) => {
  res.send(`Bạn đang xem sản phẩm: ${req.params.productId} từ (Router)`);
});

export default productRouter;

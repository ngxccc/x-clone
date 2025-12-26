import { HTTP_STATUS } from "@/constants/httpStatus.js";
import { NextFunction, Request, Response } from "express";
import z, { ZodObject } from "zod";

export const validate =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.is("application/json")) {
        return res.status(HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE).json({
          message:
            "Vui lòng gửi định dạng JSON (Content-Type: application/json)",
        });
      }

      const data = await schema.safeParseAsync(req.body);

      if (!data.success) {
        return res.status(400).json({
          message: "Lỗi dữ liệu đầu vào",
          errors: z.flattenError(data.error).fieldErrors, // Format lỗi gọn gàng
        });
      }

      // Loại bỏ các field rác mà client gửi lên
      req.body = data.data;

      next();
    } catch (error) {
      next(error);
    }
  };

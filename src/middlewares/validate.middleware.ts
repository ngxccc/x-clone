import { HTTP_STATUS } from "@/constants/httpStatus.js";
import { USERS_MESSAGES } from "@/constants/messages.js";
import { NextFunction, Request, Response } from "express";
import z, { ZodObject } from "zod";

export const validate =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.is("application/json")) {
        return res.status(HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE).json({
          message: USERS_MESSAGES.INVALID_CONTENT_TYPE,
        });
      }

      const data = await schema.safeParseAsync(req.body);

      if (!data.success) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: USERS_MESSAGES.INVALID_INPUT_DATA,
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

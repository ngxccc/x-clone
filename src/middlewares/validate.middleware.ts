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

export const validateParams =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await schema.safeParseAsync(req.params);

      if (!data.success) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: USERS_MESSAGES.INVALID_INPUT_DATA,
          errors: z.flattenError(data.error).fieldErrors, // Format lỗi gọn gàng
        });
      }

      req.params = data.data as Record<string, string>;

      next();
    } catch (error) {
      next(error);
    }
  };

export const validateQuery =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await schema.safeParseAsync(req.query);

      if (!data.success) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: USERS_MESSAGES.INVALID_INPUT_DATA,
          errors: z.flattenError(data.error).fieldErrors, // Format lỗi gọn gàng
        });
      }

      // Xoá các key thừa
      for (const key in req.query) {
        delete req.query[key];
      }

      // Copy dữ liệu đã validate/coerce vào lại req.query
      // Vì req.query không cho gán trực tiếp
      Object.assign(req.query, data.data);

      next();
    } catch (error) {
      next(error);
    }
  };

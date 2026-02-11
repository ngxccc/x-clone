import { HTTP_STATUS } from "@/common/constants/httpStatus.js";
import { USERS_MESSAGES } from "@/common/constants/messages.js";
import type { NextFunction, Request, Response } from "express";
import type { ZodObject, ZodPipe } from "zod";
import z from "zod";

export const validate =
  (schema: ZodObject | ZodPipe) =>
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
          message: USERS_MESSAGES.INVALID_PARAM_DATA,
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
          message: USERS_MESSAGES.INVALID_QUERY_DATA,
          errors: z.flattenError(data.error).fieldErrors, // Format lỗi gọn gàng
        });
      }

      // Lưu validated data vào custom property
      // req.query giữ nguyên (string), req.validatedQuery chứa typed data
      req.validatedQuery = data.data;

      next();
    } catch (error) {
      next(error);
    }
  };

export const validateCookies =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await schema.safeParseAsync(req.cookies);

      if (!data.success) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: USERS_MESSAGES.INVALID_COOKIE_DATA,
          errors: z.flattenError(data.error).fieldErrors,
        });
      }

      req.cookies = data.data;

      next();
    } catch (error) {
      next(error);
    }
  };

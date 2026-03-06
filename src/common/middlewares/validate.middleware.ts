import type { NextFunction, Request, Response } from "express";
import type { ZodObject, ZodPipe } from "zod";
import z from "zod";
import { BadRequestError, EntityError } from "../utils/errors";
import { ERROR_CODES } from "../constants/error-codes";

export const validate =
  (schema: ZodObject | ZodPipe) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (
        req.headers["content-length"] &&
        req.headers["content-length"] !== "0" &&
        !req.is("application/json")
      ) {
        throw new BadRequestError({
          code: ERROR_CODES.VALIDATION.UNSUPPORTED_MEDIA_TYPE,
          message: "Content-Type must be application/json",
        });
      }

      const parsed = await schema.safeParseAsync(req.body);

      if (!parsed.success) {
        throw new EntityError({
          code: ERROR_CODES.VALIDATION.INVALID_BODY,
          details: z.flattenError(parsed.error).fieldErrors,
        });
      }

      // Loại bỏ các field rác mà client gửi lên
      req.body = parsed.data;

      next();
    } catch (error) {
      next(error);
    }
  };

export const validateParams =
  (schema: ZodObject) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.safeParseAsync(req.params);

      if (!parsed.success) {
        throw new EntityError({
          code: ERROR_CODES.VALIDATION.INVALID_PARAMS,
          details: z.flattenError(parsed.error).fieldErrors,
        });
      }

      req.params = parsed.data as Record<string, string>;

      next();
    } catch (error) {
      next(error);
    }
  };

export const validateQuery =
  (schema: ZodObject) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.safeParseAsync(req.query);

      if (!parsed.success) {
        throw new EntityError({
          code: ERROR_CODES.VALIDATION.INVALID_QUERY,
          details: z.flattenError(parsed.error).fieldErrors,
        });
      }

      // Lưu validated data vào custom property
      // req.query giữ nguyên (string), req.validatedQuery chứa typed data
      req.validatedQuery = parsed.data;

      next();
    } catch (error) {
      next(error);
    }
  };

export const validateCookies =
  (schema: ZodObject) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.safeParseAsync(req.cookies);

      if (!parsed.success) {
        throw new EntityError({
          code: ERROR_CODES.VALIDATION.INVALID_COOKIES,
          details: z.flattenError(parsed.error).fieldErrors,
        });
      }

      req.cookies = parsed.data;

      next();
    } catch (error) {
      next(error);
    }
  };

import {
  OpenAPIRegistry,
  type RouteConfig,
} from "@asteasolutions/zod-to-openapi";
import { COMMON_ERRORS } from "./http-responses";

export const registry = new OpenAPIRegistry();

registry.registerComponent("securitySchemes", "BearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

/**
 * Wrapper Function để đăng ký Route
 * Tự động thêm các response lỗi (400, 422, 500...)
 * Tự động thêm Security (BearerAuth) nếu là private route
 */
interface CustomRouteConfig extends RouteConfig {
  isPublic?: boolean;
}

export const registerRoute = (config: CustomRouteConfig) => {
  const { isPublic = false, responses, ...rest } = config;

  const mergedResponses = {
    ...COMMON_ERRORS, // lỗi chuẩn
    ...responses, // res riêng
  };

  // Tự động thêm BearerAuth nếu không phải public
  const security = isPublic ? [] : [{ BearerAuth: [] }];

  registry.registerPath({
    ...rest,
    security: config.security ?? security,
    responses: mergedResponses,
  });
};

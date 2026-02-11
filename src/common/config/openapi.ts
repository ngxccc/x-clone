import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
  type RouteConfig,
} from "@asteasolutions/zod-to-openapi";
import { version } from "../../../package.json";
import envConfig from "./env";
import { registerAuthDocs } from "@/modules/auth";
import { COMMON_ERRORS } from "./http-responses";

export const registry = new OpenAPIRegistry();

registry.registerComponent("securitySchemes", "BearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

export const generateOpenAPIDocument = () => {
  registerAuthDocs();

  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    // use 3.x.x cuz it's popular
    openapi: "3.0.0",
    info: {
      title: "X-Clone API",
      version: version,
      description: "API Documentation generated from Zod Schemas",
    },
    servers: [{ url: `http://localhost:${envConfig.PORT}` }],
  });
};

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

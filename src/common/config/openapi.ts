import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { version } from "../../../package.json";
import envConfig from "./env";
import { registerAuthDocs } from "@/modules/auth";

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

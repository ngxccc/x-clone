import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { version } from "../../../package.json";
import envConfig from "./env";
import { registerAuthDocs } from "@/modules/auth";
import { registerMediasDocs } from "@/modules/medias";
import { registerUsersDocs } from "@/modules/users";
import { registerTweetsDocs } from "@/modules/tweets";
import { registry } from "./registry";

export const generateOpenAPIDocument = () => {
  registerAuthDocs();
  registerMediasDocs();
  registerUsersDocs();
  registerTweetsDocs();

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

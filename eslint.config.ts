import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
  globalIgnores(["**/.bun/", "**/build/", "**/dist/", "**/node_modules/"]),

  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked, // Check cả type
  tseslint.configs.stylisticTypeChecked, // Check type để quyết định phong cách
  // Tắt các rule xung đột với Prettier
  eslintPluginPrettierRecommended,

  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], // apply cho tất cả các định dạng file

    languageOptions: {
      // phiên dịch cho eslint hiểu code
      parserOptions: {
        projectService: {
          // cấp "Giấy phép tạm trú" để được check bởi tsconfig.json chính
          allowDefaultProject: ["eslint.config.ts"],
          defaultProject: "tsconfig.json",
        },
        tsconfigRootDir: import.meta.dirname,
      },
      globals: globals.node,
    },

    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              // modules/blog/chat.service chặn
              // modules/chat OK cần index.ts
              group: ["**/modules/*/*"],
              message:
                "Private internal access! Please import from the public interface (index.ts) of the module.",
            },
            {
              // Ngăn import ngược từ index.ts gây Circular Dependency
              group: ["@/index.ts"],
              message: "Modules should not import from App layer.",
            },
          ],
        },
      ],

      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports", // Bắt buộc dùng import type
          fixStyle: "separate-type-imports", // Tự động fix thành: import type { Metadata } ...
        },
      ],
    },
  },

  {
    rules: {
      ...eslintConfigPrettier.rules,

      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      "prettier/prettier": "warn",
    },
  },
]);

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
    languageOptions: {
      // phiên dịch cho eslint hiểu code
      parserOptions: {
        projectService: {
          // cấp "Giấy phép tạm trú" để được check bởi tsconfig.json chính
          // allowDefaultProject: ["eslint.config.ts"],
          defaultProject: "tsconfig.eslint.json",
        },
        tsconfigRootDir: import.meta.dirname,
      },
      globals: globals.node,
    },

    rules: {
      ...eslintConfigPrettier.rules,

      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        { accessibility: "explicit" }, // Bắt buộc phải viết public/private
      ],

      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports", // Bắt buộc dùng import type
          fixStyle: "separate-type-imports", // Tự động fix thành: import type { Metadata } ...
        },
      ],

      "prettier/prettier": "warn",
    },
  },

  {
    files: ["src/**/*.ts", "!src/modules/**/*.ts"],
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
          ],
        },
      ],
    },
  },

  {
    files: ["src/modules/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              // 🚫 Cấm import kiểu: "@/modules/auth" hoặc "@/modules/auth/"
              // Bắt buộc phải trỏ sâu vào file cụ thể
              // ^@/modules/     : Bắt đầu bằng @/modules/
              // [^/]+           : Sau đó là tên module (không có dấu / tiếp theo)
              // /?              : Có thể có dấu / thừa ở cuối
              // (/index(\.(ts|js))?)? : Hoặc trỏ đích danh vào /index, /index.ts, /index.js
              regex: "^@/modules/[^/]+/?(/index(\\.(ts|js))?)?$",
              message:
                "Please import directly from the specific file to avoid Circular Dependency (e.g., '@/modules/auth/models/User'). Do not import from the module index.",
            },
            {
              // 🚫 Cấm import relative trỏ ngược ra index cha
              // VD: import ... from "../index"
              group: ["**/index"],
              message:
                "Do not import from barrel files (index.ts) inside modules.",
            },
            {
              // Ngăn import ngược từ App layer gây Circular Dependency
              regex: "^@/(app|server|container)(/.*)?(.(ts|js))?$",
              message: "Modules should not import from App layer.",
            },
          ],
        },
      ],
    },
  },
]);

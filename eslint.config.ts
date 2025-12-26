import js from "@eslint/js";
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
  },

  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "off",
      "prettier/prettier": [
        "warn",
        {
          arrowParens: "always",
          semi: true,
          tabWidth: 2,
          endOfLine: "auto",
          useTabs: false,
          printWidth: 80,
          trailingComma: "all",
          singleQuote: false,
          jsxSingleQuote: false,
          bracketSpacing: true,
          jsxBracketSameLine: false,
          proseWrap: "preserve",
        },
      ],
    },
    ignores: ["**/node_modules/", "**/dist/"],
  },

  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  // Tắt các rule xung đột với Prettier
  eslintConfigPrettier,
]);

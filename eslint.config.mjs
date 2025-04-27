import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["server/**/*.{js,mjs,cjs}"], // 서버 폴더
    languageOptions: {
      globals: globals.node,
    },
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["public/**/*.{js,mjs,cjs}"], // 퍼블릭 폴더
    languageOptions: {
      globals: globals.browser,
    },
    plugins: { js },
    extends: ["js/recommended"],
  },
]);

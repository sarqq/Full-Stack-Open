import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import stylisticJS from "@stylistic/eslint-plugin";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: {
      js,
      "@stylistic/js": stylisticJS
    },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.node
    },
    rules: { 
      '@stylistic/js/indent': ['error', 4],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
    }, 
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs"
    }
  },
  pluginReact.configs.flat.recommended,
]);

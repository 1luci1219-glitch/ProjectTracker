import parser from "@typescript-eslint/parser";

export default [
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"]
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true }
      }
    },
    rules: {}
  }
];

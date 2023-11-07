module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:md/recommended", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "no-use-before-define": "off",
    "list-item-spacing": "off",
  },
  overrides: [
    {
      files: ["*.md"],
      parser: "markdown-eslint-parser",
      rules: {
        "md/remark:list-item-spacing": "off",
        "list-item-spacing": "off",
      },
    },
  ],
}

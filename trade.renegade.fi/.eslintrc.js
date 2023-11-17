module.exports = {
  root: true,
  env: {
    es2020: true,
  },
  extends: ["next/core-web-vitals", "prettier"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "off",
    "chakra-ui/props-order": "error",
    "chakra-ui/props-shorthand": [
      "error",
      {
        noShorthand: true,
      },
    ],
  },
  settings: {
    next: {
      rootDir: ["./"],
    },
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      plugins: ["chakra-ui"],
    },
  ],
}

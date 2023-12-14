module.exports = {
    root: true,
    env: {
        es2020: true,
    },
    extends: ["next/core-web-vitals", "prettier"],
    rules: {
        "@next/next/no-html-link-for-pages": "off",
        "chakra-ui/props-order": "error",
        "no-else-return": ["error", { allowElseIf: false }],
        "prefer-const": "error",
        "prefer-template": "error",
        "react/jsx-key": "off",
        "react/self-closing-comp": "error",
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
            parserOptions: {
                project: ["./tsconfig.json"], // Specify it only for TypeScript files
            },
        },
    ],
}

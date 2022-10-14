module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'plugin:md/recommended',
    'standard'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'react',
    '@typescript-eslint'
  ],
  rules: {
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'node/no-callback-literal': 'off',
    'no-unmodified-loop-condition': 'off',
    'react/no-unescaped-entities': 'off'
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  overrides: [
    {
      files: ['*.md'],
      parser: 'markdown-eslint-parser',
    }
  ]
}

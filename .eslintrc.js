module.exports = {
  root: true,
  globals: {
    acquireVsCodeApi: 'readonly',
  },
  overrides: [
    {
      files: ['src/**/*.ts'],
      extends: ['y-ts-base'],
      rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
      },
    },
    {
      files: ['resource/**/*.js'],
      extends: ['y-base'],
    },
    {
      files: ['**/*.test.ts'],
      rules: {
        'func-names': 'off',
      },
    },
  ],
  settings: {
    'import/core-modules': ['vscode'],
  },
};

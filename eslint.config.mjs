import { defineConfig, globalIgnores } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import tsEslint from 'typescript-eslint';

const eslintConfig = defineConfig([
  tsEslint.configs.recommended,
  globalIgnores(['dist/**/*', 'node_modules/**/*']),
  {
    languageOptions: {
      parser: tsEslint.parser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
      '@typescript-eslint': tsEslint.plugin,
    },
    rules: {
      'import/first': 'error',
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            {
              pattern: './configs/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: './middlewares/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: './modules/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: './common/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/exports-last': 'error',
      'prettier/prettier': 'error',
    },
  },
  prettierConfig,
]);

export default eslintConfig;

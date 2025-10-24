import { defineConfig, globalIgnores } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tsEslint from 'typescript-eslint';

const eslintConfig = defineConfig([
  tsEslint.configs.recommended,
  globalIgnores(['dist/**/*', 'node_modules/**/*', 'drizzle/**/*']),
  {
    languageOptions: {
      parser: tsEslint.parser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      prettier: prettierPlugin,
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
      '@typescript-eslint': tsEslint.plugin,
    },
    rules: {
      'prettier/prettier': 'error',
      'import/first': 'error',
      'import/exports-last': 'error',
      'import/no-duplicates': 'error',
      'import/order': 'off',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'],
            ['^@?\\w'],
            ['^(\\.\\.\\/|\\.\\/)*configs\\/'],
            ['^(\\.\\.\\/|\\.\\/)*common\\/'],
            ['^(\\.\\.\\/|\\.\\/)*middlewares\\/'],
            ['^(\\.\\.\\/|\\.\\/)*modules\\/'],
            ['^(\\.\\.\\/|\\.\\/)*types\\/'],
            ['^\\.\\.\\/'],
            ['^\\./'],
          ],
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  prettierConfig,
]);

export default eslintConfig;

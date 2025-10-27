import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import nxEslintPlugin from '@nx/eslint-plugin';
import eslintPluginImport from 'eslint-plugin-import';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
});

export default [
  {
    ignores: ['**/dist'],
  },
  {
    plugins: {
      '@nx': nxEslintPlugin,
      import: eslintPluginImport,
    },
  },
  { languageOptions: { globals: { JSX: true, NodeJS: true } } },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      // 'react/jsx-no-useless-fragment': [
      //   'warn',
      //   {
      //     allowExpressions: true,
      //   },
      // ],
      // 'react-hooks/exhaustive-deps': 'off',
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          distinctGroup: false,
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@mui/material',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@mui/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@jc/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '**/*.+(css|sass|less|scss|pcss|styl)',
              patternOptions: {
                dot: true,
                nocomment: true,
              },
              group: 'unknown',
              position: 'after',
            },
            {
              pattern: '{.,..}/**/*.+(css|sass|less|scss|pcss|styl)',
              patternOptions: {
                dot: true,
                nocomment: true,
              },
              group: 'unknown',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          warnOnUnassignedImports: true,
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          groups: [
            ['builtin', 'external'],
            ['internal'],
            ['parent', 'sibling', 'index'],
            ['type', 'object', 'unknown'],
          ],
        },
      ],
    },
  },
  ...compat
    .config({
      extends: ['plugin:@nx/typescript'],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'],
      rules: {
        ...config.rules,
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            ignoreRestSiblings: true,
            destructuredArrayIgnorePattern: '[A-Z]',
            caughtErrors: 'none',
          },
        ],
        // '@typescript-eslint/ban-types': [
        //   'error',
        //   {
        //     types: {
        //       '{}': {
        //         message:
        //           "If you want a type meaning 'any object', you probably want `Record<string, unknown>` instead. If you want a type meaning 'any value', you probably want `unknown` instead. If you want a type meaning 'empty object', you probably want `Record<string, never>` instead.",
        //         fixWith: 'Record<string, unknown>',
        //       },
        //       String: {
        //         message: 'Use string instead',
        //         fixWith: 'string',
        //       },
        //       Number: {
        //         message: 'Use number instead',
        //         fixWith: 'number',
        //       },
        //       Boolean: {
        //         message: 'Use boolean instead',
        //         fixWith: 'boolean',
        //       },
        //       Function: {
        //         message:
        //           'The Function type accepts any function-like value. It provides no type safety when calling the function, which can be a common source of bugs. It also accepts things like class declarations, which will throw at runtime as they will not be called with new. For a function that takes no args and returns nothing use: `()=> void`',
        //         fixWith: '(...args: unknown) => unknown',
        //       },
        //       any: {
        //         message:
        //           '`unknown` is recommended over `any` because it provides safer typing \u2014 you have to use type assertion or narrow to a specific type if you want to perform operations on unknown.',
        //         fixWith: 'unknown',
        //       },
        //     },
        //     extendDefaults: true,
        //   },
        // ],
        'no-undef': 'error',
      },
    })),
  ...compat
    .config({
      extends: ['plugin:@nx/javascript'],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
      rules: {
        ...config.rules,
        'no-unused-vars': 'error',
        'no-undef': 'error',
      },
    })),
  ...compat
    .config({
      env: {
        jest: true,
      },
    })
    .map((config) => ({
      ...config,
      files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],
      rules: {
        ...config.rules,
      },
    })),
];

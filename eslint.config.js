import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';
import stylistic from '@stylistic/eslint-plugin'
import vitest from "@vitest/eslint-plugin"
import perfectionist from "eslint-plugin-perfectionist";

export default defineConfig([
    {
        ignores: ['dist/', 'node_modules/'],
    },
    js.configs.recommended,
    {
        files: ['src/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
        plugins: {
            '@stylistic': stylistic,
            "perfectionist": perfectionist,
        },
        extends: [
            tseslint.configs.recommended,
            tseslint.configs.recommendedTypeChecked,
            tseslint.configs.strict,
            stylistic.configs.recommended,
        ],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2022,
            sourceType: 'script',
            parserOptions: {
                project: ['./tsconfig.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            // Base ESLint rules
            'array-callback-return': 'error',
            'guard-for-in': 'error',
            'no-array-constructor': 'error',
            'no-implied-eval': 'error',
            'no-sequences': 'error',
            'no-var': 'error',
            'prefer-arrow-callback': 'error',
            'prefer-const': 'error',
            'prefer-numeric-literals': 'error',
            'prefer-rest-params': 'error',
            'prefer-template': 'error',
            'arrow-body-style': ['error', 'as-needed'],
            'func-style': ['error', 'declaration', {
                allowArrowFunctions: true,
            }],
            curly: ['error', 'all'],
            eqeqeq: ['error', 'always', {
                null: 'ignore',
            }],
            camelcase: ['error', {
                properties: 'always',
            }],
            'object-shorthand': ['error', 'always'],
            'operator-assignment': ['error', 'always'],

            // TypeScript ESLint rules
            '@typescript-eslint/explicit-function-return-type': [
                'error',
                {
                    allowExpressions: true,
                    allowHigherOrderFunctions: true,
                    allowTypedFunctionExpressions: true,
                },
            ],
            '@typescript-eslint/no-floating-promises': 'error',

            // Replaced by TypeScript
            'no-undef': 'off',

            // Extended by typescript-eslint
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'error',
            'require-await': 'off',
            '@typescript-eslint/require-await': 'error',
            'no-use-before-define': 'off',
            '@typescript-eslint/no-use-before-define': ['error', 'nofunc'],

            // Migrated to stylistic plugin rules
            '@stylistic/block-spacing': ['error', 'always'],
            '@stylistic/brace-style': ['error', '1tbs'],
            '@stylistic/comma-dangle': ['error', 'always-multiline'],
            '@stylistic/comma-spacing': 'error',
            '@stylistic/function-call-spacing': ['error', 'never'],
            '@stylistic/indent': ['error', 4, {
                VariableDeclarator: 'first',
                SwitchCase: 0,
            }],
            '@stylistic/key-spacing': 'error',
            '@stylistic/keyword-spacing': 'error',
            '@stylistic/no-extra-parens': ['error', 'all', {
                conditionalAssign: false,
                ignoreJSX: 'multi-line',
            }],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/semi-spacing': ['error', {
                before: false,
                after: true,
            }],
            '@stylistic/eol-last': 'error',
            '@stylistic/new-parens': ['error', 'always'],
            '@stylistic/no-multi-spaces': ['error', { ignoreEOLComments: false }],
            '@stylistic/no-trailing-spaces': 'error',
            '@stylistic/no-whitespace-before-property': 'error',
            '@stylistic/space-infix-ops': 'error',
            '@stylistic/array-bracket-newline': ['error', 'consistent'],
            '@stylistic/array-bracket-spacing': ['error', 'never'],
            '@stylistic/array-element-newline': ['error', 'consistent'],
            '@stylistic/arrow-parens': ['error', 'as-needed'],
            '@stylistic/arrow-spacing': ['error', {
                before: true,
                after: true,
            }],
            '@stylistic/comma-style': ['error', 'last'],
            '@stylistic/computed-property-spacing': ['error', 'never'],
            '@stylistic/dot-location': ['error', 'property'],
            '@stylistic/function-paren-newline': ['error', 'multiline'],
            '@stylistic/implicit-arrow-linebreak': ['error', 'beside'],
            '@stylistic/linebreak-style': ['error', 'unix'],
            '@stylistic/no-multiple-empty-lines': ['error', {
                max: 2,
            }],
            '@stylistic/object-curly-newline': ['error', {
                multiline: true,
                consistent: true,
            }],
            '@stylistic/object-curly-spacing': ['error', 'never'],
            '@stylistic/object-property-newline': ['error', {
                allowAllPropertiesOnSameLine: true,
            }],
            '@stylistic/padded-blocks': ['error', 'never'],
            '@stylistic/quote-props': ['error', 'consistent-as-needed'],
            '@stylistic/quotes': ['error', 'single', {
                avoidEscape: true,
            }],
            '@stylistic/semi-style': ['error', 'last'],
            '@stylistic/space-before-blocks': ['error', 'always'],
            '@stylistic/space-before-function-paren': ['error', 'always'],
            '@stylistic/space-in-parens': ['error', 'never'],
            '@stylistic/space-unary-ops': ['error', {
                words: true,
                nonwords: false,
            }],
            '@stylistic/spaced-comment': ['error', 'always'],
            '@stylistic/switch-colon-spacing': ['error', {
                before: false,
                after: true,
            }],
            '@stylistic/template-curly-spacing': ['error', 'never'],
            '@stylistic/template-tag-spacing': ['error', 'never'],
            '@stylistic/wrap-iife': ['error', 'inside'],

            // Perfectionist rules
            "perfectionist/sort-jsx-props": ["error",
                {
                    type: "alphabetical",
                    order: "asc",
                    ignoreCase: true,
                }],
            "perfectionist/sort-classes": ["error",
                {
                    type: "alphabetical",
                    order: "asc",
                    ignoreCase: true,
                    specialCharacters: "keep",
                    partitionByComment: true,
                    partitionByNewLine: false,
                    newlinesBetween: 1,
                    groups: [
                        'index-signature',
                        'static-property',
                        'static-block',
                        ['protected-property', 'protected-accessor-property'],
                        ['private-property', 'private-accessor-property'],
                        ['property', 'accessor-property'],
                        'constructor',
                        'static-method',
                        'protected-method',
                        'private-method',
                        ['get-method', 'set-method'],
                        'method',
                        'function-property',
                        'unknown',
                    ]
                }
            ],
            "perfectionist/sort-imports": ["error", {
                "partitionByComment": true,
            }],
            "perfectionist/sort-exports": ["error", {
                "partitionByComment": true,
            }],
            "perfectionist/sort-named-imports": ["error", {
                "partitionByComment": true,
            }],
            "perfectionist/sort-named-exports": ["error", {
                "partitionByComment": true,
            }],
        },
    },
    {
        files: ['src/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
        plugins: {
            "vitest": vitest,
        }
    }
]);

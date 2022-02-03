module.exports = {
    'env': {
        'browser': true
        , 'es6': true
    }
    , 'extends': [
        'eslint:recommended'
        , 'plugin:@typescript-eslint/eslint-recommended'
        , 'plugin:@typescript-eslint/recommended'
        , 'plugin:typescript-sort-keys/recommended'
    ]
    , 'globals': {
        'Atomics': 'readonly'
        , 'SharedArrayBuffer': 'readonly'
    }
    , 'parser': '@typescript-eslint/parser'
    , 'parserOptions': {
        'ecmaVersion': 11
        , 'sourceType': 'module'
    }
    , 'plugins': [
        , '@typescript-eslint'
        , 'typescript-sort-keys'
        , 'import'
    ]
    , 'rules': {
        // Enforce Array<> in TypeScript
        '@typescript-eslint/array-type': [
            'error'
            , {
                'default': 'generic'
            }
        ]
        // Enforce error when variable is not used, except for underscores
        , '@typescript-eslint/no-unused-vars': [
            'error'
            , {
                'args': 'after-used'
                // Allow our underscores for unused variables
                , 'argsIgnorePattern': '^_+$'
                , 'ignoreRestSiblings': false
                , 'vars': 'all'
            }
        ]
        // Enforces that arrow functions with a single argument do not need parentheses
        , 'arrow-parens': [
            'error'
            , 'as-needed'
        ]
        // Enforces that all dangling commas have to be removed
        , 'comma-dangle': [
            'error'
            , 'never'
        ]
        // Enforces curly brackets around if, else, for, while or do blocks, even they are single lined
        , 'curly': 'error'
        // Enforce newline at the end of file
        , 'eol-last': 'error'
        // Enforce usage of type safe comparison like === and !==
        , 'eqeqeq': 'error'
        // Enforces a newline after the import statements
        , 'import/newline-after-import': 'error'
        // Enforces that no absolute paths are used in imports
        , 'import/no-absolute-path': 'error'
        // Enforces that no relative paths are used in imports
        , 'import/no-relative-parent-imports': 'error'
        , 'import/order': [
            'error'
            , {
                'alphabetize': {
                    'caseInsensitive': true
                    , 'order': 'asc'
                }
            }
        ]
        // Enforce maximum line length of 120, except in comments
        , 'max-len': [
            'error'
            , {
                'code': 120
                , 'ignoreComments': true
                , 'tabWidth': 4
            }
        ]
        // Enforce that no alert() is used
        , 'no-alert': 'error'
        // Enforce that no console is used
        , 'no-console': 'error'
        // Enforce that no eval() is used
        , 'no-eval': 'error'
        // The default no-shadow must be turned of, because it collides with some typescript declarations, like f.ex
        // error: (error: Error) => void
        // because the default rule does not understand, that the type declaration is no real arrow function.
        // see https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-shadow.md
        , 'no-shadow': 'off'
        , '@typescript-eslint/no-shadow': 'error'
        // Enforce that no reserved words are used as object keys
        , 'quote-props': [
            'error'
            , 'as-needed'
            , {
                'keywords': true
                , 'numbers': true
                , 'unnecessary': true
            }
        ]
        // Enforce the use of single quotes
        , 'quotes': [
            'error'
            , 'single'
            , {
                'allowTemplateLiterals': true
                , 'avoidEscape': true
            }
        ]
        // Enforce radix when using parseInt()
        , 'radix': 'error'
        // Enforce usage of semicolons at the end of a statement
        , 'semi': [
            'error'
            , 'always'
        ]
        // Enforce sorting of keys in an object
        , 'sort-keys': 'error'
        // IMPORTANT! The following linter rules are deactivated for now and should be checked
        , '@typescript-eslint/no-explicit-any': 'off'
        , '@typescript-eslint/no-inferrable-types': 'off'
        , 'no-prototype-builtins': 'off'
        , 'no-unused-vars': 'off'
        , 'prefer-spread': 'off'
        // IMPORTANT! The following linter rules are deactivated for now, but should be removes step by step
        , '@typescript-eslint/explicit-module-boundary-types': 'off'
        , '@typescript-eslint/no-empty-function': 'off'
    }
};

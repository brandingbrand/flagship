# FSCodeStyle

This repository contains a set of linting rules for TypeScript React projects. These are the same
rules used by Flagship. If you're developing a project using Flagship, we recommend enforcing these rules.

## Pre-Requisites

Your project must have the following:

* A [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) file indicating
  the root files and base directories for the TypeScript compiler

## Usage

1. Add a dependency in your project `yarn add @brandingbrand/fscodestyle`
2. Add a lint script to your package.json `"lint": "fscodestyle"`

We recommend you set this up as a precommit hook using [Husky](https://github.com/typicode/husky)

## Linting

The linter uses [tslint](https://github.com/palantir/tslint). In addition, the following rule
extensions have been added:

* [tslint-eslint-rules](https://www.npmjs.com/package/tslint-eslint-rules) - adds missing eslint
  rules to tslint
* [tslint-react](https://github.com/palantir/tslint-react) - adds React rules to tslint

### Highlights

* Indentation: 2 spaces
* Maximum line length: 100 characters
* No more than two consecutive empty lines
* No trailing whitespace at the end of lines
* Use `let` and `const` instead of `var`
* Use single quotes for string literals
* Use `===` and `!==` instead of `==` and `!=`
* TypeScript: Use `const x: T = { ... };` notation instead of `const x = { ...} as T;`
* TypeScript: Use interfaces over type literals

### Rules in Depth

|Name|Description|Package|
|----|-----------|-------|
|arrow-parens|Arrow functions with multiple arguments must use parentheses; single arguments must not.|tslint|
|no-unnecessary-type-assertion|Warn if a type assertion is not necessary for an expression|tslint|
|typedef|Requires type definitions to exist. Checks function return types, parameters, and member variable declarations.|tslint|
|typedef-whitespace|Requires no space to exist to the left of the colon in a type definition|tslint|
|await-promise|Warns if an awaited value is not a promise.|tslint|
|no-floating-promises|Requires promises returned by functions to be handled appropriately.|tslint|
|no-inferred-empty-object-type|Disallow type inference of {} (empty object type) at function and constructor call sites|tslint|
|no-unbound-method|Disallow use of an unbound class method as a callback|tslint|
|no-unused-variable|Disallows unused imports, variables, functions, and private class members|tslint|
|use-default-type-parameter|Warns if an explicitly specified type argument is the default for that type parameter.|tslint|
|no-mergeable-namespace|Disallows mergeable namespaces in the same file.|tslint|
|array-type|Enforces use of `T[]` for array types|tslint|
|no-boolean-literal-compare|Warns on comparison to a boolean literal, as in `x === true`.|tslint|
|type-literal-delimiter|Checks that type literal members are separated by semicolons. Enforces a trailing semicolon for multiline type literals.|tslint|
|trailing-comma|Disallow trailing commas|tslint|
|no-constant-condition|Disallow use of constant expressions in conditions|tslint|
|cyclomatic-complexity|Allow maximum cyclomatic complexity of 10|tslint|
|switch-default|Require `default` case in `switch` statements|tslint|
|triple-equals|Require use of `===` and `!==`|tslint|
|guard-for-in|Make sure `for-in` loops have an `if` statement|tslint|
|no-switch-case-fall-through|Disallow fallthrough of `case` statements|tslint|
|no-magic-numbers|Disallow use of magic numbers except -1, 0, 1, 2, 100, 1000|tslint|
|no-duplicate-variable|Disallow declaring the same variable more than once|tslint|
|no-use-before-declare|Disallow use of variables before they are defined|tslint|
|variable-name|Require camel-cace names|tslint|
|linebreak-style|Enforce Unix-style linebreaks|tslint|
|no-consecutive-blank-lines|Disallow more than two consecutive blank lines|tslint|
|no-trailing-spaces|Disallow trailing whitespace at end of lines|tslint|
|one-variable-per-declaration|Require no more than one variable declaration per function|tslint|
|object-literal-key-quotes|Require quotes around object literal property names as needed|tslint|
|quotemark|Require single quotes for string literal|tslint|
|semicolon|Require semicolons|tslint|
|comment-format|Require that single-line comments begin with a space after the `//`|tslint|
|no-control-regex|Disallow control characters in regular expressions (recommended)|tslint-eslint-rules|
|no-duplicate-case|Disallow duplicate case labels in a switch statement|tslint-eslint-rules|
|no-empty-character-class|Disallow the use of empty character classes in regular expressions|tslint-eslint-rules|
|no-ex-assign|Disallow assigning to the expection in a `catch` block|tslint-eslint-rules|
|no-extra-semi|Disallow unnecessary semicolons|tslint-eslint-rules|
|no-inner-declarations|Disallow function declarations in nested blocks|tslint-eslint-rules|
|no-invalid-regexp|Disallow invalid regular expression strings in the `RegExp` constructor|tslint-eslint-rules|
|ter-no-irregular-whitespace|Disallow irregular whitespace|tslint-eslint-rules|
|no-regex-spaces|Disallow multiple spaces in a regular expression literal|tslint-eslint-rules|
|no-unexpected-multiline|Disallow code that looks like two expressions but is actually one|tslint-eslint-rules|
|valid-jsdoc|Enforce valid JSDoc comments|tslint-eslint-rules|
|valid-typeof|Ensure that the results of typeof are compared against a valid string|tslint-eslint-rules|
|no-multi-spaces|Disallow use of multiple spaces|tslint-eslint-rules|
|handle-callback-err|Enforce error handling in callbacks|tslint-eslint-rules|
|array-bracket-spacing|Disallow after and before array brackets|tslint-eslint-rules|
|block-spacing|Require spacies inside of single line blocks|tslint-eslint-rules|
|brace-style|Require "one true brace style" in which the opening brace of a block is placed on the same line as its statement or declaration|tslint-eslint-rules|
|ter-func-call-spacing|Require spacing between function identifiers and their incovations|tslint-eslint-rules|
|ter-indent|Enforce consistent indentation: 2 spaces|tslint-eslint-rules|
|ter-max-len|Enforce max line length of 100|tslint-eslint-rules|

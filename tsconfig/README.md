# tsconfig

There are a number of `tsconfig` configurations based on the build environment.

## `tsconfig.base.json`

`tsconfig.base.json` contains compiler settings for TypeScript. Any changes to compiler settings
should be done here.

## `tsconfig.build.json`

`tsconfig.build.json` is symlinked by each package. Paths in this file are relative to the package
directory.

This configuration is used to compile for distribution.

## `tsconfig.develop.json`

`tsconfig.develop.json` contains the settings for local development. It links packages together
within the monorepo.

## `tsconfig.jest.json`

`tsconfig.jest.json` contains the settings for compiling within Jest. It's the same as the
development settings except for making changes to allow the code to execute within the Node
environment.

## `tsconfig.package.json`

`tsconfig.package.json` is symlinked by each package. Paths in this file are relative to the package
directory.

This exposes the development settings at the package level which allows the linter to pickup on the
tsconfig.

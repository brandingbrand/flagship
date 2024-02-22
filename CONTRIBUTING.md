# Contributing

## Technology

Code should be written in TypeScript. Should you not be familiar with TS, the
[official website](http://www.typescriptlang.org/docs/home.html) hosts several quick-start guides
and comprehensive documentation.

The frontend framework is React. In conjunction with React Native we can build components that can
be re-used for web, iOS, and Android applications. If you're unfamiliar with React, the official
website has an [interactive tutorial](https://facebook.github.io/react/tutorial/tutorial.html).
React code should be written using TypeScript.

## Getting Started

1. Fork the project on Github
2. Clone your fork to your computer
3. Run `yarn`

## Code Style

Flagship packages utilize the React Typescript Standards module which is a common set
JS/Typescript/JSX linter rules as well as a harness for running the linter and the packages's tests
as pre-commit hooks.

## Tests

Tests should be written for
[Jest](https://facebook.github.io/jest/docs/en/using-matchers.html#content) and located in
a `tests` directory next to the code under test per Jest conventions.

To run tests, run `yarn test`

To increase the likelihood that your code is merged, please create tests for any new code that you
write and modify existing tests that are impacted by code that you modified.

Pull requests will not be merged if tests fail during integration testing.

## Pull Requests

When creating a pull request, please include the following:

- A useful description of the issue solved or new features implemented
- Instructions for testing your changes

When you create a pull request, our continuous integration server will run the linter and tests
against your branch. The status of the integration tests will appear on the pull request in Github.
If the linter or tests fail the pull request will be blocked from being merged.

Your pull request must be approved via the Review function prior to being merged.

## Questions

Please contact the Product Team: product@brandingbrand.com

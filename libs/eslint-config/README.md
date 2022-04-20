# eslint-config-brandingbrand

> "Enterprise Grade Linting"

## Philosophy

When coding at scale ensuring high quality code as a project ages can
prove difficult. Linting can drastically improve code quality by front
loading many of the issues that should be caught in code review to the
point where a developer has the most context.

Eslint is a really powerful tool that can do a lot, but there are some
things it is better at than others. These configurations aim to focus
on what it is good at. Namely improving code quality by making patterns
more consistent and encouraging the use of modern language features.

### Special Cases

The goal isn't to prevent patterns from being used, but instead to
encourage good patterns by default and documenting where patterns
need to be broken via required descriptions on disable directives.

If for example I needed to use `let` for some reason I could do so
with the following directive.

```ts
// eslint-disable-next-line prefer-const -- This needs to be let
let something = '';
```

Requiring descriptions like this not only encourages thought about
why this pattern is being broken by the developer but by the entire
team during code review and future developers coming back to add to
and refactor this code.

Having clear descriptions on when linting rules are broken also
transparently teaches developers new to the code base what is and
is not common practice within the organization

### Single Warning Policy

With how powerful eslint is there is a lot of overlap between it and
other tools. These configurations intentionally disable any rules that
overlap with the functions of a tool that does a better job at enforcing
that particular rule.

With how many rules there are across the wide range of plugins this
configuration uses there are many that may overlap with each other.
Where ever possible these configurations attempt to pick a single rule
of those that overlap so that any given problem is only reported once.

#### Code Formatting

Code formatting is extremely useful when working on a team as it as it
reduces the number of changes that aren't meaningful leaving only the
important parts for code review. Additionally having consistent
formatting makes code much easier to read and switch contexts in the
code base.

But, linting works best when it is showing you meaningful warnings and
potentially unexpected behavior. Code Formatting rules just increase the
noise which which makes more important warnings seem less important.

As such these configurations do not include any code formatting (quote
style, indenting, spacing, etc.) rules. There are much better tools out
there (prettier) for code formatting so I would encourage you to use
those and enable format on save before you consider overriding the eslint
configurations with code formatting rules.

#### Type Checking

Writing JavaScript without Type Checking is like playing web dev on
hardcore mode. It is so easy to shot yourself, or your friend, in the foot.
We have many great tools now that luckily make our lives much easier. Chief
among them is TypeScript. While ESLint can enforce many type rules, TypeScript
does a far better job so any rules that overlap with options or checking already
done in TypeScript are intentionally disabled much like code formatting rules
and I would encourage you to explore your `tsconfig.json` options before looking
to enable any of those rules.

## Usage

1. Install the configuration

   ```shell
   npm install -D eslint-config-brandingbrand
   ```

2. Add a `.eslintrc.js` to the root of your project that looks something like this

   ```js
   module.exports = {
     overrides: [
       {
         extends: [
           'brandingbrand/typescript',
           'brandingbrand/angular',
           'brandingbrand/rxjs',
           'brandingbrand/ngrx',
         ],
         files: '**/*.ts',
         excludedFiles: ['**/*.md.ts', '**/*.spec.ts'],
         parserOptions: { project: './tsconfig.json' },
       },
       {
         extends: ['brandingbrand/typescript', 'brandingbrand/jest'],
         files: '**/*.spec.ts',
         parserOptions: { project: './tsconfig.json' },
         settings: { jest: { version: 26 } },
       },
       {
         extends: ['brandingbrand/angular-template'],
         files: '**/*.html',
         parserOptions: { project: './tsconfig.json' },
       },
       {
         extends: ['brandingbrand/javascript', 'brandingbrand/node'],
         files: '**/*.js',
         excludedFiles: '**/*.md.js',
       },
       {
         extends: ['brandingbrand/markdown'],
         files: ['*.md'],
       },
       {
         extends: [
           'brandingbrand/javascript',
           'brandingbrand/node',
           'brandingbrand/markdown-snippet',
         ],
         files: '*.md.js',
       },
       {
         extends: [
           'brandingbrand/javascript',
           'brandingbrand/angular',
           'brandingbrand/ngneat',
           'brandingbrand/rxjs',
           'brandingbrand/ngrx',
           'brandingbrand/markdown-snippet',
         ],
         files: '*.md.ts',
       },
     ],
     root: true,
   };
   ```

   Note: TypeScript rules are not available available in Markdown
   because while eslint knows how to parse markdown, TypeScript
   still doesn't.

   You can adjust the configuration to the needs of your project.
   You may also consider making a configuration for each package if
   you are using a monorepo to apply the proper platform configurations
   where they are applicable.

### Generator

If you are using an nx workspace you can use the
`eslint-config-brandingbrand:config` to configure your project the the correct
eslint extensions.

```sh
nx generate eslint-config-brandingbrand:config [projectName] [options,...]

Options:
  --projectName           The name of the project to configure (see workspace.json)
  --language              Wether to use JavaScript or TypeScript
  --framework             The framework this project was written with
  --testing               The testing framework the project uses
  --libraries             A list of libraries that this project consumes
```

### Entry Points

#### Overview

Each of your extends should consist of either a `platform`, `framework` and
one or more `libraries` OR a `other-parser`.

```js
['<platform>', '<framework>', ...libraries];
// OR
['<other-parser>'];
```

The supported entry points are

#### Platforms

- `brandingbrand/javascript`
- `brandingbrand/typescript`

#### Frameworks

- `brandingbrand/angular`
- `brandingbrand/node`
- `brandingbrand/react`
- `brandingbrand/react-native`

#### Testing Frameworks

- `brandingbrand/cypress`
- `brandingbrand/jest`

#### Utils

- `brandingbrand/fp-ts`
- `brandingbrand/lodash`
- `brandingbrand/markdown-snippet`
- `brandingbrand/ngneat`
- `brandingbrand/ngrx`
- `brandingbrand/rxjs`
- `brandingbrand/storybook`

#### Other Parsers

- `brandingbrand/angular-template`
- `brandingbrand/markdown`

### Rules Overriding

Depending on your project, you may choose to override or add additional
rules. To do this simply add a `rules` with any rules you wish to override
under the specific `overrides` where the rule applies.

#### Mono repo import sorting

If you wish to sort your can add this rule to your configuration replacing
`<your-organization>` with the namespace of your packages.

```json
{
  "extends": ["brandingbrand/import-order"]
  "rules": {
    "import/order": [
      "warn",
      {
            "alphabetize": {
              "order": "asc",
              "caseInsensitive": false
            },
            "groups": [["external", "builtin"], "internal", "parent", "sibling"],
            "newlines-between": "always",
            "pathGroups": [
              {
                "group": "sibling",
                "pattern": "./*-routing.module",
                "position": "before"
              },
              {
                "group": "external",
                "pattern": "{@<your-organization>/**,}",
                "position": "before"
              },
              {
                "group": "external",
                "pattern": "{@rx-angular/**,@ngrx/**,react-*,@vue/**}",
                "position": "before"
              },
              {
                "group": "external",
                "pattern": "{@angular/**,@nativescript/**,@nestjs/**,react,react-native,vue,@ngneat/spectator,@ngneat/spectator/**}",
                "position": "before"
              }
            ],
            "pathGroupsExcludedImportTypes": ["react"]
      }
    ]
  }
}
```

## Credits

The project structure and original rule set that has been customized and further
expanded upon and been provided by
[eslint-config-intense](https://github.com/dimitropoulos/eslint-config-intense)

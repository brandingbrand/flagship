const { DefaultTheme } = require('typedoc');

/**
 * These packages are not documented within typedoc, so
 * we'll change the links to go to github instead.
 */
const invalidPackages = [
  'fsweb',
  'fscodestyle',
  'fstestproject'
];

class CustomTheme extends DefaultTheme {
  constructor(renderer, basePath) {
    super(renderer, basePath);
    this.listenTo(renderer, 'parseMarkdown', (event) => {
      if (event.parsedText.includes(`href="packages/`)) {
        event.parsedText = event.parsedText.replace(
          /href="packages\/(.+?)"/gi,
          (match, packageName) => {
            if (invalidPackages.includes(packageName)) {
              return `href="https://github.com/brandingbrand/flagship/tree/master/packages/${packageName}"`;
            }
            return `href="/flagship/modules/${packageName}.html"`
          }
        );
      }
    });
  }
}

module.exports = CustomTheme;

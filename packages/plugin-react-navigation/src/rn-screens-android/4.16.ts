import { BuildConfig, path, string, withUTF8 } from '@brandingbrand/code-cli-kit';




export async function rnScreens416(build: BuildConfig): Promise<void> {
  const mainActivityPath = path.android.mainActivity(build);

  await withUTF8(
    mainActivityPath,
    (content) => {

      const imports = [
        'android.os.Bundle',
        'com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory',
      ].filter((imp) => !content.includes(`import ${imp}`));
      if (imports.length > 0) {
        content = string.replace(
          content,
          /(package.*?\n\n)/m,
          `$1import ${imports.join('\nimport ')}\n`,
        );
      }

      if (!content.includes('super.onCreate(')) {
        content = string.replace(
          content,
          /(class MainActivity.*\{)/,
          `$1
  override fun onCreate(savedInstanceState: Bundle?) {
      super.onCreate(savedInstanceState)
  }`,
        );
      }

      if (!content.includes('supportFragmentManager.fragmentFactory =')) {
        content = string.replace(
          content,
          /(super\.onCreate\(.+\))/,
          `supportFragmentManager.fragmentFactory = RNScreensFragmentFactory()
      $1`,
        );
      }

      return content;
    },
  );
}

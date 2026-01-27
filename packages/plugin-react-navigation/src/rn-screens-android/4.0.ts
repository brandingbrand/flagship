import { BuildConfig, path, string, withUTF8 } from '@brandingbrand/code-cli-kit';




export async function rnScreens40(build: BuildConfig): Promise<void> {
  const mainActivityPath = path.android.mainActivity(build);

  await withUTF8(
    mainActivityPath,
    (content) => {
      if (!content.includes(`import android.os.Bundle`)) {
        content = string.replace(
          content,
          /(package.*?\n\n)/m,
          `$1import android.os.Bundle\n`,
        );
      }

      if (!content.includes('super.onCreate(')) {
        content = string.replace(
          content,
          /(class MainActivity.*\{)/,
          `$1
  override fun onCreate(savedInstanceState: Bundle?) {
      super.onCreate(null)
  }`,
        );
      }

      return content;
    },
  );
}

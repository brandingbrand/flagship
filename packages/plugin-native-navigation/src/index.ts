import { definePlugin, fs } from "@brandingbrand/code-cli-kit";

export default definePlugin({
  ios: async function (build, options) {
    const scriptPath = require.resolve(
      "react-native-navigation/autolink/postlink/postLinkIOS.js",
      { paths: [process.cwd()] }
    );

    await fs.chmod(scriptPath, "755");
    const rnnIOSLink = require(scriptPath);

    await rnnIOSLink();
  },
  android: async function (build, options) {
    const scriptPath = require.resolve(
      "react-native-navigation/autolink/postlink/postLinkAndroid.js",
      { paths: [process.cwd()] }
    );

    await fs.chmod(scriptPath, "755");
    const rnnAndroidLink = require(scriptPath);

    await rnnAndroidLink();
  },
});

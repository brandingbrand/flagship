import { fs, path, summary } from "@brandingbrand/code-core";

import { dependencies } from "./utils";

const ios = summary.withSummary(
  async () => {
    dependencies.check();
    await dependencies.patch();

    const scriptPath = path.project.resolve(
      "node_modules",
      "react-native-navigation",
      "autolink",
      "postlink",
      "postLinkIOS.js"
    );
    await fs.chmod(scriptPath, "755");
    const rnnIOSLink = require(scriptPath);

    await rnnIOSLink();
  },
  "plugin-native-navigation",
  "platform::ios"
);

const android = summary.withSummary(
  async () => {
    dependencies.check();
    await dependencies.patch();

    const scriptPath = path.project.resolve(
      "node_modules",
      "react-native-navigation",
      "autolink",
      "postlink",
      "postLinkAndroid.js"
    );
    await fs.chmod(scriptPath, "755");
    const rnnAndroidLink = require(scriptPath);

    await rnnAndroidLink();
  },
  "plugin-native-navigation",
  "platform::android"
);

export { ios, android };

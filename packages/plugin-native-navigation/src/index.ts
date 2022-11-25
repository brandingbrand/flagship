import { fs, path } from "@brandingbrand/kernel-core";

import { dependencies } from "./utils";

const ios = async () => {
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

  rnnIOSLink();
};

const android = async () => {
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

  rnnAndroidLink();
};

export { ios, android };

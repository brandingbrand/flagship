/* eslint-disable @typescript-eslint/no-var-requires */
import { execSync } from "child_process";
import { path } from "@brandingbrand/kernel-core";

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
  execSync(`chmod +x ${scriptPath}`);
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
  execSync(`chmod +x ${scriptPath}`);
  const rnnAndroidLink = require(scriptPath);

  rnnAndroidLink();
};

export { ios, android };

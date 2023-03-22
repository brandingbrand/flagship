import { fsk, path } from "@brandingbrand/code-core";

export const check = () => {
  const { dependencies } = require(path.project.packagePath());

  if (!Object.keys(dependencies).includes("react-native-navigation")) {
    throw Error(
      "@brandingbrand/code-plugin-native-navigation: react-native-navigation is a require dependency, please check you package.json"
    );
  }
};

export const patch = async () => {
  const rnnPath = path.hoist.resolve(
    "react-native-navigation",
    "autolink",
    "postlink",
    "path.js"
  );

  const keyword = "mainApplicationJava.replace";

  const exists = await fsk.doesKeywordExist(rnnPath, keyword);

  if (exists) {
    await fsk.update(rnnPath, keyword, keyword.replace(".", "?."));
  }
};

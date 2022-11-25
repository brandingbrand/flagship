import { fs, path } from "@brandingbrand/kernel-core";

export const check = () => {
  const { dependencies } = require(path.project.packagePath());

  if (!Object.keys(dependencies).includes("react-native-navigation")) {
    throw Error(
      "@brandingbrand/kernel-plugin-native-navigation: react-native-navigation is a require dependency, please check you package.json"
    );
  }
};

export const patch = async () => {
  const rnnPath = path.project.resolve(
    "node_modules",
    "react-native-navigation",
    "autolink",
    "postlink",
    "path.js"
  );
  const keyword = "mainApplicationJava.replace";

  const exists = fs.doesKeywordExist(rnnPath, keyword);

  if (exists) {
    await fs.updateAsync(rnnPath, keyword, keyword.replace(".", "?."));
  }
};

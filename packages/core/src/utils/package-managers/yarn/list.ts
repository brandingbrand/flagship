import * as path from "../../path";

import type { List } from "../../../types/Yarn";

export const version = (
  packageName: string,
  json: List
): string | undefined => {
  const pkg = require(path.project.packagePath());

  return json?.data?.trees
    ?.find((it) => it?.name?.match(pkg.name))
    ?.children?.find((it) => it?.name?.match(packageName))
    ?.name?.split("@")
    ?.find((it) => it.match(/[0-9]+?.[0-9]+?.[0-9]+?$/));
};

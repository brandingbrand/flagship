import * as path from "../../path";

import type { List } from "../../../types/Npm";

export const version = (
  packageName: string,
  json: List
): string | undefined => {
  const pkg = require(path.project.packagePath());

  return json.dependencies?.[pkg.name]?.dependencies?.[packageName]?.version;
};

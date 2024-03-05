import fs from "fs/promises";
import * as recast from "recast";

import { withTS } from "../src/parsers/ts";

jest.mock("fs/promises");

describe("withTS", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should read, transform, and write file content", async () => {
    const filePath = "/path/to/flagship-code.config.ts";
    const content = `import {defineConfig} from '@brandingbrand/code-cli-kit';

export default defineConfig({
  // other config
  plugins: [
    '@brandingbrand/code-plugin-native-navigation',
    '@brandingbrand/code-plugin-asset',
    '@brandingbrand/code-plugin-app-icon',
    '@brandingbrand/code-plugin-permissions',
    '@brandingbrand/code-plugin-splash-screen',
  ],
});
`;
    const transformedContent = `import {defineConfig} from '@brandingbrand/code-cli-kit';

export default defineConfig({
  // other config
  plugins: [
    '@brandingbrand/code-plugin-native-navigation',
    '@brandingbrand/code-plugin-asset',
    '@brandingbrand/code-plugin-app-icon',
    '@brandingbrand/code-plugin-permissions',
    '@brandingbrand/code-plugin-splash-screen',
    '@brandingbrand/code-plugin-example',
  ],
});
`;

    jest.spyOn(fs, "readFile").mockResolvedValue(content);
    jest.spyOn(fs, "writeFile").mockResolvedValue();

    await withTS(filePath, {
      visitArrayExpression(path) {
        if (
          path.parentPath.value.key &&
          path.parentPath.value.key.name === "plugins"
        ) {
          path.value.elements.push(
            recast.types.builders.literal("@brandingbrand/code-plugin-example")
          );
        }

        return false;
      },
    });

    expect(fs.readFile).toHaveBeenCalledWith(filePath, "utf-8");
    expect(fs.writeFile).toHaveBeenCalledWith(
      filePath,
      transformedContent,
      "utf-8"
    );
  });
});

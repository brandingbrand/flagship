/* eslint-disable no-undef */

/**
 * set-files-after-env.ts runs after custom-env.ts that has access to globals and jest
 */

if (global.__flagship_code_fixture_path) {
  jest
    .spyOn(process, "cwd")
    .mockReturnValue(global.__flagship_code_fixture_path);
}

global.__flagship_code_build_config = {
  ios: {
    name: "HelloWorld",
    bundleId: "com.helloworld",
    displayName: "Hello World",
  },
  android: {
    name: "HelloWorld",
    displayName: "Hello World",
    packageName: "com.helloworld",
  },
};

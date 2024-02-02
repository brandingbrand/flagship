import {
  defineConfig,
  defineEnv,
  defineBuild,
  definePlugin,
} from "../src/lib/guards";

describe("Guard Utility Functions", () => {
  describe("defineConfig", () => {
    it("should return the provided configuration", () => {
      const config = {
        envPath: "./path/to/env/configs",
        buildPath: "./path/to/build/configs",
        pluginPath: "./path/to/plugins",
        plugins: ["my-plugin"],
      };

      expect(defineConfig(config)).toEqual(config);
    });
  });

  describe("defineEnv", () => {
    it("should return the provided environment configuration", () => {
      const env = {
        domain: "https://mydomain.com",
      };

      expect(defineEnv(env)).toEqual(env);
    });
  });

  describe("defineBuild", () => {
    it("should return the provided build configuration", () => {
      const build = {
        ios: {
          name: "brandingbrand",
          bundleId: "com.brandingbrand",
          displayName: "Branding Brand",
        },
        android: {
          name: "brandingbrand",
          displayName: "Branding Brand",
          packageName: "com.brandingbrand",
        },
      };

      expect(defineBuild(build)).toEqual(build);
    });

    it("should invoke the provided function with an empty object", () => {
      const config = {
        ios: {
          name: "brandingbrand",
          bundleId: "com.brandingbrand",
          displayName: "Branding Brand",
        },
        android: {
          name: "brandingbrand",
          displayName: "Branding Brand",
          packageName: "com.brandingbrand",
        },
      };
      const pkg = require(
        require.resolve("@brandingbrand/code-cli-kit/package.json")
      );
      const buildFunction = jest.fn(() => config);
      defineBuild(buildFunction);

      expect(buildFunction).toHaveBeenCalledWith(pkg);
    });
  });

  describe("definePlugin", () => {
    it("should return the provided plugin configuration", () => {
      const plugin = {};

      expect(definePlugin(plugin)).toEqual(plugin);
    });
  });
});

import { PackageJson, fs, path } from "@brandingbrand/code-cli-kit";

import { ActionWarning, bundleRequire, config, defineAction } from "@/lib";

/**
 * Define an action to process environment files.
 * @remarks
 * This action reads environment files from a specified directory, validates their names and formats, and then processes them accordingly.
 * @returns {Promise<string>} - Promise that resolves a string when the action completes successfully.
 * @throws {Error} - Throws an error if the environment directory doesn't exist or if it doesn't contain any valid environment files.
 */
export default defineAction(async () => {
  // Resolve the path to the project's package.json file
  const pkg = require(path.project.resolve("package.json")) as PackageJson;

  // Throw warning if no dependencies object
  if (!pkg.dependencies) {
    throw new ActionWarning(
      "Unable to locate dependencies object in package.json. Please note that the absence of the @brandingbrand/fsapp dependency will prevent you from leveraging the benefits of multi-tenant typed environments."
    );
  }

  // Check if the package.json file contains dependencies
  // Find the index of the '@brandingbrand/fsapp' dependency in the dependencies object
  const index = Object.keys(pkg.dependencies).findIndex(
    (it) => it === "@brandingbrand/fsapp"
  );

  // If the dependency is not found, throw a warning
  if (index === -1) {
    throw new ActionWarning(
      "Unable to locate the '@brandingbrand/fsapp' dependency. Please note that the absence of this dependency will prevent you from leveraging the benefits of multi-tenant typed environments."
    );
  }

  // Resolve the environment directory path based on the configuration
  const envDir = path.project.resolve(config.code.envPath);

  // Check if the environment directory exists
  if (!(await fs.doesPathExist(envDir))) {
    throw Error(
      `[EnvActionError]: env directory: ${envDir}, does not exist. Please check the "envPath" attribute in flagship-code.config.ts.`
    );
  }

  // Read the contents of the environment directory and filter out files matching the expected pattern
  const envs = (await fs.readdir(envDir)).filter((it) =>
    /env\..*\.ts/.test(it)
  );

  // Throw an error if no valid environment files are found in the directory
  if (!envs.length) {
    throw Error(
      `[EnvActionError]: env directory: ${envDir}, does not contain any env files that match the pattern "env.<mode>.ts". Please move your env files to ${envDir}.`
    );
  }

  // Read the contents of each environment file and validate its name and format
  const envContents = await Promise.all(
    envs.map(async (it) => {
      const envRegExpExecArray = /env\.(.*)\.ts/.exec(it);
      const content = (await bundleRequire(path.resolve(envDir, it))).default;

      const name = envRegExpExecArray?.pop();

      // Throw an error if the environment file doesn't follow the expected format
      if (!name) {
        throw Error(
          `[EnvActionError]: env file ${it} does not follow expected format "env.<mode>.ts"`
        );
      }

      return {
        name,
        content,
      };
    })
  );

  // Import the 'magicast' module due to esm type
  const magicast = await import("magicast");

  // Parse a module with an empty default export
  const mod = magicast.parseModule("export default { }");

  // Add each environment's content to the module's default export
  envContents.forEach((it) => {
    mod.exports.default[it.name] ||= { app: it.content };
  });

  // Resolve the path of the project environment index file from @brandingbrand/fsapp
  // There is a chance this could throw an error, this is fine, still even though we checked the dependencies object already
  const projectEnvIndexPath = require.resolve(
    "@brandingbrand/fsapp/src/project_env_index.js",
    { paths: [process.cwd()] }
  );

  // Write the module to the project environment index file
  magicast.writeFile(mod, projectEnvIndexPath);

  // Return context message for reporting
  return `linked ${envContents.map((it) => it.name).join(", ")} to @brandingbrand/fsapp env`;
}, "env");

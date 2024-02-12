import { fs, path } from "@brandingbrand/code-cli-kit";

import { bundleRequire, config, defineAction } from "@/lib";

export default defineAction(async () => {
  const envDir = path.project.resolve(config.code.envPath);

  if (!(await fs.doesPathExist(envDir))) {
    throw Error(
      `[EnvActionError]: env directory: ${envDir}, does not exist. Please check the "envPath" attribute in flagship-code.config.ts.`
    );
  }

  const envs = (await fs.readdir(envDir)).filter((it) =>
    /env\..*\.ts/.test(it)
  );

  if (!envs.length) {
    throw Error(
      `[EnvActionError]: env directory: ${envDir}, does not contain any env files that match the pattern "env.<mode>.ts". Please move your env files to ${envDir}.`
    );
  }

  const envContents = await Promise.all(
    envs.map(async (it) => {
      const envRegExpExecArray = /env\.(.*)\.ts/.exec(it);
      const content = (await bundleRequire(path.resolve(envDir, it))).default;

      const name = envRegExpExecArray?.pop();

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

  const magicast = await import("magicast");

  const mod = magicast.parseModule("export default { }");

  envContents.forEach((it) => {
    mod.exports.default[it.name] ||= { app: it.content };
  });

  const projectEnvIndexPath = require.resolve(
    "@brandingbrand/fsapp/src/project_env_index.js"
  );
  magicast.writeFile(mod, projectEnvIndexPath);
}, "env");

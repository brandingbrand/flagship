import isNil from "lodash/isNil";
import omitBy from "lodash/omitBy";
import isEmpty from "lodash/isEmpty";
import type { Config } from "@brandingbrand/kernel-core";
import { fs, path, Xcode } from "@brandingbrand/kernel-core";

import type { KernelPluginTargetExtension } from "./types";

const ios = async (config: Config & KernelPluginTargetExtension) => {
  const extensions = config.kernelPluginTargetExtension.kernel;

  for (const extension of extensions) {
    const name = path.basename(path.config.resolve(extension.path));
    const files = await fs.readdir(path.config.resolve(extension.path));
    const entitlementsFile = files.filter((it) =>
      it.match(/(\w+?\.entitlements)/)
    );

    await fs.copy(
      path.config.resolve(extension.path),
      path.project.resolve("ios", name)
    );

    await new Xcode(config)
      .addPbxGroupBuilder(files, name, name)
      .addToPbxGroupBuilder(name, "Project")
      .addTargetBuilder(name, "app_extension", name, extension.bundleId)
      .addBuildPhaseBuilder(
        files.filter((it) => it.match(/(\w+?\.(m|swift))/)),
        "PBXSourcesBuildPhase",
        "Sources",
        name,
        undefined,
        undefined
      )
      .addBuildPhaseBuilder(
        [],
        "PBXFrameworksBuildPhase",
        "Frameworks",
        name,
        undefined,
        undefined
      )
      .addBuildPhaseBuilder(
        [],
        "PBXResourcesBuildPhase",
        "Frameworks",
        name,
        undefined,
        undefined
      )
      .addBuildSettingsBuilder(
        omitBy(
          {
            PRODUCT_BUNDLE_SHORT_VERSION_STRING:
              config.ios.versioning?.build ?? "1.0",
            PRODUCT_BUNDLE_VERSION: config.ios.versioning?.version ?? 1,
            CODE_SIGN_STYLE: "Manual",
            PROVISIONING_PROFILE_SPECIFIER: `"${extension.provisioningProfileName}"`,
            DEVELOPMENT_TEAM: config.ios.signing?.exportTeamId,
            CODE_SIGN_ENTITLEMENTS: !isEmpty(entitlementsFile)
              ? `${name}/${entitlementsFile[0]}`
              : undefined,
          },
          isNil
        ),
        name
      )
      .build();
  }
};

const android = async () => {
  //
};

export * from "./types";

export { ios, android };

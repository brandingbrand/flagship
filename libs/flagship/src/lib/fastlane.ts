import { Config } from '../types';
import * as fs from './fs';
import { logInfo } from '../helpers';

/**
 * Configures the project Fastfile from the project configuration.
 *
 * @param {string} path The path to the project Fastfile
 * @param {object} configuration The project configuration.
 * @param {string} version The project version.
 */
// eslint-disable-next-line complexity
export function configure(path: string, configuration: Config, version: string): void {
  const buildConfig = configuration && configuration.buildConfig && configuration.buildConfig.ios;

  logInfo(`updating fastfile at ${path}`);

  if (buildConfig) {
    if (buildConfig.exportMethod) {
      fs.update(
        path,
        /.+#PROJECT_MODIFY_FLAG_export_method/g,
        `export_method: "${buildConfig.exportMethod}", #PROJECT_MODIFY_FLAG_export_method`
      );
    }

    if (buildConfig.exportTeamId) {
      fs.update(
        path,
        /.+#PROJECT_MODIFY_FLAG_export_team_id/g,
        `export_team_id: "${buildConfig.exportTeamId}", #PROJECT_MODIFY_FLAG_export_team_id`
      );
    }

    if (buildConfig.provisioningProfileName) {
      fs.update(
        path,
        /.+#PROJECT_MODIFY_FLAG_export_options_provisioning_profile/g,
        `"${buildConfig.provisioningProfileName}" #PROJECT_MODIFY_FLAG_export_options_provisioning_profile`
      );

      if (buildConfig.exportTeamId) {
        fs.update(
          path,
          /.+#PROJECT_MODIFY_FLAG_xcargs/g,
          'xcargs: "' +
            [
              `DEVELOPMENT_TEAM='${buildConfig.exportTeamId}'`,
              `PROVISIONING_PROFILE_SPECIFIER='${buildConfig.provisioningProfileName}'`,
            ].join(' ') +
            '" #PROJECT_MODIFY_FLAG_export_team_id'
        );
      }
    }
  }

  // Inject App Center configurations
  if (configuration && configuration.appCenter) {
    const { organization, distribute } = configuration.appCenter;

    fs.update(
      path,
      /.+#PROJECT_MODIFY_FLAG_appcenter_owner_name/g,
      `owner_name: "${organization}", #PROJECT_MODIFY_FLAG_appcenter_owner_name`
    );

    if (distribute && distribute.appNameIOS) {
      fs.update(
        path,
        /.+#PROJECT_MODIFY_FLAG_appcenter_app_name_ios/g,
        `app_name: "${distribute.appNameIOS}", #PROJECT_MODIFY_FLAG_appcenter_app_name_ios`
      );
      fs.update(
        path,
        /.+#PROJECT_MODIFY_FLAG_appcenter_app_version_ios/g,
        `version: "${version}", #PROJECT_MODIFY_FLAG_appcenter_app_version_ios`
      );
    }

    if (distribute && distribute.appNameAndroid) {
      fs.update(
        path,
        /.+#PROJECT_MODIFY_FLAG_appcenter_app_name_android/g,
        `app_name: "${distribute.appNameAndroid}", #PROJECT_MODIFY_FLAG_appcenter_app_name_android`
      );

      if (!configuration.disableDevFeature) {
        const overrideVersion =
          typeof configuration?.android?.build?.versionName === 'string'
            ? configuration.android.build.versionName
            : version;

        fs.update(
          path,
          /.+#PROJECT_MODIFY_FLAG_appcenter_app_version_android/g,
          `version: "${overrideVersion}", #PROJECT_MODIFY_FLAG_appcenter_app_version_android`
        );
      }
    }
  }
}

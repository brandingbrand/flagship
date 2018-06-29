import { Config } from '../types';
import * as fs from './fs';
import { logInfo } from '../helpers';

/**
 * Configures the project Fastfile from the project configuration.
 *
 * @param {string} path The path to the project Fastfile
 * @param {object} configuration The project configuration.
 */
export function configure(path: string, configuration: Config): void {
  const buildConfig = configuration && configuration.buildConfig && configuration.buildConfig.ios;

  logInfo(`updating fastfile at ${path}`);

  if (buildConfig) {
    if (buildConfig.exportMethod) {
      fs.update(
        path,
        /.+#PROJECT_MODIFY_FLAG_export_method/,
        `export_method: "${buildConfig.exportMethod}", #PROJECT_MODIFY_FLAG_export_method`
      );
    }

    if (buildConfig.exportTeamId) {
      fs.update(
        path,
        /.+#PROJECT_MODIFY_FLAG_export_team_id/,
        `export_team_id: "${buildConfig.exportTeamId}", #PROJECT_MODIFY_FLAG_export_team_id`
      );
    }

    if (buildConfig.provisioningProfileName) {
      fs.update(
        path,
        /.+#PROJECT_MODIFY_FLAG_export_options_provisioning_profile/,
        // tslint:disable-next-line:ter-max-len
        `"${buildConfig.provisioningProfileName}" #PROJECT_MODIFY_FLAG_export_options_provisioning_profile`
      );

      if (buildConfig.exportTeamId) {
        fs.update(
          path,
          /.+#PROJECT_MODIFY_FLAG_xcargs/,
          'xcargs: "' + [
            `DEVELOPMENT_TEAM='${buildConfig.exportTeamId}'`,
            `PROVISIONING_PROFILE_SPECIFIER='${buildConfig.provisioningProfileName}'`
          ].join(' ') + '" #PROJECT_MODIFY_FLAG_export_team_id'
        );
      }
    }
  }

  // Inject the Hockey API token
  if (process.env.HOCKEYAPP_API_TOKEN) {
    fs.update(
      path,
      /.+#PROJECT_MODIFY_FLAG_hockey_api_token/,
      `api_token: "${process.env.HOCKEYAPP_API_TOKEN}" #PROJECT_MODIFY_FLAG_hockey_api_token`
    );

    logInfo('updated Hockey API token from process ENV [HOCKEYAPP_API_TOKEN]');
  }
}

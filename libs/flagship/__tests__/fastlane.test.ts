import * as fastlane from '../src/lib/fastlane';

import * as fs from 'fs-extra';
import * as nodePath from 'path';

const mockProjectDir = nodePath.join(__dirname, 'mock_project');
const tempRootDir = nodePath.join(__dirname, '__fastlane_test');

global.process.cwd = () => nodePath.resolve(tempRootDir);

beforeEach(() => {
  fs.removeSync(tempRootDir);
  fs.copySync(mockProjectDir, tempRootDir);
});

afterEach(() => {
  fs.removeSync(tempRootDir);
});

test(`add deeplink hosts`, () => {
  const exportMethod = `__test__exportMethod__`;
  const exportTeamId = `__test__exportTeamId__`;
  const provisioningProfileName = `__test__provisioningProfileName__`;

  fastlane.configure(nodePath.join(tempRootDir, `ios/fastlane/Fastfile`), {
    buildConfig: {
      ios: {
        exportMethod,
        exportTeamId,
        provisioningProfileName
      }
    }
  } as any);

  const fastfileBody = fs.readFileSync(nodePath.join(tempRootDir, `ios/fastlane/Fastfile`))
    .toString();

  expect(fastfileBody)
    .toMatch(`export_method: "${exportMethod}", #PROJECT_MODIFY_FLAG_export_method`);
  expect(fastfileBody)
    .toMatch(`export_team_id: "${exportTeamId}", #PROJECT_MODIFY_FLAG_export_team_id`);
  expect(fastfileBody).toMatch(`"${provisioningProfileName}" ` +
    '#PROJECT_MODIFY_FLAG_export_options_provisioning_profile');
  expect(fastfileBody).toMatch(`xcargs: "` + [
    `DEVELOPMENT_TEAM='${exportTeamId}'`,
    `PROVISIONING_PROFILE_SPECIFIER='${provisioningProfileName}'`
  ].join(` `) + `" #PROJECT_MODIFY_FLAG_export_team_id`);

});

// Force to be treated as a module
export {};

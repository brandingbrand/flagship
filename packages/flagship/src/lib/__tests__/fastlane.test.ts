const fastlane = require(`../fastlane`);
const fs = require(`fs-extra`);
const nodePath = require(`path`);

const mockProjectDir = nodePath.join(__dirname, '..', '..', '..', '__tests__', `mock_project`);
const tempRootDir = nodePath.join(__dirname, `__fastlane_test`);

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
  });

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

test(`add hockeyapp api token`, () => {
  process.env.HOCKEYAPP_API_TOKEN = `abc`;
  fastlane.configure(nodePath.join(tempRootDir, `ios/fastlane/Fastfile`));

  const fastfileBody = fs.readFileSync(nodePath.join(tempRootDir, `ios/fastlane/Fastfile`))
    .toString();

  expect(fastfileBody).toMatch(`api_token: "${process.env.HOCKEYAPP_API_TOKEN}" ` +
    `#PROJECT_MODIFY_FLAG_hockey_api_token`);
});

// Force to be treated as a module
export {};

/**
 * set-files-after-env.ts runs after custom-env.ts that has access to globals and jest
 */

if (global.__FLAGSHIP_CODE_FIXTURE_PATH__) {
  jest
    .spyOn(process, "cwd")
    .mockReturnValue(global.__FLAGSHIP_CODE_FIXTURE_PATH__);
}

import {XcodeProject} from 'xcode';

const projectPbxProjRegex = /\bproject\.pbxproj$/gm;

export default {
  /* Test to match .pbxproj files in projects that use FSApp */
  __test: (destFile: string, deps: string[]) =>
    projectPbxProjRegex.test(destFile) && deps.includes('@brandingbrand/fsapp'),

  addFSAppFileReferences: (project: XcodeProject): void => {
    const targetKey = project.findTargetKey('app');

    if (!targetKey) {
      throw Error(`[PbxprojTransformerError]: cannot find target "app" uuid`);
    }

    const opt = {target: targetKey};

    const groupKey = project.findPBXGroupKey({name: 'app'});

    if (!groupKey) {
      throw Error(`[PbxprojTransformerError]: cannot find group "app" uuid`);
    }

    // These files exist as extras and need to be added to pbxproj file as
    // source files or header files
    project.addSourceFile('app/EnvSwitcher.m', opt, groupKey);
    project.addSourceFile('app/NativeConstants.m', opt, groupKey);
  },
};

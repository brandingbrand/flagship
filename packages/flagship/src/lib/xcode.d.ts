declare module 'xcode' {
  function project(pathToProject: string): XCodeproject;

  interface WriterOptions {
    omitEmptyValues?: boolean;
  }

  interface XCodeproject {

    parseSync: () => XCodeproject;
    writeSync: (options?: WriterOptions) => string;
    allUUids: () => string[];
    generateUuid: () => string;
    addPluginFile: (path: string, opt: Options) => PBXFile;
    removePluginFile: (path: string, opt: Options) => PBXFile;
    addProductFile: (path: string, opt: Options) => PBXFile;
    removeProductFile: (path: string, opt: Options) => PBXFile;
    /**
     *
     * @param path {String}
     * @param opt {Object} see pbxFile for avail options
     * @param group {String} group key
     * @returns {Object} file; see pbxFile
     */
    addSourceFile: (path: string, opt: Options, group?: string) => PBXFile;
    /**
     *
     * @param path {String}
     * @param opt {Object} see pbxFile for avail options
     * @param group {String} group key
     * @returns {Object} file; see pbxFile
     */
    removeSourceFile: (path: string, opt: Options, group?: string) => PBXFile;
    /**
     *
     * @param path {String}
     * @param opt {Object} see pbxFile for avail options
     * @param group {String} group key
     * @returns {Object} file; see pbxFile
     */
    addHeaderFile: (path: string, opt: Options, group: string) => PBXFile;

    /**
     *
     * @param path {String}
     * @param opt {Object} see pbxFile for avail options
     * @param group {String} group key
     * @returns {Object} file; see pbxFile
     */
    removeHeaderFile: (path: string, opt: Options, group: string) => PBXFile;

    /**
     *
     * @param path {String}
     * @param opt {Object} see pbxFile for avail options
     * @param group {String} group key
     * @returns {Object} file; see pbxFile
     */
    addResourceFile: (path: string, opt: Options, group: string) => PBXFile;

    /**
     *
     * @param path {String}
     * @param opt {Object} see pbxFile for avail options
     * @param group {String} group key
     * @returns {Object} file; see pbxFile
     */
    removeResourceFile: (path: string, opt: Options, group: string) => PBXFile;


    addFramework: (fpath: string, opt: Options) => PBXFile;

    removeFramework: (fpath: string, opt: Options) => PBXFile;


    addCopyfile: (fpath: string, opt: Options) => PBXFile;

    pbxCopyfilesBuildPhaseObj: (target: string) => Section;

    addToPbxCopyfilesBuildPhase: (file: unknown) => void;

    removeCopyfile: (fpath: string, opt: Options) => PBXFile;

    removeFromPbxCopyfilesBuildPhase: (file: unknown) => void;

    addStaticLibrary: (fpath: string, opt: Options) => PBXFile;

    // helper addition functions
    addToPbxBuildFileSection: (file: unknown) => void;

    removeFromPbxBuildFileSection: (file: unknown) => void;

    addPbxGroup: (filePathsArray: string[], name: string, path: string, sourceTree?: unknown) => {
      uuid: string; pbxGroup: string;
    };

    removePbxGroup: (groupName: string) => void;

    addToPbxProjectSection: (target: string) => void;

    addToPbxNativeTargetSection: (target: string) => void;

    addToPbxFileReferenceSection: (file: string) => void;

    removeFromPbxFileReferenceSection: (file: string) => PBXProject;

    // TODO:

    // helper access functions
    pbxProjectSection: () => PBXProject;

    pbxBuildFileSection: () => PBXBuildFile;

    pbxXCBuildConfigurationSection: () => XCBuildConfiguration;

    pbxFileReferenceSection: () => PBXFileReferencetion;

    pbxNativeTargetSection: () => PBXNativeTarget;

    xcVersionGroupSection: () => XCVersionGroup;

    pbxXCConfigurationList: () => XCConfigurationList;

    pbxGroupByName: (name: string) => Group | null;

    addTarget: (
      name: string, type: 'app_extension', subfolder: string, bundleId: string
    ) => {uuid: string};

    addBuildPhase: (files: string[], type: string, name: string, uuid: string) => void;

    addToPbxGroup: (uuid: string, key: string) => void;

    hash: {project: {objects: {[key: string]: {[key: string]: {name: string}}}}};
  }
}

# FLAGSHIP Build Hooks Support

Source files in this directory can make modifications to the boilerplate FLAGSHIP project.
All files with a .js extension in this directory and `buildStageScripts` directory under project root
(if exists) are automatically loaded.

All scripts should export an array of `BuildStageScript` Objects and pass these options:

  name - title of the hook that will output to the log

  script: (config: Config) => void - the script function
  buildStage - when should FLAGSHIP run the script.
  Currently FLAGSHIP supports these life cycle events (enum):
  beforeCopyBoilerplate | beforeLink | beforeIOSPodInstall | afterLink | failed;

  platforms - (Optional) a list of platforms (enum: `android`, `ios` and/or `web`) that the patch is
  target for. If not specified then the hook applies to all platforms;

  packages - (Optional) a list of dependencies that the patch is target for. Package name can be a
  string or a regex expression. A semantic version range string can be given in this to restrict
  the hook to only apply to selected version of the package.
  If the list is empty then the hook is a global script that will always run;

  priority - (Optional) the grater the number is, the earlier the script will be executed in a
  single life cycle event. If not specified the number is 0 by default.

import * as zlib from 'zlib';
import * as stream from 'stream';
import { extract } from 'tar';
import { promisify } from 'util';
import * as fsExtra from 'fs-extra';
import fetch from 'node-fetch';
import * as inquirer from 'inquirer';

import { BaseConfig, baseConfig } from './assets/base-config';
import configDependencyPackageMap from './assets/pkg-map';
import * as questions from './questions';
import { newLineSuffix } from './lib/formatters';
import { callout } from './lib/colors';

const TEMPLATE_URL = 'https://github.com/brandingbrand/flagship-template/archive/master.tar.gz';
const pipeline = promisify(stream.pipeline);

type Answers = questions.AssociatedDomainsAnswers &
  questions.BundleIdsAnswers &
  questions.CodePushAnswers &
  questions.DoExtendedConfigAnswers &
  questions.ExceptionDomainsAnswers &
  questions.NamesAnswers &
  questions.UsageDescriptionsAnswers &
  questions.ZendeskChatAnswers;

type UserConfig = Answers['config'];
type Config = UserConfig & BaseConfig;

const clearDirectory = async () => {
  const contents = await fsExtra.readdir('./');

  // If the current directory is not empty or only contains git files,
  // ask the user if it's ok to delete them all.
  if (contents.length !== 0 && !(contents.length === 1 && contents[0] === '.git')) {
    const { clearContents, clearContentsConfirm } =
      await inquirer.prompt<questions.ClearContentsAnswers>(questions.clearContents);

    if (!clearContents || !clearContentsConfirm) {
      console.error('Aborting...');
      process.exit(1);
    } else {
      await fsExtra.emptyDir(process.cwd());
    }
  }
};

const populateRepo = async () => {
  // Fetch the gzipped tarball of the template repo from github
  const response = await fetch(TEMPLATE_URL);
  if (!response.ok || !response.body) {
    throw new Error('bad response');
  }

  // Unzip, extract, and write the archive's contents
  // Will extract the root folder's contents into the current directory
  await pipeline(response.body, zlib.createUnzip(), extract({ strip: 1 }));
};

const populateConfigs = async (): Promise<Answers> => {
  const {
    associatedDomains,
    bundleIds,
    codepush,
    doExtendedConfig,
    exceptionDomains,
    names,
    usageDescriptions,
    zendeskChat,
    onlyWhenExtendedConfig,
  } = questions;

  // Questions will be asked in the order that they are defined in this array
  const orderedQuestions = [
    ...names,
    ...bundleIds,
    ...exceptionDomains,
    ...usageDescriptions,
    ...doExtendedConfig,
    ...associatedDomains.map(onlyWhenExtendedConfig),
    ...codepush.map(onlyWhenExtendedConfig),
    ...zendeskChat.map(onlyWhenExtendedConfig),
  ];

  const answers = await inquirer.prompt<Answers>(orderedQuestions.map(newLineSuffix));

  return answers;
};

const formatConfig = (config: Config) => {
  // Alter the config options to be in the format expected by the env file
  if (config.usageDescriptionIOS) {
    return {
      ...config,
      usageDescriptionIOS: Object.keys(config.usageDescriptionIOS)
        .filter((key): key is keyof typeof config.usageDescriptionIOS =>
          config.usageDescriptionIOS.hasOwnProperty(key)
        )
        .map((key) => ({
          key,
          string: config.usageDescriptionIOS[key],
        })),
    };
  }

  return config;
};

const replaceConfig = async (config: Config) => {
  const formattedConfig = formatConfig(config);
  await fsExtra.writeJson('./env/common.json', formattedConfig, { spaces: 2 });
  await fsExtra.remove('./env/common.js');
};

const getLatestDependency = async (pkg: string): Promise<{ [key: string]: string }> => {
  // Finds the latest release version of a given packages
  const res = await fetch(`https://registry.npmjs.com/${pkg}`);
  const json = await res.json();

  if (json && typeof json === 'object') {
    const distTags = (json as { [key: string]: unknown })['dist-tags'];

    if (distTags && typeof distTags === 'object') {
      const { latest } = distTags as { [key: string]: unknown };
      return { [pkg]: `^${latest}` };
    }
  }

  throw new Error(`Unable to find latest version number for package ${pkg}`);
};

const getPackageJson = async (config: Config) => {
  const packageJsonStr = await fsExtra.readFile('./package.json', 'UTF-8');
  const packageJson = JSON.parse(packageJsonStr);
  packageJson.name = config.name;
  delete packageJson.author;
  delete packageJson.repository;

  // Alter the compile command to include the bundle id for android
  // The project id and application id need to be the same
  // for RN to launch the main activity correctly
  if (config.bundleIds && config.bundleIds.android) {
    const compileCmd = `react-native run-android --no-packager --appId ${config.bundleIds.android}`;
    packageJson.scripts['compile-android'] = compileCmd;
  }

  // Add packages based on config options
  // ie. if the user configures code-push, react-native-code-push
  // should be added to package.json so they don't have to
  const promises = Object.keys(configDependencyPackageMap)
    .filter((key): key is keyof typeof configDependencyPackageMap => {
      return config.hasOwnProperty(key) && configDependencyPackageMap.hasOwnProperty(key);
    })
    .map(async (key) => getLatestDependency(configDependencyPackageMap[key]));

  const newDeps = await Promise.all(promises);
  packageJson.dependencies = {
    ...packageJson.dependencies,
    ...newDeps.reduce((deps, dep) => ({ ...deps, ...dep }), {}),
  };

  return packageJson;
};

const showPostInstallMsg = () => {
  // Show some post-install instructions/hints
  console.log(`
You're almost done! There's a couple more steps you may want to complete.

To add an icon for your app, follow the instructions at ${callout(
    'https://github.com/brandingbrand/flagship/wiki/Creating-App-Icons'
  )}.

To add splash/launch screens, follow the instructions at ${callout(
    'https://github.com/brandingbrand/flagship/wiki/Creating-Launch-Screens'
  )}.

You'll need to sign your apps in order to publish to an app store or a distribution service such as Hockeyapp. For more info on how to do that, see ${callout(
    'https://github.com/brandingbrand/flagship/wiki/Signing-Your-Apps'
  )}.

Once you've finished making another other changes to your configs, you need to install dependencies and initialize the project by running:
"${callout('yarn install && yarn run init')}"

Once those complete, you'll be able to run your project by doing:
"${callout('yarn android')}" or "${callout('yarn ios')}"
`);
};

const main = async () => {
  // Check that dir is empty or only .git
  await clearDirectory();

  // Populate the directory with the repo's contents
  await populateRepo();

  // generate common config
  const answers = await populateConfigs();

  // merge user configs into the base
  const config: Config = { ...baseConfig, ...answers.config };

  // write common config
  await replaceConfig(config);

  // Update package.json with new config (ie. name)
  const packageJson = await getPackageJson(config);

  // write package.json
  await fsExtra.writeJSON('./package.json', packageJson, { spaces: 2 });

  // show post install instructions
  showPostInstallMsg();
};

main().catch((e) => console.error(e));

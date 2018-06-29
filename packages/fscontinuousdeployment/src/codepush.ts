// This script is called from travis to perform codepush builds and deployments
import {
  execSync
} from 'child_process';
import path from 'path';
import fs from 'fs';
import request from 'request';

const appConfig = require(path.join(process.cwd(), 'env' , 'env'));
const packageJson = require(path.join(process.cwd(), 'package.json'));
const github = new (require('github'))({
  version: '3.0.0',
  timeout: 5000
});

// if codepush is not configured, exit
if (!appConfig.codepush) {
  process.exit(0);
}

// if travis is building a pull, exit
if (process.env.TRAVIS_PULL_REQUEST !== 'false') {
  console.log('Codepush building ignored for pull request');
  process.exit(0);
}

// ensure env vars exist
if (!process.env.GITHUB_TOKEN) {
  console.error('GITHUB_TOKEN env var is missing.');
  process.exit(1);
}

if (!process.env.APPCENTER_TOKEN) {
  console.error('APPCENTER_TOKEN env var is missing.');
  process.exit(1);
}

github.authenticate({
  type: 'basic',
  username: process.env.GITHUB_TOKEN,
  password: 'x-oauth-basic'
});

const USER = appConfig.codepush.user;
const REPO = appConfig.codepush.repo;
const currentHEADSha = execSync('git rev-parse HEAD').toString();

if (!USER) {
  console.error('Repo user not defined for codepush config');
  process.exit(1);
}

if (!REPO) {
  console.error('Repo key not defined for codepush config');
  process.exit(1);
}

if (!currentHEADSha) {
  console.error('Unable to get current SHA for repo');
  process.exit(1);
}

// add react-native to dependencies list because the appcenter cli uses that to detect if
// the project is react native
packageJson.dependencies['react-native'] = 'meh';
fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));

// build and release for each app property
if (appConfig.codepush.android) {
  try {
    execSync(`appcenter codepush release-react -a ${appConfig.codepush.android.name} \
-d Latest --development false --description ${currentHEADSha}`, {stdio: [0, 1, 2]});

    tagDeploymentLabel(appConfig.codepush.android.name, 'AndroidBuild');

    updateTag('LatestAndroidBuild', currentHEADSha, () =>
      console.log(`Updated latest android build tag`));
  } catch (e) {
    console.error('Android codepush deployment failed to build');
    console.error(e);
  }
}

if (appConfig.codepush.ios) {
  try {
    execSync(`appcenter codepush release-react -a ${appConfig.codepush.ios.name} \
--plist-file ./ios/${appConfig.name}/Info.plist -d Latest --development false \
--description ${currentHEADSha}`, {stdio: [0, 1, 2]});

    tagDeploymentLabel(appConfig.codepush.ios.name, 'iOSBuild');

    updateTag('LatestIOSBuild', currentHEADSha, () => console.log(`Updated latest ios build tag`));
  } catch (e) {
    console.error('iOS codepush deployment failed to build');
    console.error(e);
  }
}

function tagDeploymentLabel(app: string, tagPrefix: string): void {
  // this is async and its fine for script to continue
  request({
    url: `https://api.appcenter.ms/v0.1/apps/${app}/deployments/Latest`,
    json: true,
    headers: {
      'X-API-Token': process.env.APPCENTER_TOKEN
    }
  }, (error, response, body) => {
    if (!error && body && body.latest_release &&
      body.latest_release.description === currentHEADSha
    ) {
      createTag(tagPrefix + body.latest_release.label, currentHEADSha, () =>
        console.log('Successfully tagged deployment label'));
    }
  });
}

interface GithubError {
  code: number;
}

function updateTag(tag: string, sha: string, cb: Function): void {
  github.gitdata.getReference({
    user: USER,
    repo: REPO,
    ref: 'tags/' + tag
  }, (e: GithubError, d: string) => {
    if (e && e.code === 404) {
      // create tag
      return createTag(tag, sha, cb);
    }

    if (d) {
      github.gitdata.updateReference({
        user: USER,
        repo: REPO,
        ref: 'tags/' + tag,
        sha,
        force: true
      }, (e: GithubError, d: string) => {
        if (e) {
          console.log('tag update error', tag, sha);
          console.log(e);
          process.exit(1);
        }
        cb();
      });
    }
  });
}

function createTag(tag: string, sha: string, cb: Function): void {
  github.gitdata.createReference({
    user: USER,
    repo: REPO,
    ref: 'refs/tags/' + tag,
    sha
  }, (e: GithubError, d: string) => {
    if (e) {
      console.log('tag create error', tag, sha);
      console.log(e);
      process.exit(1);
    }
    cb();
  });
}

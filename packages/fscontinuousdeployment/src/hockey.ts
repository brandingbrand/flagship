// this script is called from travis and is used to determine if a native app binary has
// been built for a specific version
// exit codes:
//  0 = a binary build for the version number in package.json does not exist on hockey
//  1 = config or environment error
//  2 = build already exists on hockey

import request from 'request';
import path from 'path';

const appConfig = require(path.join(process.cwd(), 'env' , 'env'));
const appPackage = require(path.join(process.cwd(), 'package.json'));
let hockeyAppToken;

if (!process.env.HOCKEYAPP_API_TOKEN) {
  console.error('No HOCKEYAPP_API_TOKEN provided');
  process.exit(1);
}

if (!appConfig.hockey) {
  console.error('No hockey app configuration exists for this env');
  process.exit(1);
}

if (!process.argv[2]) {
  console.error('No platform was specified');
  process.exit(1);
} else {
  hockeyAppToken = appConfig.hockey[process.argv[2]];
}

if (!hockeyAppToken) {
  console.error('No hockey app configuration exists for this platform: ' + process.argv[2]);
  process.exit(1);
}

interface CodepushVersions {
  app_versions?: {
    shortversion: string;
  }[];
}

// check package.json version with the latest version on hockeyapp
request({
  url: `https://rink.hockeyapp.net/api/2/apps/${hockeyAppToken}/app_versions`,
  json: true,
  headers: {
    'X-HockeyAppToken': process.env.HOCKEYAPP_API_TOKEN
  }
}, (err: any, response: any, body: CodepushVersions) => {
  const version = !err && body && body.app_versions && body.app_versions.length &&
    body.app_versions[0].shortversion;

  console.log('latest app version on hockey', version);
  console.log('package.json app version', appPackage.version);

  process.exit(version === appPackage.version ? 2 : 0);
});

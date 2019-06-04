// In RN 59, react-native link only checks the node_modules directory inside of pirateship for
// dependencies to link; this causes it to break with dependency config errors because it cannot
// find modules that have been hoisted up to flagship. This copies a patched version of the
// getDependencyConfig.js script into the react native CLI wherever it may live. Sometimes
// yarn will resolve react-native to the fstestproject directory so we have to copy the script
// there as well.

const fs = require('fs');
const path = require('path');

const patchFile = path.join(__dirname, 'getDependencyConfig.js');

fs.copyFileSync(
  patchFile,
  path.join(__dirname, '..', '..', '..', 'node_modules', '@react-native-community', 'cli', 'build', 'commands', 'link', 'getDependencyConfig.js')
);

console.log('patched node_modules/cli');

const fsTestProject = path.join(__dirname, '..', '..', '..', 'packages', 'fstestproject', 'node_modules', '@react-native-community', 'cli', 'build', 'commands', 'link', 'getDependencyConfig.js');

if (fs.existsSync(fsTestProject)) {
  fs.copyFileSync(
    patchFile,
    fsTestProject
  );

  console.log('patched packages/fstestproject/node_modules/cli');
}

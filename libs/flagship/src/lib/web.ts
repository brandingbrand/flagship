import {
  execSync as exec
} from 'child_process';
import * as fs from './fs';
import * as path from './path';
import {
  logError,
  logInfo,
  logWarn
} from '../helpers';
import { NPMPackageConfig } from '../types';

/**
 * Sets the homepage in the package.json
 *
 * @param {string} homepage The homepage to use.
 */
export function homepage(homepage: string): void {
  logInfo(`updating web/package.json homepage`);

  fs.update(packageJSONPath(), '{', `{"homepage": "${homepage}",`);
}

/**
 * Performs a yarn install for web packages.
 */
export function install(): void {
  logInfo(`running yarn for Web`);

  const webPath = path.project.resolve('web');

  try {
    exec(`cd ${webPath} && yarn`, {
      stdio: [0, 1, 2]
    });

    // Remove react dependency in web, the bundler will automatically pick up the one
    // from react-native
    fs.removeSync(path.project.resolve('web', 'node_modules', 'react'));

  } catch (err) {
    logError(`yarn for Web`, err);

    process.exit(1);
  }
}

/**
 * Creates symlinks in the web node_modules to all the dependencies in the host
 * project's package.json
 *
 * @param {object} packageJSON The project package.json
 */
export function link(packageJSON: NPMPackageConfig): void {
  logInfo('linking web node_modules to parent node_modules');

  const parentNodeModules = path.project.resolve('..', '..', 'node_modules');
  const mainNodeModules = path.project.resolve('node_modules');
  const webNodeModules = path.project.resolve('web', 'node_modules');

  Object.keys(packageJSON.dependencies || {}).forEach(dependency => {
    // Replace the `/` with the platform path separator
    // e.g. @brandingbrand/pirate-network to @brandingbrand\pirate-network
    const dependencyPath = dependency.split('/').join(path.sep);

    const destinationDependencyPath = path.resolve(webNodeModules, dependencyPath);
    const sourceDependencyPath = path.resolve(mainNodeModules, dependencyPath);
    const parentSourceDependencyPath = path.resolve(parentNodeModules, dependencyPath);

    // Ensure we have the dependency installed in the main node_modules
    if (fs.pathExistsSync(sourceDependencyPath)) {
      // Check if this dependency already exists
      if (fs.pathExistsSync(dependencyPath)) {
        // Remove it so we can replace it with the dependency from the main package
        fs.removeSync(dependencyPath);

        logWarn(`dependency ${dependency} existed in web node_modules and was removed`);
      }

      // Link the dependency to the main node_modules
      fs.ensureSymlinkSync(sourceDependencyPath, destinationDependencyPath);
    } else if (fs.pathExistsSync(parentSourceDependencyPath)) {
      // Check if this dependency already exists
      if (fs.pathExistsSync(dependencyPath)) {
        // Remove it so we can replace it with the dependency from the main package
        fs.removeSync(dependencyPath);

        logWarn(`dependency ${dependency} existed in web node_modules and was removed`);
      }

      // Link the dependency to the main node_modules
      fs.ensureSymlinkSync(parentSourceDependencyPath, destinationDependencyPath);
    } else {
      // The source dependency did not exist
      logWarn(`could not locate dependency ${dependency} in node_modules`);
    }
  });
}

/**
 * Injects a script fragment at a given path in the HTML header.
 *
 * @param {*} fragmentPath The path to the HTML fragment to inject in the header.
 */
export function headerScripts(fragmentPath?: string): void {
  if (!fragmentPath) {
    return;
  }

  logInfo(`injecting web header scripts from ${fragmentPath}`);

  try {
    const scripts = require(path.project.resolve(fragmentPath));

    fs.update(
      indexHTMLPath(),
      /<!--FLAGSHIP_SCRIPT_INJECT_HEADER_START-->[.\s]+<!--FLAGSHIP_SCRIPT_INJECT_HEADER_END-->/,
      `<!--FLAGSHIP_SCRIPT_INJECT_HEADER_START-->${scripts}<!--FLAGSHIP_SCRIPT_INJECT_HEADER_END-->`
    );

  } catch (err) {
    logError(`injecting web header scripts from ${fragmentPath}`, err);

    process.exit(1);
  }
}

/**
 * Injects a script fragment at a given path in the HTML footer.
 *
 * @param {*} fragmentPath The path to the HTML fragment to inject in the footer.
 */
export function footerScripts(fragmentPath?: string): void {
  if (!fragmentPath) {
    return;
  }

  logInfo(`injecting web footer scripts from ${fragmentPath}`);

  try {
    const scripts = require(path.project.resolve(fragmentPath));

    fs.update(
      indexHTMLPath(),
      /<!--FLAGSHIP_SCRIPT_INJECT_FOOTER_START-->[.\s]+<!--FLAGSHIP_SCRIPT_INJECT_FOOTER_END-->/,
      `<!--FLAGSHIP_SCRIPT_INJECT_FOOTER_START-->${scripts}<!--FLAGSHIP_SCRIPT_INJECT_FOOTER_END-->`
    );

  } catch (err) {
    logError(`injecting web footer scripts from ${fragmentPath}`, err);

    process.exit(1);
  }
}

/**
 * Sets the default title for the static HTML
 *
 * @param {string} title The default title for the static HTML.
 */
export function title(title?: string): void {
  if (!title) {
    logWarn('No <title> specified for web, use "webTitle" in package.json to specify');

    return;
  }

  logInfo(`updating web title to [${title}]`);

  fs.update(indexHTMLPath(), /<title>[^<]+<\/title>/, `<title>${title}</title>`);
}

/**
 * Returns the path to the package.json
 *
 * @returns {string} The path to package.json
 */
export function packageJSONPath(): string {
  return path.project.resolve('web', 'package.json');
}

/**
 * Returns the path to the index.html
 *
 * @returns {string} The path to index.html
 */
export function indexHTMLPath(): string {
  return path.project.resolve('web', 'public', 'index.html');
}

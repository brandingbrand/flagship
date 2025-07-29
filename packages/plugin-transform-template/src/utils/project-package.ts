import {path} from '@brandingbrand/code-cli-kit';
import {PackageJson} from 'type-fest';

let projectPackageJson: PackageJson | undefined;
/**
 * finds and loads the main project package.json file
 */
export const getProjectPackageJson = (): PackageJson => {
  if (!projectPackageJson) {
    projectPackageJson = require(
      path.project.resolve('package.json'),
    ) as PackageJson;
    if (!projectPackageJson) {
      throw new Error(
        'Unable to parse project package.json. Ensure it exists and is valid.',
      );
    }
  }
  return projectPackageJson;
};

export const getAllProjectDependencies = (): string[] => {
  const pkgJson = getProjectPackageJson();
  return [
    ...Object.keys(pkgJson.dependencies || {}),
    ...Object.keys(pkgJson.devDependencies || {}),
  ];
};

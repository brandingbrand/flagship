import {getReactNativeVersion} from '../platform';

import pathRN72, {packageToPath} from './path-0.72';
import pathRN73 from './path-0.73';

// Define the type for the version profiles
type VersionProfiles = {
  '0.72': typeof pathRN72;
  '0.73': typeof pathRN73;
};

// Define the profiles object with specific types
const profiles: VersionProfiles = {
  '0.72': pathRN72,
  '0.73': pathRN73,
};

// Get the React Native version
const reactNativeVersion = getReactNativeVersion();

// Ensure the version exists in the profiles object
if (!(reactNativeVersion in profiles)) {
  throw new Error(`Unsupported React Native version: ${reactNativeVersion}`);
}

// Select the appropriate path based on the React Native version
const path = profiles[reactNativeVersion as keyof typeof profiles];

// Export the selected path
export default path;

export {packageToPath};

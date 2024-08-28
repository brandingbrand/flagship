/**
 * Transformers module for ephemeral native code generation
 *
 * @module transformers
 */

import {getReactNativeVersion} from '@brandingbrand/code-cli-kit';

import * as androidTransformersRN72 from './transformers-0.72/android';
import * as iosTransformersRN72 from './transformers-0.72/ios';
import * as androidTransformersRN73 from './transformers-0.73/android';
import * as iosTransformersRN73 from './transformers-0.73/ios';

// Define the profiles object with specific types
const profiles = {
  '0.72': {
    iosTransformers: iosTransformersRN72,
    androidTransformers: androidTransformersRN72,
  },
  '0.73': {
    iosTransformers: iosTransformersRN73,
    androidTransformers: androidTransformersRN73,
  },
  '0.74': {
    iosTransformers: iosTransformersRN73,
    androidTransformers: androidTransformersRN73,
  },
};

// Get the React Native version
const reactNativeVersion = getReactNativeVersion();

// Ensure the version exists in the profiles object
if (!(reactNativeVersion in profiles)) {
  throw new Error(`Unsupported React Native version: ${reactNativeVersion}`);
}

// Select the appropriate transformers based on the React Native version
export const {iosTransformers, androidTransformers} =
  profiles[reactNativeVersion as keyof typeof profiles];

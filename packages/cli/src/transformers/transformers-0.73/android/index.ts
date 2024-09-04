// Import all named exports from the module located at '../../transformers-0.72/android'.
// Newly imported entities from this directory will overwrite existing transformations.
export * from '../../transformers-0.72/android';

// Specifically overwrite the implementation for MainApplication.kt in React Native 0.72.
// In React Native 0.72, MainApplication.java existed; this update replaces that implementation.
export {default as mainApplication} from './main-application-kt';

// Specifically overwrite the implementation for build.gradle in React Native 0.72.
// In React Native 0.72, build.gradle existed; this update replaces that implementation.
export {default as buildGradle} from './build-gradle';

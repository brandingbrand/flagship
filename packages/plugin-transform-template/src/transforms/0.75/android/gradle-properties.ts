import {transforms073} from '../../0.73';

/**
 * Destructures the androidGradlePropertiesTransform object from transforms073,
 * excluding the enableJetifier property while keeping all other transform properties
 * @constant {Object} androidGradlePropertiesTransform - Android Gradle properties transform object
 * @constant {boolean} enableJetifier - Property removed from transform object
 */
const {enableJetifier, ...androidGradlePropertiesTransform} =
  transforms073.androidGradlePropertiesTransform;

/**
 * Exports all Android Gradle properties transforms except enableJetifier
 * @exports {Object} Default export containing all Gradle properties transforms
 */
export default {
  ...androidGradlePropertiesTransform,
};

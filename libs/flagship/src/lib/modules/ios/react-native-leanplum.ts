import type { Config } from '../../../types';
import * as pods from '../../cocoapods';

/**
 * Patches iOS for the module.
 *
 * @param configuration The project configuration.
 */
export const preLink = (configuration: Config): void => {
  pods.add([`pod "Leanplum-iOS-SDK", '2.6.2'`]);
};

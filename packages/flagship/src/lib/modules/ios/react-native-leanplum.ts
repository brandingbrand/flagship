import * as path from '../../path';
import * as pods from '../../cocoapods';
import { Config } from '../../../types';

/**
 * Patches iOS for the module.
 *
 * @param {object} configuration The project configuration.
 */
export function preLink(configuration: Config): void {
  pods.add(path.ios.podfilePath(), [`pod "Leanplum-iOS-SDK", '2.1.0'`]);
}

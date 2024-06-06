import {canRunAndroid, canRunIOS} from '@brandingbrand/code-cli-kit';

import {androidTransformers, iosTransformers} from '@/transformers';
import {type Transforms, type Transformer, config, defineAction} from '@/lib';

/**
 * Represents the action to execute transformers based on platform availability.
 * @returns A promise resolving to a string indicating the result of transformer execution.
 */
export default defineAction(
  async () => {
    /**
     * Array of iOS transformers.
     * @type {Transformer<Transforms<any, any>>[]}
     */
    const iosTransformersValues: Transformer<Transforms<any, any>>[] =
      Object.values(iosTransformers);

    /**
     * Array of Android transformers.
     * @type {Transformer<Transforms<any, any>>[]}
     */
    const androidTransformersValues: Transformer<Transforms<any, any>>[] =
      Object.values(androidTransformers);

    /**
     * Executes transformations for an array of transformers.
     * @param {Transformer<Transforms<any, any>>[]} transformer - Array of transformers.
     * @returns {Promise<void>[]} A promise representing the completion of transformation.
     */
    const getTransformers = (
      transformer: Transformer<Transforms<any, any>>[],
    ): Promise<void>[] =>
      transformer.map(it => it.transform(config.build, config.options));

    /**
     * Invoke both iOS and Android platform transformers
     */
    if (canRunAndroid(config.options) && canRunIOS(config.options)) {
      const iosPromises = getTransformers(iosTransformersValues);
      const androidPromises = getTransformers(androidTransformersValues);

      await Promise.all([iosPromises, androidPromises]).catch(e => {
        throw Error(
          `Error: failed to apply all native build configuration transformations, ${e.message}`,
        );
      });

      return 'successfully invoked iOS and Android transformers';
    }

    /**
     * Invoke only Android platform transformers
     */
    if (canRunAndroid(config.options) && !canRunIOS(config.options)) {
      await Promise.all(getTransformers(androidTransformersValues)).catch(e => {
        throw Error(
          `Error: failed to apply all android build configuration transformations, ${e.message}`,
        );
      });

      return 'successfully invoked Android transformers';
    }

    /**
     * Invoke only iOS platform transformers
     */
    if (!canRunAndroid(config.options) && canRunIOS(config.options)) {
      await Promise.all(getTransformers(iosTransformersValues)).catch(e => {
        throw Error(
          `Error: failed to apply all ios build configuration transformations, ${e.message}`,
        );
      });

      return 'successfully invoked iOS transformers';
    }
  },
  'transformers',
  'code',
);

import { manifest } from "../../../utils";
import { withSummary } from "../../../utils/summary";

import type { Config } from "../../../types/types";
import type { InitOptions } from "../../../types/options";

export const execute = (options: InitOptions, config: Config) => ({
  ios: async () => {
    //
  },
  android: withSummary(
    async () => {
      const {
        manifestAttributes,
        mainActivityAttributes,
        mainApplicationAttributes,
        manifestElements,
        mainApplicationElements,
        mainActivityElements,
        urlScheme,
      } = config.android.manifest ?? {};

      if (manifestAttributes) {
        await manifest.setManifestAttributes(manifestAttributes);
      }

      if (mainActivityAttributes) {
        await manifest.setActivityAttributes(mainActivityAttributes);
      }

      if (mainApplicationAttributes) {
        await manifest.setApplicationAttributes(mainApplicationAttributes);
      }

      if (manifestElements) {
        await manifest.addManifestElements(manifestElements);
      }

      if (mainApplicationElements) {
        await manifest.addApplicationEelements(mainApplicationElements);
      }

      if (mainActivityElements) {
        await manifest.addActivityElements(mainActivityElements);
      }

      if (urlScheme) {
        await manifest.addActivityElements({
          "intent-filter": [
            {
              action: [
                {
                  $: {
                    "android:name": "android.intent.action.VIEW",
                  },
                },
              ],
              category: [
                {
                  $: {
                    "android:name": "android.intent.category.DEFAULT",
                  },
                },
                {
                  $: {
                    "android:name": "android.intent.category.BROWSABLE",
                  },
                },
              ],
              data: [
                {
                  $: {
                    "android:scheme": urlScheme.scheme,
                    ...(urlScheme.host && {
                      "android:host": urlScheme.host,
                    }),
                  },
                },
              ],
            },
          ],
        });
      }
    },
    "manifest",
    "platform::android"
  ),
});

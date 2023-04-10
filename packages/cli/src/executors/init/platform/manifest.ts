import { manifest, summary } from "@brandingbrand/code-core";

import type { Config, Options } from "@brandingbrand/code-core";

export const execute = (options: Options.InitOptions, config: Config) => ({
  ios: async () => {
    //
  },
  android: summary.withSummary(
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

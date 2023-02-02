import type { Config } from "../../../types/types";
import type { InitOptions } from "../../../types/options";
import { manifest } from "../../../utils";

export const execute = (options: InitOptions, config: Config) => ({
  ios: async () => {
    //
  },
  android: async () => {
    const {
      manifestAttributes,
      activityAttributes,
      applicationAttributes,
      manifestElements,
      applicationElements,
      mainActivityElements,
      urlScheme,
    } = config.android.manifest ?? {};

    if (manifestAttributes) {
      await manifest.setManifestAttributes(manifestAttributes);
    }

    if (activityAttributes) {
      await manifest.setMainActivityAttributes(activityAttributes);
    }

    if (applicationAttributes) {
      await manifest.setMainApplicationAttributes(applicationAttributes);
    }

    if (manifestElements) {
      await manifest.addManifestElements(manifestElements);
    }

    if (applicationElements) {
      await manifest.addApplicationEelements(applicationElements);
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
                  "android:host": urlScheme.host ?? "",
                },
              },
            ],
          },
        ],
      });
    }
  },
});

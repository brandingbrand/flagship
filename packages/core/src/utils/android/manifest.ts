import { Xml } from "../xml";

import type { Config } from "../../types/types";
import type {
  AndroidManifest,
  AndroidManifestAttributes,
} from "../../types/manifest";

export class Manifest extends Xml<AndroidManifest> {
  constructor(config: Config, filePath: string) {
    super(config, filePath, {});
  }

  setManifestAttributes(attributes: AndroidManifestAttributes) {
    this.xml = {
      ...this.xml,
      manifest: {
        ...this.xml.manifest,
        $: {
          ...this.xml.manifest.$,
          ...attributes,
        },
      },
    };
  }

  setApplicationAttributes() {
    //
  }

  setActivityAttributes() {
    //
  }

  setServiceAttributes() {
    //
  }

  setReceiverAttributes() {
    //
  }

  setProviderAttributes() {
    //
  }

  addActivity() {
    //
  }

  addService() {
    //
  }

  addReceiver() {
    //
  }

  addProvider() {
    //
  }
}

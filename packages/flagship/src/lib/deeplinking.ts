import * as fs from './fs';
import * as path from './path';

/**
 * Adds handling for deep linking for Android
 *
 * @export
 * @param {string[]} associatedDomains domains that will be handled by the app
 *  (eg. www.example.com, not https://www.example.com)
 * @returns {void}
 */
export function addDeeplinkHosts(associatedDomains: string[]): void {
  if (!Array.isArray(associatedDomains) || associatedDomains.length === 0) {
    return;
  }

  const androidIntents = associatedDomains.map(hostname => {
    if (hostname.includes('http://') || hostname.includes('https://')) {
      throw new Error(`Deep Link Hostnames cannot include a protocol.`);
    }

    return `
      <data android:scheme="http"
        android:host="${hostname}" />
      <data android:scheme="https"
        android:host="${hostname}" />`;
  });

  // update android's manifest
  fs.update(path.android.manifestPath(), '<!-- deep link intents -->', androidIntents.join('\n'));

  // not applicable to ios
}

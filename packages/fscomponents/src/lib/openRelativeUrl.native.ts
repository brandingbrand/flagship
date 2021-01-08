import { Linking } from 'react-native';
import url from 'url';

const env = require('../../env/env');

export default async function openRelativeUrl(href: string): Promise<void> {
  const absoluteUrl = url.resolve(env.urlScheme + '://', href);
  if (await Linking.canOpenURL(absoluteUrl)) {
    Linking.openURL(absoluteUrl).catch(e => console.error(e));
  }
}

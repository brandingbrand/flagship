import { Linking } from 'react-native';

export default async function openRelativeUrl(href: string): Promise<void> {
  if (await Linking.canOpenURL(href)) {
    Linking.openURL(href).catch(e => console.error(e));
  }
}

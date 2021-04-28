import { Alert } from '@brandingbrand/fscomponents';
import { Linking } from 'react-native';

export interface PromptToLinkType {
  title: string;
  subTitle: string;
  buttonText: string;
  link: string;
}

export default async function promptToLink({
  title,
  subTitle,
  buttonText,
  link
}: PromptToLinkType): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    Alert.alert({
      title,
      text: subTitle,
      confirmButtonText: buttonText,
      showCancelButton: true,
      onConfirm: async () => {
        return Linking.openURL(link)
          .then(resolve)
          .catch(reject);
      }
    });
  });
}

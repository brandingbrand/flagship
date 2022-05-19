import { Linking } from 'react-native';

import { Alert } from '@brandingbrand/fscomponents';

const promptToLink = async ({ buttonText, link, subTitle, title }: any): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    Alert.alert({
      title,
      text: subTitle,
      confirmButtonText: buttonText,
      showCancelButton: true,
      onConfirm: async () => Linking.openURL(link).then(resolve).catch(reject),
    });
  });

export default promptToLink;

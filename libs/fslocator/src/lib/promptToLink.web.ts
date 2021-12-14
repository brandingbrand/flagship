import { Alert } from '@brandingbrand/fscomponents';

export default async function promptToLink({
  title,
  subTitle,
  buttonText,
  link
}: any): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    Alert.alert({
      title,
      text: subTitle,
      confirmButtonText: buttonText,
      showCancelButton: true,
      onConfirm: async () => {
        window.location.href = link;
        resolve();
      }
    });
  });
}

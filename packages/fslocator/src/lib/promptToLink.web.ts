import { Alert } from '@brandingbrand/fscomponents';
import { PromptToLinkType } from './promptToLink';

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
        window.location.href = link;
        resolve();
      }
    });
  });
}

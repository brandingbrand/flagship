import { Alert as NativeAlert, AlertButton } from 'react-native';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
const componentTranslationKeys = translationKeys.flagship.alertDefaults;


export interface SerializedAlertOptions {
  title: string;
  text?: string;
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export interface AlertOptions extends SerializedAlertOptions {
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const Alert = {
  alert: (options: string | AlertOptions) => {
    if (typeof options === 'string') {
      NativeAlert.alert(options);
    } else {
      const buttons: AlertButton[] = [
        {
          text: options.confirmButtonText || FSI18n.string(componentTranslationKeys.ok),
          onPress: () => {
            if (options.onConfirm) {
              options.onConfirm();
            }
          }
        }
      ];

      if (options.showCancelButton) {
        buttons.unshift({
          text: options.cancelButtonText || FSI18n.string(componentTranslationKeys.cancel),
          style: 'cancel',
          onPress: () => {
            if (options.onCancel) {
              options.onCancel();
            }
          }
        });
      }

      NativeAlert.alert(options.title, options.text, buttons);
    }
  }
};

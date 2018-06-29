import { Alert as NativeAlert } from 'react-native';

export interface AlertOptions {
  title: string;
  text?: string;
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const Alert = {
  alert: (options: string | AlertOptions) => {
    if (typeof options === 'string') {
      NativeAlert.alert(options);
    } else {
      const buttons: any = [
        {
          text: options.confirmButtonText || 'OK',
          onPress: () => {
            if (options.onConfirm) {
              options.onConfirm();
            }
          }
        }
      ];

      if (options.showCancelButton) {
        buttons.unshift({
          text: options.cancelButtonText || 'Cancel',
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

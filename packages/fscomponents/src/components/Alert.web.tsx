import swal from 'sweetalert';
import { Dictionary } from '@brandingbrand/fsfoundation';

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
  setDefaults: swal.setDefaults, // tslint:disable-line:no-unbound-method
  alert: async (options: string | AlertOptions): Promise<void> => {
    if (typeof options === 'string') {
      return swal(options);
    } else {
      const args: Dictionary = {
        title: options.title,
        text: options.text
      };

      if (options.showCancelButton) {
        args.buttons = [
          options.cancelButtonText || true,
          options.confirmButtonText || true
        ];
      } else {
        if (options.confirmButtonText) {
          args.button = options.confirmButtonText;
        }
      }

      return swal(args)
        .then((isConfirm: boolean) => {
          if (isConfirm) {
            if (options.onConfirm) {
              options.onConfirm();
            }
          } else {
            if (options.onCancel) {
              options.onCancel();
            }
          }
        });
    }
  }
};

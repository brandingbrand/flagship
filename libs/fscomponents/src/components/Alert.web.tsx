import swal from 'sweetalert';

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
  // eslint-disable-next-line @typescript-eslint/unbound-method
  setDefaults: swal.setDefaults,
  alert: async (options: AlertOptions | string): Promise<void> => {
    if (typeof options === 'string') {
      return swal(options);
    }
    const args: Record<string, Array<boolean | string> | string | undefined> = {
      title: options.title,
      text: options.text,
    };

    if (options.showCancelButton) {
      args.buttons = [options.cancelButtonText || true, options.confirmButtonText || true];
    } else if (options.confirmButtonText) {
      args.button = options.confirmButtonText;
    }

    return swal(args).then((isConfirm: boolean) => {
      if (isConfirm) {
        if (options.onConfirm) {
          options.onConfirm();
        }
      } else if (options.onCancel) {
        options.onCancel();
      }
    });
  },
};

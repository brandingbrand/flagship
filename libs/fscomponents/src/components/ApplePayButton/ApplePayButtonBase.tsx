import { PureComponent } from 'react';

import type { ApplePayButtonProps } from './ApplePayButtonProps';

export abstract class ApplePayButtonBase extends PureComponent<ApplePayButtonProps> {
  public abstract render(): React.ReactNode;
}

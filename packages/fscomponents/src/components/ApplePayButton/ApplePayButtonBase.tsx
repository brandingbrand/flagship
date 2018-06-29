import { PureComponent } from 'react';
import { ApplePayButtonProps } from './ApplePayButtonProps';

export abstract class ApplePayButtonBase extends PureComponent<ApplePayButtonProps> {
  abstract render(): React.ReactNode;
}

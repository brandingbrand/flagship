import React from 'react';
import {
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProperties
} from 'react-native';
import { TouchableDelay } from './TouchableDelay';

const TouchableWithoutFeedbackWithHref:
  React.ComponentClass<TouchableWithoutFeedbackLinkProps> = TouchableWithoutFeedback;

export interface TouchableWithoutFeedbackLinkProps extends TouchableWithoutFeedbackProperties {
  href?: string;
}

export class TouchableWithoutFeedbackLink extends TouchableDelay<
  TouchableWithoutFeedbackLinkProps
> {
  render(): JSX.Element {
    const { href, onPress, ...props } = this.props;

    return (
      <TouchableWithoutFeedbackWithHref
        {...props}
        href={href}
        accessibilityTraits='link'
        onPress={this.handleOnPress}
      >
        {this.props.children}
      </TouchableWithoutFeedbackWithHref>
    );
  }
}

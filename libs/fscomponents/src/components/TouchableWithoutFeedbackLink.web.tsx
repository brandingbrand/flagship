import React from 'react';

import type { TouchableWithoutFeedbackProperties } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';

import { TouchableDelay } from './TouchableDelay';

const TouchableWithoutFeedbackWithHref: React.ComponentClass<TouchableWithoutFeedbackLinkProps> =
  TouchableWithoutFeedback;

export interface TouchableWithoutFeedbackLinkProps extends TouchableWithoutFeedbackProperties {
  href?: string;
}

export class TouchableWithoutFeedbackLink extends TouchableDelay<TouchableWithoutFeedbackLinkProps> {
  public render(): JSX.Element {
    const { href, onPress, ...props } = this.props;

    return (
      <TouchableWithoutFeedbackWithHref
        {...props}
        accessibilityRole="link"
        href={href}
        onPress={this.handleOnPress}
      >
        {this.props.children}
      </TouchableWithoutFeedbackWithHref>
    );
  }
}

import React, { Component } from 'react';
import {
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProperties
} from 'react-native';

export interface TouchableWithoutFeedbackLinkProps extends TouchableWithoutFeedbackProperties {
  href?: string;
}

export class TouchableWithoutFeedbackLink extends Component<TouchableWithoutFeedbackLinkProps> {
  render(): JSX.Element {
    const { href, ...props } = this.props;

    return (
      <TouchableWithoutFeedback accessibilityTraits='link' {...props}>
        {this.props.children}
      </TouchableWithoutFeedback>
    );
  }
}

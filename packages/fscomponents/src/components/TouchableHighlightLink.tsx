import React, { PureComponent } from 'react';
import { TouchableHighlight, TouchableHighlightProperties } from 'react-native';

export interface TouchableHighlightLinkProps extends TouchableHighlightProperties {
  href?: string;
}

export class TouchableHighlightLink extends PureComponent<TouchableHighlightLinkProps> {
  render(): JSX.Element {
    const { href, ...props } = this.props;

    return (
      <TouchableHighlight accessibilityTraits='link' {...props}>
        {this.props.children}
      </TouchableHighlight>
    );
  }
}

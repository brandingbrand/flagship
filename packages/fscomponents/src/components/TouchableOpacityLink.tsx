import React, { PureComponent } from 'react';
import { TouchableOpacity, TouchableOpacityProperties } from 'react-native';

export interface TouchableOpacityLinkProps extends TouchableOpacityProperties {
  href?: string;
}

export class TouchableOpacityLink extends PureComponent<TouchableOpacityLinkProps> {
  render(): JSX.Element {
    const { href, ...props } = this.props;

    return (
      <TouchableOpacity accessibilityTraits='link' {...props}>
        {this.props.children}
      </TouchableOpacity>
    );
  }
}

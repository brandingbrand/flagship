import React from 'react';
import { TouchableOpacity, TouchableOpacityProperties } from 'react-native';
import { TouchableDelay } from './TouchableDelay';

const TouchableOpacityWithHref: any = TouchableOpacity;

export interface TouchableOpacityLinkProps extends TouchableOpacityProperties {
  href?: string;
}

export class TouchableOpacityLink extends TouchableDelay<TouchableOpacityLinkProps> {
  render(): JSX.Element {
    const { href, onPress, ...props } = this.props;

    return (
      <TouchableOpacityWithHref
        {...props}
        href={href}
        accessibilityTraits='link'
        onPress={this.handleOnPress}
      >
        {this.props.children}
      </TouchableOpacityWithHref>
    );
  }
}

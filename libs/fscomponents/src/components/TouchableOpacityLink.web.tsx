import React from 'react';

import type { TouchableOpacityProperties } from 'react-native';
import { TouchableOpacity } from 'react-native';

import { TouchableDelay } from './TouchableDelay';

const TouchableOpacityWithHref: React.ComponentClass<TouchableOpacityLinkProps> = TouchableOpacity;

export interface TouchableOpacityLinkProps extends TouchableOpacityProperties {
  href?: string;
}

export class TouchableOpacityLink extends TouchableDelay<TouchableOpacityLinkProps> {
  public render(): JSX.Element {
    const { href, onPress, ...props } = this.props;

    return (
      <TouchableOpacityWithHref
        {...props}
        accessibilityRole="link"
        href={href}
        onPress={this.handleOnPress}
      >
        {this.props.children}
      </TouchableOpacityWithHref>
    );
  }
}

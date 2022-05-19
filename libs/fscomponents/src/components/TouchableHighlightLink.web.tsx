import React from 'react';

import type { TouchableHighlightProperties } from 'react-native';
import { TouchableHighlight } from 'react-native';

import { TouchableDelay } from './TouchableDelay';

const TouchableHighlightWithHref: React.ComponentClass<TouchableHighlightLinkProps> =
  TouchableHighlight;

export interface TouchableHighlightLinkProps extends TouchableHighlightProperties {
  href?: string;
}

export class TouchableHighlightLink extends TouchableDelay<TouchableHighlightLinkProps> {
  public render(): JSX.Element {
    const { href, onPress, ...props } = this.props;

    return (
      <TouchableHighlightWithHref
        {...props}
        accessibilityRole="link"
        href={href}
        onPress={this.handleOnPress}
      >
        {this.props.children}
      </TouchableHighlightWithHref>
    );
  }
}

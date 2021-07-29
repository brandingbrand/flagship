import React from 'react';
import { TouchableHighlight, TouchableHighlightProperties } from 'react-native';
import { TouchableDelay } from './TouchableDelay';

const TouchableHighlightWithHref:
  React.ComponentClass<TouchableHighlightLinkProps> = TouchableHighlight;

export interface TouchableHighlightLinkProps extends TouchableHighlightProperties {
  href?: string;
}

export class TouchableHighlightLink extends TouchableDelay<TouchableHighlightLinkProps> {
  render(): JSX.Element {
    const { href, onPress, ...props } = this.props;

    return (
      <TouchableHighlightWithHref
        {...props}
        href={href}
        accessibilityTraits='link'
        onPress={this.handleOnPress}
      >
        {this.props.children}
      </TouchableHighlightWithHref>
    );
  }
}

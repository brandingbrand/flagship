import React, { FunctionComponent } from 'react';
import { TouchableHighlight, TouchableHighlightProperties } from 'react-native';

export interface TouchableHighlightLinkProps extends TouchableHighlightProperties {
  href?: string;
}

export const TouchableHighlightLink: FunctionComponent<TouchableHighlightLinkProps> = ({
  children,
  ...props
}): JSX.Element => {
  const { href, ...rest } = props;

  return (
    <TouchableHighlight accessibilityRole='link' {...rest}>
      {children}
    </TouchableHighlight>
  );
};

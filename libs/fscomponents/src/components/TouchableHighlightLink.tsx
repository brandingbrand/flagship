import type { FunctionComponent } from 'react';
import React from 'react';

import type { TouchableHighlightProperties } from 'react-native';
import { TouchableHighlight } from 'react-native';

export interface TouchableHighlightLinkProps extends TouchableHighlightProperties {
  href?: string;
}

export const TouchableHighlightLink: FunctionComponent<TouchableHighlightLinkProps> = ({
  children,
  ...props
}): JSX.Element => {
  const { href, ...rest } = props;

  return (
    <TouchableHighlight accessibilityRole="link" {...rest}>
      {children}
    </TouchableHighlight>
  );
};

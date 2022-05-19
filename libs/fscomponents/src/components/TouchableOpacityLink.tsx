import type { FunctionComponent } from 'react';
import React from 'react';

import type { TouchableOpacityProperties } from 'react-native';
import { TouchableOpacity } from 'react-native';

export interface TouchableOpacityLinkProps extends TouchableOpacityProperties {
  href?: string;
}

export const TouchableOpacityLink: FunctionComponent<TouchableOpacityLinkProps> = ({
  children,
  ...props
}): JSX.Element => {
  const { href, ...properties } = props;
  return (
    <TouchableOpacity accessibilityRole="link" {...properties}>
      {children}
    </TouchableOpacity>
  );
};

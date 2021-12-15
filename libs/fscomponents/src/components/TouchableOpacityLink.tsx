import React, { FunctionComponent } from 'react';
import { TouchableOpacity, TouchableOpacityProperties } from 'react-native';

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

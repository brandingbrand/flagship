import type { FunctionComponent } from 'react';
import React from 'react';

import type { TouchableWithoutFeedbackProperties } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';

export interface TouchableWithoutFeedbackLinkProps extends TouchableWithoutFeedbackProperties {
  href?: string;
}

export const TouchableWithoutFeedbackLink: FunctionComponent<TouchableWithoutFeedbackLinkProps> = ({
  children,
  ...props
}): JSX.Element => {
  const { href, ...rest } = props;

  return (
    <TouchableWithoutFeedback accessibilityRole="link" {...rest}>
      {children}
    </TouchableWithoutFeedback>
  );
};

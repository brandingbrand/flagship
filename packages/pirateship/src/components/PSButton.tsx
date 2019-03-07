import React, { FunctionComponent } from 'react';
import { Button, ButtonProps } from '@brandingbrand/fscomponents';
import { palette } from '../styles/variables';

const PSButton: FunctionComponent<ButtonProps> = (props): JSX.Element => {
  return <Button palette={palette} {...props} />;
};

export default PSButton;

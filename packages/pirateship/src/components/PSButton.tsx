import React from 'react';
import { Button, ButtonProps } from '@brandingbrand/fscomponents';

import { palette } from '../styles/variables';

const PSButton = (props: ButtonProps) => {
  return <Button palette={palette} {...props} />;
};

export default PSButton;

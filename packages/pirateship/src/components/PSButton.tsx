import React, { Component } from 'react';
import { Button, ButtonProps } from '@brandingbrand/fscomponents';

import { palette } from '../styles/variables';

export default class PSButton extends Component<ButtonProps> {
  render(): React.ReactNode {
    return <Button palette={palette} {...this.props} />;
  }
}

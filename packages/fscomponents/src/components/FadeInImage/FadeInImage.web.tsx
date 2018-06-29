import React, { PureComponent } from 'react';
import { Image } from 'react-native';
import { FadeInImageProps } from './FadeInImageProps';

export class FadeInImage extends PureComponent<FadeInImageProps> {
  render(): React.ReactNode {
    return <Image {...this.props} />;
  }
}

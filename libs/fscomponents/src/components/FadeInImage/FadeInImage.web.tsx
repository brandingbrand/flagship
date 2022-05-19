import React, { PureComponent } from 'react';

import { Image } from 'react-native';

import type { FadeInImageProps } from './FadeInImageProps';

export class FadeInImage extends PureComponent<FadeInImageProps> {
  public render(): React.ReactNode {
    return <Image {...this.props} />;
  }
}

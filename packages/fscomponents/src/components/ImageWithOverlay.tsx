import React, { PureComponent } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { style as S } from '../styles/ImageWithOverlay';
import { FadeInImage, FadeInImageProps } from './FadeInImage';
import { get } from 'lodash-es';

export interface ImageWithOverlayProps {
  imageProps: FadeInImageProps;
  overlay?: JSX.Element;
  style?: StyleProp<ViewStyle>;
  overlayPosition?:
    | 'bottomLeft'
    | 'bottomCenter'
    | 'bottomRight'
    | 'centerLeft'
    | 'center'
    | 'centerRight'
    | 'topLeft'
    | 'topCenter'
    | 'topRight';
}

export class ImageWithOverlay extends PureComponent<ImageWithOverlayProps> {
  render(): React.ReactNode {
    const {
      overlay,
      style,
      imageProps,
      overlayPosition
    } = this.props;

    const overlayStyle = get(S, overlayPosition || 'bottomLeft');

    return (
      <View style={style}>
        <FadeInImage {...imageProps} />
        {overlay &&
          <View style={[S.overlayContainer, overlayStyle]}>
            {overlay}
          </View>}
      </View>
    );
  }
}

import React from 'react';
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

export const ImageWithOverlay = React.memo((props: ImageWithOverlayProps): JSX.Element => {
  const {
    overlay,
    style,
    imageProps,
    overlayPosition
  } = props;
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
});

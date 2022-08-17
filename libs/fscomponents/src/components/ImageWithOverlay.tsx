import React from 'react';

import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';

import { get } from 'lodash-es';

import { style as S } from '../styles/ImageWithOverlay';

import type { FadeInImageProps } from './FadeInImage';
import { FadeInImage } from './FadeInImage';

export interface ImageWithOverlayProps {
  imageProps: FadeInImageProps;
  overlay?: JSX.Element;
  style?: StyleProp<ViewStyle>;
  overlayPosition?:
    | 'bottomCenter'
    | 'bottomLeft'
    | 'bottomRight'
    | 'center'
    | 'centerLeft'
    | 'centerRight'
    | 'topCenter'
    | 'topLeft'
    | 'topRight';
}

const ImageWithOverlayInner = (props: ImageWithOverlayProps): JSX.Element => {
  const { imageProps, overlay, overlayPosition, style } = props;
  const overlayStyle = get(S, overlayPosition || 'bottomLeft');

  return (
    <View style={style}>
      <FadeInImage {...imageProps} />
      {overlay ? <View style={[S.overlayContainer, overlayStyle]}>{overlay}</View> : null}
    </View>
  );
};

export const ImageWithOverlay = React.memo(ImageWithOverlayInner);

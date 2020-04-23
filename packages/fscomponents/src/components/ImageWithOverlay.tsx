import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { style as S } from '../styles/ImageWithOverlay';
import { FadeInImage, FadeInImageProps } from './FadeInImage';
import { get } from 'lodash-es';

export interface SerializedImageWithOverlayProps {
  imageProps: FadeInImageProps;
  overlay?: string | JSX.Element;
  style?: ViewStyle;
}

export interface ImageWithOverlayProps extends Omit<SerializedImageWithOverlayProps,
  'style' |
  'overlayPosition'
  > {
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

const ImageWithOverlayInner = (props: ImageWithOverlayProps): JSX.Element => {
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
      {overlay && (
        <View style={[S.overlayContainer, overlayStyle]}>
          {overlay}
        </View>
      )}
    </View>
  );
};

export const ImageWithOverlay = React.memo(ImageWithOverlayInner);

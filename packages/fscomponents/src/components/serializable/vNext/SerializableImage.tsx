import React, { FC, useMemo } from 'react';
import { Image, ImageProps, ImageStyle } from 'react-native';

export interface SerializableImageProps
  extends Pick<
    ImageProps,
    | 'accessibilityLabel'
    | 'accessible'
    | 'blurRadius'
    | 'capInsets'
    | 'defaultSource'
    | 'fadeDuration'
    | 'loadingIndicatorSource'
    | 'progressiveRenderingEnabled'
    | 'resizeMethod'
    | 'resizeMode'
    | 'style'
    | 'testID'
  > {
  uri?: string;
  height?: number;
  width?: number;
  style?: ImageStyle;
}

export const SerializableImage: FC<SerializableImageProps> = ({ uri, height, width, ...props }) => {
  const source = useMemo(() => ({ uri, height, width }), [uri, height, width]);
  return <Image {...props} source={source} />;
};

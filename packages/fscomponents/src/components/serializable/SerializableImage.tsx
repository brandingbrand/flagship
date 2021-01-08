import React from 'react';
import { Image, ImageProps, ImageStyle, TouchableOpacity } from 'react-native';
import openRelativeUrl from '../../lib/openRelativeUrl';

export interface SerializableImageProps extends Pick<ImageProps,
  'style' | 'blurRadius' | 'resizeMode' | 'source' | 'loadingIndicatorSource' |
  'testID' | 'resizeMethod' | 'accessibilityLabel' | 'accessible' | 'capInsets' | 'defaultSource' |
  'fadeDuration' | 'progressiveRenderingEnabled'
> {
  href?: string;
  style?: ImageStyle;
}

const onPress = (href: string) => () => {
  openRelativeUrl(href).catch(e => console.error(e));
};

export const SerializableImage: React.FC<SerializableImageProps> = React.memo(({
  href,
  ...props
}) => {
  const img = <Image {...props} />;

  if (!href) {
    return img;
  }

  return (
    <TouchableOpacity onPress={onPress(href)}>
      {img}
    </TouchableOpacity>
  );
});

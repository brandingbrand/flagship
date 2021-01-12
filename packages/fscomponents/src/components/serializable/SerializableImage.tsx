import React from 'react';
import { Image, ImageProps, ImageStyle, StyleProp, TouchableOpacity } from 'react-native';

export interface SerializableImageProps extends Pick<ImageProps,
  'style' | 'blurRadius' | 'resizeMode' | 'source' | 'loadingIndicatorSource' |
  'testID' | 'resizeMethod' | 'accessibilityLabel' | 'accessible' | 'capInsets' | 'defaultSource' |
  'fadeDuration' | 'progressiveRenderingEnabled'
> {
  href?: string;
  style?: StyleProp<ImageStyle>;
  onPress?: (href: string) => () => void;
}

export const FSSerializableImage: React.FC<SerializableImageProps> = React.memo(({
  href,
  onPress,
  ...props
}) => {
  const img = <Image {...props} />;

  if (!(href && onPress)) {
    return img;
  }

  return (
    <TouchableOpacity onPress={onPress(href)}>
      {img}
    </TouchableOpacity>
  );
});

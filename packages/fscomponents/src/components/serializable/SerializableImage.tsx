import React from 'react';
import { Image, ImageProps, ImageStyle, TouchableOpacity } from 'react-native';
import { extractHostStyles } from '../../lib/style';

export interface SerializableImageProps
  extends Pick<
    ImageProps,
    | 'style'
    | 'blurRadius'
    | 'resizeMode'
    | 'source'
    | 'loadingIndicatorSource'
    | 'testID'
    | 'resizeMethod'
    | 'accessibilityLabel'
    | 'accessible'
    | 'capInsets'
    | 'defaultSource'
    | 'fadeDuration'
    | 'progressiveRenderingEnabled'
  > {
  href?: string;
  style?: ImageStyle;
  onPress?: () => void;
}

export const FSSerializableImage = React.memo<SerializableImageProps>(
  ({ onPress, style, ...props }) => {
    const [host, self] = extractHostStyles(style);

    if (!onPress) {
      return <Image {...props} style={[host, self]} />;
    }

    return (
      <TouchableOpacity style={host} onPress={onPress}>
        <Image {...props} style={self} />
      </TouchableOpacity>
    );
  }
);

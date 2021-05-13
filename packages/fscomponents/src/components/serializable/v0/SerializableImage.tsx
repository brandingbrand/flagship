import React from 'react';
import { Image, ImageProps, ImageStyle, TouchableOpacity } from 'react-native';
import { extractHostStyles } from '../../../lib/style';
import { useNavigator } from '@brandingbrand/fsapp';

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
  onPress?: (href?: string) => void;
}

export const FSSerializableImage = React.memo<SerializableImageProps>(
  ({ onPress, style, href, ...props }) => {
    const [host, self] = extractHostStyles(style);
    const navigator = useNavigator();

    const handlePress = (href?: string) => () => {
      if (onPress) {
        onPress(href);
      } else if (href) {
        navigator.open(href);
      }
    };

    if (!(href || onPress)) {
      return <Image {...props} style={[self, host]} />;
    }

    return (
      <TouchableOpacity style={host} onPress={handlePress(href)}>
        <Image {...props} style={self} />
      </TouchableOpacity>
    );
  }
);

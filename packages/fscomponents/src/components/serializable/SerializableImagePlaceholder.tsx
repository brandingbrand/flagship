import React, { useCallback } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { SerializableImageProps } from './SerializableImage';
import { useNavigator } from '@brandingbrand/fsapp';

export const SerializableImagePlaceholder = React.memo<SerializableImageProps>(
  ({ onPress, href, ...props }) => {
    const img = <Image {...props} />;
    const navigator = useNavigator();

    if (!(href || onPress)) {
      return img;
    }

    const handlePress = useCallback(() => {
      if (onPress) {
        onPress(href);
      } else if (href) {
        navigator.open(href);
      }
    }, [href]);

    return <TouchableOpacity onPress={handlePress}>{img}</TouchableOpacity>;
  }
);

import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { SerializableImageProps } from './SerializableImage';

export const SerializableImagePlaceholder = React.memo<SerializableImageProps>(
  ({ onPress, ...props }) => {
    const img = <Image {...props} />;

    if (!onPress) {
      return img;
    }

    return <TouchableOpacity onPress={onPress}>{img}</TouchableOpacity>;
  }
);

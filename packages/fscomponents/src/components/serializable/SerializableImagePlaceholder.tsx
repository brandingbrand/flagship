import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { SerializableImageProps } from './SerializableImage';

export const SerializableImagePlaceholder = React.memo<SerializableImageProps>(
  ({ href, onPress, ...props }) => {
    const img = <Image {...props} />;

    if (!(href && onPress)) {
      return img;
    }
    return (
      <TouchableOpacity onPress={onPress(href)}>
        {img}
      </TouchableOpacity>
    );
  }
);

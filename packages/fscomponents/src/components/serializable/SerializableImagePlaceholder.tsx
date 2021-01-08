import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import openRelativeUrl from '../../lib/openRelativeUrl';
import { SerializableImageProps } from './SerializableImage';

const onPress = (href: string) => () => {
  openRelativeUrl(href).catch(e => console.error(e));
};

export const SerializableImagePlaceholder = React.memo<SerializableImageProps>(
  ({ href, ...props }) => {
    const img = <Image {...props} />;

    if (!href) {
      return img;
    }

    return <TouchableOpacity onPress={onPress(href)}>{img}</TouchableOpacity>;
  }
);

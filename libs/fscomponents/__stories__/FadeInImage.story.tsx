import React from 'react';

import { Linking, StyleSheet, TouchableOpacity } from 'react-native';

import { files, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { FadeInImage } from '../src/components/FadeInImage';

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
  },
  imageStyle: {
    height: 100,
    marginTop: 20,
    width: 100,
  },
});
const deepLink = (deepLinkText: string) => () => {
  void Linking.openURL(deepLinkText);
};

storiesOf('FadeInImage', module).add('basic usage', () => {
  const deepLinkText = text('Deep Link Url', 'https://google.com');
  const label = 'Images';
  const accept = '.xlsx, .pdf, .png, .jpg, jpeg';
  const defaultValue = ['https://placehold.it/100x100'];
  const value = files(label, accept, defaultValue);
  return (
    <TouchableOpacity onPress={deepLink(deepLinkText)} style={styles.imageContainer}>
      <FadeInImage
        resizeMethod="resize"
        resizeMode="contain"
        source={{ uri: value[0] }}
        style={styles.imageStyle}
      />
    </TouchableOpacity>
  );
});

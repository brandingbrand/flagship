import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { FadeInImage } from '../FadeInImage/FadeInImage';
import {
  files
// tslint:disable-next-line no-submodule-imports no-implicit-dependencies
} from '@storybook/addon-knobs/react';
const styles = StyleSheet.create({
  imageStyle: {
    width: 100,
    height: 100,
    marginTop: 20
  },
  imageContainer: {
    alignItems: 'center'
  }
});

storiesOf('FadeInImage', module)
    .add('basic usage', () => {
      const label = 'Images';
      const accept = '.xlsx, .pdf, .png, .jpg, jpeg';
      const defaultValue = ['https://placehold.it/100x100'];
      const value = files(label, accept, defaultValue);
      return (
          <View style={styles.imageContainer}>
            <FadeInImage
                source={{uri: value[0]}}
                resizeMode='contain'
                resizeMethod='resize'
                style={styles.imageStyle}
            />
          </View>
      );
    });

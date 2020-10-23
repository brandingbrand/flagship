import React from 'react';
import {
  Linking,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { FadeInImage } from '../FadeInImage';
import {
  files, text
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';

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
const deepLink = (deepLinkText: any) => () => {
  // tslint:disable-next-line
  Linking.openURL(deepLinkText);
};

storiesOf('FadeInImage', module)
    .add('basic usage', () => {
      const deepLinkText = text('Deep Link Url', 'https://google.com');
      const label = 'Images';
      const accept = '.xlsx, .pdf, .png, .jpg, jpeg';
      const defaultValue = ['https://placehold.it/100x100'];
      const value = files(label, accept, defaultValue);
      return (
          <TouchableOpacity onPress={deepLink(deepLinkText)} style={styles.imageContainer}>
            <FadeInImage
                source={{uri: value[0]}}
                resizeMode='contain'
                resizeMethod='resize'
                style={styles.imageStyle}
            />
          </TouchableOpacity>
      );
    });

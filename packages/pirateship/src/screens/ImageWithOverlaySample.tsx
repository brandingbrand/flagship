/* tslint:disable:jsx-use-translation-function */
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PSScreenWrapper from '../components/PSScreenWrapper';
import { NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import { navBarTabLanding } from '../styles/Navigation';
import { ImageWithOverlay, ImageWithOverlayProps } from '@brandingbrand/fscomponents';

const styles = StyleSheet.create({
  overlay: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  section: {
    margin: 15
  },
  image: {
    width: 350,
    height: 150
  }
});

const overlay = <Text style={styles.overlay}>Text Overlay</Text>;

export interface ImageWithOverlaySampleScreenProps extends ScreenProps, ImageWithOverlayProps {}

class ImageWithOverlaySample extends Component<ImageWithOverlaySampleScreenProps> {
  static navigatorStyle: NavigatorStyle = navBarTabLanding;

  render(): JSX.Element {

    const { navigator } = this.props;

    return (
      <PSScreenWrapper
        hideGlobalBanner={true}
        navigator={navigator}
      >
        <View style={styles.section}>
        <ImageWithOverlay
          imageProps={{
            source: { uri: 'https://placehold.it/350x150' },
            style: styles.image
          }}
          overlay={overlay}
          overlayPosition={'center'}
        />
        </View>
      </PSScreenWrapper>
    );
  }
}

export default ImageWithOverlaySample;

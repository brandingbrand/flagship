import React from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, TouchableOpacity } from 'react-native';
import { Navigator } from '@brandingbrand/fsapp';

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    zIndex: 10,
    top: 50,
    left: 8,
    padding: 12
  },
  backIcon: {
    width: 14,
    height: 25
  }
});

const backArrow = require('../../assets/images/backArrow.png');

export interface BackButtonProps {
  navigator: Navigator;
  style?: StyleProp<ImageStyle>;
}

export const BackButton: React.FunctionComponent<BackButtonProps> = React.memo(props => {
  const onBackPress = async (): Promise<void> => props.navigator.pop();
  return (
    <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
      <Image
        resizeMode='contain'
        source={backArrow}
        style={[styles.backIcon, props.style]}
      />
    </TouchableOpacity>
  );
});

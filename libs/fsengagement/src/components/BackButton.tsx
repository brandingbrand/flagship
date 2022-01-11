import React from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, TouchableOpacity } from 'react-native';
import { Navigator, useNavigator } from '@brandingbrand/fsapp';

import backArrow from '../../assets/images/backArrow.png';

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    zIndex: 10,
    top: 50,
    left: 8,
    padding: 12,
  },
  backIcon: {
    width: 14,
    height: 25,
  },
});

export interface BackButtonProps {
  navigator?: Navigator;
  discoverPath?: string;
  style?: StyleProp<ImageStyle>;
}

export const BackButton: React.FunctionComponent<BackButtonProps> = React.memo((props) => {
  const navigator = props.discoverPath ? useNavigator() : props.navigator;
  const onBackPress = async (): Promise<void> => {
    return navigator?.pop();
  };
  return (
    <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
      <Image resizeMode="contain" source={backArrow} style={[styles.backIcon, props.style]} />
    </TouchableOpacity>
  );
});

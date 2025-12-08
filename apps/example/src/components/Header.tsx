import React, {type ReactNode} from 'react';
import {ImageBackground, StyleProp, ViewStyle} from 'react-native';
import assets from '../assets';
import {createStyleSheet} from '../lib/theme';
import {Text} from './Text';

export interface HeaderProps {
  style?: StyleProp<ViewStyle>;
}

const Header = (props: HeaderProps): ReactNode => {
  const styles = useStyles();
  return (
    <ImageBackground
      accessibilityRole="image"
      testID="new-app-screen-header"
      source={assets.logo}
      style={[styles.background, props.style]}
      imageStyle={styles.logo}>
      <Text type="primary" style={styles.title}>
        Welcome to
        {'\n'}
        Flagship Code™
      </Text>
    </ImageBackground>
  );
};

const useStyles = createStyleSheet(palette => ({
  background: {
    backgroundColor: palette.bg,
    paddingTop: 64,
    paddingBottom: 48,
    paddingHorizontal: 32,
    overflow: 'hidden',
  },
  logo: {
    opacity: 0.25,
    resizeMode: 'cover',
    marginBottom: -256,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
  },
}));

export default Header;

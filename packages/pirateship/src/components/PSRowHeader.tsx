import React, { FunctionComponent } from 'react';

import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';

import { fontSize, palette } from '../styles/variables';

export interface PSRowHeaderProps {
  title: string;
  titleStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
  view: {
    padding: 10,
    backgroundColor: palette.surface
  },
  title: {
    fontSize: fontSize.small,
    fontWeight: 'bold',
    color: palette.onSurface
  }
});

const PSRowHeader: FunctionComponent<PSRowHeaderProps> = (props): JSX.Element => {
  return (
    <View style={[styles.view, props.style]}>
      <Text style={[styles.title, props.titleStyle]}>{props.title}</Text>
    </View>
  );
};

export default PSRowHeader;

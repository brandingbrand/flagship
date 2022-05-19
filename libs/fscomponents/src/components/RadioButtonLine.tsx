import React from 'react';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { palette } from '../styles/variables';

export interface SerializableRadioButtonLineProps {
  text: string;
  active?: boolean;
  activeOpacity?: number;
  disabled?: boolean;
  // Styles
  styleContainer?: ViewStyle;
  styleText?: TextStyle;
  styleTextActive?: TextStyle;
}

export interface RadioButtonLineProps
  extends Omit<
    SerializableRadioButtonLineProps,
    'styleContainer' | 'styleText' | 'styleTextActive'
  > {
  onPress?: () => void;
  label?: JSX.Element;
  // Styles
  styleContainer?: StyleProp<ViewStyle>;
  styleText?: StyleProp<TextStyle>;
  styleTextActive?: StyleProp<TextStyle>;
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: palette.secondary,
    borderRadius: 50,
    height: 13,
    width: 13,
  },
  container: {
    alignItems: 'center',
    borderBottomColor: palette.secondary,
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 18,
    paddingVertical: 25,
  },
  imageWrap: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  imagesRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  radioContainer: {
    alignItems: 'center',
    backgroundColor: palette.background,
    borderColor: palette.secondary,
    borderRadius: 50,
    borderWidth: 1.5,
    display: 'flex',
    flexDirection: 'row',
    height: 30,
    justifyContent: 'center',
    marginLeft: 15,
    width: 30,
  },
  text: {
    color: palette.secondary,
    fontSize: 15,
    letterSpacing: 0.5,
    lineHeight: 30,
    textTransform: 'capitalize',
  },
});

const RadioButtonLineInner: React.FunctionComponent<RadioButtonLineProps> = ({
  active,
  activeOpacity,
  disabled,
  label,
  onPress,
  styleContainer,
  styleText,
  styleTextActive,
  text,
}: RadioButtonLineProps): React.ReactElement => (
  <TouchableOpacity
    activeOpacity={activeOpacity || 0}
    disabled={disabled}
    onPress={onPress}
    style={[styles.container, styleContainer]}
  >
    <Text style={[styles.text, styleText, active ? styleTextActive : undefined]}>{text}</Text>
    <View style={styles.imageWrap}>
      {label}
      <View style={styles.radioContainer}>{active && <View style={styles.circle} />}</View>
    </View>
  </TouchableOpacity>
);

export const RadioButtonLine = React.memo(RadioButtonLineInner);

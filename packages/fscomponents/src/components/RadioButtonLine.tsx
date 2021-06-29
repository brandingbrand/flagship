import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
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

export interface RadioButtonLineProps extends Omit<
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
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 18,
    paddingVertical: 25,
    borderBottomWidth: 1,
    borderBottomColor: palette.secondary
  },
  text: {
    fontSize: 15,
    lineHeight: 30,
    letterSpacing: 0.5,
    color: palette.secondary,
    textTransform: 'capitalize'
  },
  imageWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  imagesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  radioContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderWidth: 1.5,
    borderColor: palette.secondary,
    backgroundColor: palette.background,
    borderRadius: 50,
    marginLeft: 15
  },
  circle: {
    width: 13,
    height: 13,
    borderRadius: 50,
    backgroundColor: palette.secondary
  }
});

const RadioButtonLineInner: React.FunctionComponent<RadioButtonLineProps> = ({
  text,
  active,
  activeOpacity,
  styleContainer,
  styleText,
  styleTextActive,
  onPress,
  disabled,
  label
}: RadioButtonLineProps): React.ReactElement => {
  return (
    <TouchableOpacity
      style={[styles.container, styleContainer]}
      activeOpacity={activeOpacity || 0}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.text, styleText,
          active ? styleTextActive : undefined
        ]}
      >
        {text}
      </Text>
      <View style={styles.imageWrap}>
        {label}
        <View
          style={styles.radioContainer}
        >
          {active && (
            <View style={styles.circle} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const RadioButtonLine = React.memo(RadioButtonLineInner);

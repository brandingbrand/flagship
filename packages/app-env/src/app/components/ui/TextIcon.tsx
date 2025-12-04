import React, {memo} from 'react';
import {StyleSheet, View, type StyleProp, type TextStyle} from 'react-native';

import {palette} from '../../lib/theme';

import {Text} from './Text';

const iconTypeMap = {
  arrowLeft: '←',
  arrowRight: '→',
  close: '⨉',
} as const;

export interface TextIconProps {
  size?: number;
  style?: StyleProp<TextStyle>;
  type: keyof typeof iconTypeMap;
}

export const TextIcon = memo<TextIconProps>(({size = 16, style, type}) => {
  return (
    <View style={[styles.container, {width: size, height: size}]}>
      <Text
        adjustsFontSizeToFit
        allowFontScaling={false}
        numberOfLines={1}
        style={[
          styles.icon,
          {fontSize: size},
          size < 20 && styles.icon_bold,
          style,
        ]}>
        {iconTypeMap[type]}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: palette.neutralFg,
  },
  icon_bold: {
    fontWeight: 'bold',
  },
});

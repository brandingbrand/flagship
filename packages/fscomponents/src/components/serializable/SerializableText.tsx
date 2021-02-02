import React from 'react';
import { Text, TextProps, TextStyle, View, ViewStyle } from 'react-native';

export interface SerializableTextProps
  extends Pick<
    TextProps,
    | 'selectable'
    | 'accessibilityHint'
    | 'accessibilityLabel'
    | 'accessible'
    | 'ellipsizeMode'
    | 'nativeID'
    | 'numberOfLines'
    | 'allowFontScaling'
    | 'maxFontSizeMultiplier'
    | 'testID'
    | 'selectionColor'
    | 'textBreakStrategy'
    | 'adjustsFontSizeToFit'
    | 'minimumFontScale'
    | 'suppressHighlighting'
  > {
  childText: string;
  style?: TextStyle;
  boxStyle?: ViewStyle;
}

export const FSSerializableText = React.memo<SerializableTextProps>(
  ({ childText, boxStyle, ...textProps }) => (
    <View style={boxStyle}>
      <Text {...textProps}>{childText}</Text>
    </View>
  )
);

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
  containerStyle?: ViewStyle;
}

export const FSSerializableText = React.memo<SerializableTextProps>(
  ({ childText, containerStyle, ...textProps }) => (
    <View style={containerStyle}>
      <Text {...textProps}>{childText}</Text>
    </View>
  )
);

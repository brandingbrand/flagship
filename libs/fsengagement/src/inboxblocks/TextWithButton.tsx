import React from 'react';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import type { CTABlockProps } from './CTABlock';
import { CTABlock } from './CTABlock';
import type { TextBlockProps } from './TextBlock';
import { TextBlock } from './TextBlock';

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  flexContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
});

interface Contents {
  Text: TextBlockProps;
  CTA: CTABlockProps;
}
export interface TextWithButtonProps {
  contents: Contents;
  textFlex: number;
  containerStyle?: StyleProp<ViewStyle>;
  titleContainer?: StyleProp<TextStyle>;
}

export const TextWithButton: React.FC<TextWithButtonProps> = React.memo((props) => {
  const { containerStyle, contents, textFlex, titleContainer } = props;

  return (
    <View style={containerStyle}>
      <View style={styles.flexContainer}>
        <View style={[styles.titleContainer, { flex: textFlex || 1 }, titleContainer]}>
          <TextBlock {...contents.Text} />
        </View>
        <View style={styles.linkContainer}>
          <CTABlock {...contents.CTA} />
        </View>
      </View>
    </View>
  );
});

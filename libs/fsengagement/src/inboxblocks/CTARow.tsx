import React from 'react';

import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import type { ScreenProps } from '../types';

import type { CTABlockProps } from './CTABlock';
import { CTABlock } from './CTABlock';

export interface CTARowProps extends ScreenProps {
  items: CTABlockProps[];
  containerStyle?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    flex: 1,
  },
});

export const CTARow: React.FC<CTARowProps> = React.memo((props) => {
  const { containerStyle, items } = props;

  return (
    <View style={[styles.row, containerStyle]}>
      {items.map((item: CTABlockProps) => (
        <View key={Math.floor(Math.random() * 1000000).toString()} style={styles.item}>
          <CTABlock {...item} />
        </View>
      ))}
    </View>
  );
});

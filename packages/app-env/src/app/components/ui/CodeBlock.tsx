import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';

import {palette} from '../../lib/theme';

import {Text} from './Text';

export interface CodeBlockProps {
  children: string;
}

export function CodeBlock({children}: CodeBlockProps) {
  return (
    <ScrollView style={styles.codeBlock}>
      <ScrollView
        horizontal
        contentContainerStyle={styles.codeBlock__contentContainer}
        showsHorizontalScrollIndicator={false}>
        <Text type="code" style={styles.codeBlock__text}>
          {children}
        </Text>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  codeBlock: {
    flex: 1,
    backgroundColor: palette.neutralBgStrong,
    borderColor: palette.neutralBorder,
    borderWidth: 1,
  },
  codeBlock__contentContainer: {
    padding: 8,
  },
  codeBlock__text: {
    flex: 1,
  },
});

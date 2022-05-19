import React from 'react';

import type { GestureResponderEvent } from 'react-native';
import { StyleSheet, Text, TouchableHighlight } from 'react-native';

const styles = StyleSheet.create({
  row: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    padding: 15,
    paddingHorizontal: 10,
  },
});

export interface TouchableRowProps {
  children?: number | string;
  onPress: (event?: GestureResponderEvent) => void;
}

export const TouchableRow: React.FC<TouchableRowProps> = ({ children, onPress }) => (
  <TouchableHighlight onPress={onPress} style={styles.row} underlayColor="#eee">
    <Text>{children}</Text>
  </TouchableHighlight>
);

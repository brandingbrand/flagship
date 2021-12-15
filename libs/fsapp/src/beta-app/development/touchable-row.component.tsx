import React from 'react';
import { GestureResponderEvent, StyleSheet, Text, TouchableHighlight } from 'react-native';

const styles = StyleSheet.create({
  row: {
    padding: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export interface TouchableRowProps {
  children?: string | number;
  onPress: (event?: GestureResponderEvent) => void;
}

export const TouchableRow: React.FC<TouchableRowProps> = ({ children, onPress }) => {
  return (
    <TouchableHighlight style={styles.row} underlayColor="#eee" onPress={onPress}>
      <Text>{children}</Text>
    </TouchableHighlight>
  );
};

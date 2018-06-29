import React from 'react';
import { StyleSheet, Text, TouchableHighlight } from 'react-native';

const styles = StyleSheet.create({
  row: {
    padding: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  }
});

export interface TouchableRowProps {
  text: string;
  onPress: (event?: any) => void;
}

const TouchableRow: React.StatelessComponent<TouchableRowProps> = ({ text, onPress }) => {
  return (
    <TouchableHighlight style={styles.row} underlayColor='#eee' onPress={onPress}>
      <Text>{text}</Text>
    </TouchableHighlight>
  );
};

export default TouchableRow;

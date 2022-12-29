import React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableHighlight
} from 'react-native';

const styles = StyleSheet.create({
  row: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    padding: 15,
    paddingHorizontal: 10
  }
});

export interface TouchableRowProps {
  text?: number | string;
  onPress: (event?: GestureResponderEvent) => void;
}

const TouchableRow: React.FunctionComponent<TouchableRowProps> = ({ onPress, text }) => (
  <TouchableHighlight onPress={onPress} style={styles.row} underlayColor='#eee'>
    <Text>{text}</Text>
  </TouchableHighlight>
);

export default TouchableRow;

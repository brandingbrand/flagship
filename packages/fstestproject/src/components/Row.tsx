import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight
} from 'react-native';

const S = StyleSheet.create({
  row: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  rowText: {
    fontSize: 15
  }
});

export default class Row extends Component<any> {
  render(): JSX.Element {
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        style={S.row}
        underlayColor='#eee'
      >
        <Text style={S.rowText}>{this.props.text}</Text>
      </TouchableHighlight>
    );
  }
}

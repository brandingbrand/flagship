import React, { Component } from 'react';
import {
  ScrollView,
  Text
} from 'react-native';

export default class DataView extends Component<any, any> {
  render(): JSX.Element {
    return (
      <ScrollView style={{ flex: 1 }}>
        <Text>{this.props.json}</Text>
      </ScrollView>
    );
  }
}

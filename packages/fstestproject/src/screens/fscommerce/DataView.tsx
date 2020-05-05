import React, { Component } from 'react';
import {
  ScrollView,
  Text
} from 'react-native';

interface DataViewProps {
  json: string;
}

export default class DataView extends Component<DataViewProps> {
  render(): JSX.Element {
    return (
      <ScrollView style={{ flex: 1 }}>
        <Text numberOfLines={300}>
          {this.props.json}
        </Text>
      </ScrollView>
    );
  }
}

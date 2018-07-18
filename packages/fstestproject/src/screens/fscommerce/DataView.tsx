import React, { Component } from 'react';
import {
  ScrollView,
  Text
} from 'react-native';

export default class DataView extends Component<any, any> {
  render(): JSX.Element {
    return (
      <ScrollView style={{ flex: 1 }}>
        {/* for whatever reason, text doesn't like more than ~300 lines*/}
        <Text numberOfLines={300}>
          {this.props.json}
        </Text>
      </ScrollView>
    );
  }
}

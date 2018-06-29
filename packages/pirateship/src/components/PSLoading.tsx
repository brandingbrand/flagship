import React, { Component } from 'react';
import { ActivityIndicator, StyleProp, View, ViewStyle } from 'react-native';

export interface PSLoadingProps {
  style?: StyleProp<ViewStyle>;
  size?: 'small' | 'large';
}

export default class PSLoading extends Component<PSLoadingProps> {
  render(): JSX.Element {
    return (
      <View style={this.props.style}>
        <ActivityIndicator />
      </View>
    );
  }
}

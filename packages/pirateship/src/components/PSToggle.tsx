import React, { Component } from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

import { border } from '../styles/variables';

export interface PSToggleProps {
  enabled: boolean;
  label: JSX.Element;
  style?: StyleProp<ViewStyle>;
  onPress?: Function;
}

const styles = StyleSheet.create({
  toggler: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  base: {
    width: 26,
    height: 26,
    borderRadius: 13,
    color: 'white',
    marginRight: 10,
    overflow: 'hidden'
  },
  enabled: {
    backgroundColor: 'green',
    paddingLeft: 6,
    paddingTop: 2
  },
  disabled: {
    backgroundColor: 'white',
    borderWidth: border.width,
    borderColor: border.color
  }
});

export default class PSToggle extends Component<PSToggleProps> {
  state: any = {};

  constructor(props: PSToggleProps) {
    super(props);

    this.state.enabled = props.enabled;
  }

  render(): JSX.Element {
    const textStyle = [styles.base, this.state.enabled ? styles.enabled : styles.disabled];
    return (
      <View style={this.props.style}>
        <TouchableOpacity style={styles.toggler} onPress={this.onPress}>
          <Text style={textStyle}>{this.state.enabled ? '✔' : ''}</Text>
          {this.props.label}
        </TouchableOpacity>
      </View>
    );
  }

  onPress = () => {
    const enabled = !this.state.enabled;
    this.setState({ enabled });

    if (this.props.onPress) {
      this.props.onPress(enabled);
    }
  }
}

import React, { Component } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';

export interface SelectableRowProps {
  title: string;
  onPress?: () => void;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  markerIconStyle?: StyleProp<ViewStyle>;
  renderCheckMark?: () => React.ReactNode;
  renderUncheckMark?: () => React.ReactNode;
}

const S = StyleSheet.create({
  row: {
    height: 50,
    paddingLeft: 10,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  rowText: {
    fontSize: 16
  },
  marker: {
    position: 'absolute',
    right: 15,
    height: 50,
    justifyContent: 'center'
  },
  markerIcon: {
    width: 17,
    height: 10,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: 'black',
    transform: [
      {
        rotate: '-45deg'
      }
    ]
  }
});

export class SelectableRow extends Component<SelectableRowProps> {
  renderCheckMark = () => {
    if (this.props.renderCheckMark) {
      return this.props.renderCheckMark();
    }

    return (
      <View style={S.marker}>
        <View style={[S.markerIcon, this.props.markerIconStyle]} />
      </View>
    );
  }

  renderUncheckMark = () => {
    if (this.props.renderUncheckMark) {
      return this.props.renderUncheckMark();
    }
    return null;
  }

  render(): JSX.Element {
    return (
      <TouchableOpacity
        style={[S.row, this.props.style]}
        onPress={this.props.onPress}
      >
        <Text style={[S.rowText, this.props.textStyle]}>
          {this.props.title}
        </Text>
        {this.props.selected
          ? this.renderCheckMark()
          : this.renderUncheckMark()}
      </TouchableOpacity>
    );
  }
}

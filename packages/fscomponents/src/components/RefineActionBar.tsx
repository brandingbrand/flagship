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
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

export interface RefineActionBarProps {
  style?: StyleProp<ViewStyle>;
  filterButtonStyle?: StyleProp<ViewStyle>;
  sortButtonStyle?: StyleProp<ViewStyle>;
  filterButtonTextStyle?: StyleProp<TextStyle>;
  sortButtonTextStyle?: StyleProp<TextStyle>;
  onFilterPress: () => void;
  onSortPress: () => void;
}

const S = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  button: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  buttonText: {
    fontSize: 16
  },
  buttonLeft: {},
  buttonRight: {
    marginLeft: 10
  }
});

export class RefineActionBar extends Component<RefineActionBarProps> {
  render(): JSX.Element {
    return (
      <View style={[S.container, this.props.style]}>
        <TouchableOpacity
          onPress={this.props.onFilterPress}
          style={[S.button, S.buttonLeft, this.props.filterButtonStyle]}
        >
          <Text style={[S.buttonText, this.props.filterButtonTextStyle]}>
            {FSI18n.string(translationKeys.flagship.sort.actions.filter.actionBtn)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.props.onSortPress}
          style={[S.button, S.buttonRight, this.props.sortButtonStyle]}
        >
          <Text style={[S.buttonText, this.props.sortButtonTextStyle]}>
            {FSI18n.string(translationKeys.flagship.sort.actions.sort.actionBtn)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

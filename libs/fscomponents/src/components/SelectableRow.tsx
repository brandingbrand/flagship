import React, { FunctionComponent, memo } from 'react';
import {
  AccessibilityRole,
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
  selectedTextStyle?: StyleProp<TextStyle>;
  markerIconStyle?: StyleProp<ViewStyle>;
  renderCheckMark?: () => React.ReactNode;
  renderUncheckMark?: () => React.ReactNode;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
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

export const SelectableRow: FunctionComponent<SelectableRowProps> =
memo((props): JSX.Element => {
  const renderCheckMark = () => {
    if (props.renderCheckMark) {
      return props.renderCheckMark();
    }

    return (
      <View style={S.marker}>
        <View style={[S.markerIcon, props.markerIconStyle]} />
      </View>
    );
  };

  const renderUncheckMark = () => {
    if (props.renderUncheckMark) {
      return props.renderUncheckMark();
    }
    return null;
  };

  return (
    <TouchableOpacity
      style={[S.row, props.style]}
      onPress={props.onPress}
      accessibilityLabel={props.accessibilityLabel || props.title}
      accessibilityRole={props.accessibilityRole || 'button'}
    >
      <Text
        style={[
          S.rowText,
          props.textStyle,
          props.selected ? props.selectedTextStyle : undefined
        ]}
      >
        {props.title}
      </Text>
      {props.selected
        ? renderCheckMark()
        : renderUncheckMark()}
    </TouchableOpacity>
  );
});

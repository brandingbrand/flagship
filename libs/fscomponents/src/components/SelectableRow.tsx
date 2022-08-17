import type { FunctionComponent } from 'react';
import React, { memo } from 'react';

import type { AccessibilityRole, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface SelectableRowProps {
  title: string;
  onPress?: () => void;
  selected?: boolean;
  radioButton?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  selectedTextStyle?: StyleProp<TextStyle>;
  markerIconStyle?: StyleProp<ViewStyle>;
  renderRadioButton?: () => React.ReactNode;
  renderCheckMark?: () => React.ReactNode;
  renderUncheckMark?: () => React.ReactNode;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
}

const S = StyleSheet.create({
  circle: {
    backgroundColor: 'black',
    borderRadius: 50,
    height: 13,
    width: 13,
  },
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#333132',
    borderRadius: 50,
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  marker: {
    height: 50,
    justifyContent: 'center',
    position: 'absolute',
    right: 15,
  },
  markerIcon: {
    borderBottomWidth: 2,
    borderColor: 'black',
    borderLeftWidth: 2,
    height: 10,
    transform: [
      {
        rotate: '-45deg',
      },
    ],
    width: 17,
  },
  row: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    height: 50,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  rowText: {
    fontSize: 16,
  },
  selectedContainer: {
    borderWidth: 1.5,
  },
});

export const SelectableRow: FunctionComponent<SelectableRowProps> = memo((props): JSX.Element => {
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

  const renderRadioButton = () => (
    <View style={S.marker}>
      <View style={props.selected ? [S.container, S.selectedContainer] : [S.container]}>
        {props.selected ? <View style={S.circle} /> : null}
      </View>
    </View>
  );

  return (
    <TouchableOpacity
      accessibilityLabel={props.accessibilityLabel || props.title}
      accessibilityRole={props.accessibilityRole || 'button'}
      onPress={props.onPress}
      style={[S.row, props.style]}
    >
      <Text
        style={[S.rowText, props.textStyle, props.selected ? props.selectedTextStyle : undefined]}
      >
        {props.title}
      </Text>
      {props.radioButton ? renderRadioButton() : null}
      {!props.radioButton && props.selected ? renderCheckMark() : renderUncheckMark()}
    </TouchableOpacity>
  );
});

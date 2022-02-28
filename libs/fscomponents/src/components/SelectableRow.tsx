import React, { FunctionComponent, memo } from 'react';
import {
  AccessibilityRole,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

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
  row: {
    height: 50,
    paddingLeft: 10,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: '#333132',
    backgroundColor: 'white',
    borderRadius: 50,
  },
  circle: {
    width: 13,
    height: 13,
    borderRadius: 50,
    backgroundColor: 'black',
  },
  rowText: {
    fontSize: 16,
  },
  selectedContainer: {
    borderWidth: 1.5,
  },
  marker: {
    position: 'absolute',
    right: 15,
    height: 50,
    justifyContent: 'center',
  },
  markerIcon: {
    width: 17,
    height: 10,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: 'black',
    transform: [
      {
        rotate: '-45deg',
      },
    ],
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

  const renderRadioButton = () => {
    return (
      <View style={S.marker}>
        <View style={props.selected ? [S.container, S.selectedContainer] : [S.container]}>
          {props.selected && <View style={S.circle} />}
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[S.row, props.style]}
      onPress={props.onPress}
      accessibilityLabel={props.accessibilityLabel || props.title}
      accessibilityRole={props.accessibilityRole || 'button'}
    >
      <Text
        style={[S.rowText, props.textStyle, props.selected ? props.selectedTextStyle : undefined]}
      >
        {props.title}
      </Text>
      {props.radioButton && renderRadioButton()}
      {!props.radioButton && props.selected ? renderCheckMark() : renderUncheckMark()}
    </TouchableOpacity>
  );
});

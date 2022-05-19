import type { FunctionComponent } from 'react';
import React, { memo } from 'react';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
  button: {
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
    height: 40,
    justifyContent: 'center',
  },
  buttonLeft: {},
  buttonRight: {
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 16,
  },
  container: {
    flexDirection: 'row',
  },
});

export const RefineActionBar: FunctionComponent<RefineActionBarProps> = memo(
  (props): JSX.Element => (
    <View style={[S.container, props.style]}>
      <TouchableOpacity
        onPress={props.onFilterPress}
        style={[S.button, S.buttonLeft, props.filterButtonStyle]}
      >
        <Text style={[S.buttonText, props.filterButtonTextStyle]}>
          {FSI18n.string(translationKeys.flagship.sort.actions.filter.actionBtn)}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={props.onSortPress}
        style={[S.button, S.buttonRight, props.sortButtonStyle]}
      >
        <Text style={[S.buttonText, props.sortButtonTextStyle]}>
          {FSI18n.string(translationKeys.flagship.sort.actions.sort.actionBtn)}
        </Text>
      </TouchableOpacity>
    </View>
  )
);

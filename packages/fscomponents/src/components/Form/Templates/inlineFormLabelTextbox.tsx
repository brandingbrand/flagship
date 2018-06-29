import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
// @ts-ignore: TODO fix types for tcomb-form-native
import * as t from 'tcomb-form-native';
import { Dictionary } from '@brandingbrand/fsfoundation';
import { defaultFormStyle } from './formBoilerplate';

const styles = StyleSheet.create({
  inlineFormGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  errorControlLabel: {
    padding: 10,
    color: 'red'
  },
  labelView: {
    width: 130
  }
});

export function inlineFormLabelTextbox(locals: Dictionary): JSX.Element {

  const defaultStyle = defaultFormStyle(locals);

  const {
    formGroupStyle,
    textboxStyle,
    textboxViewStyle,
    label,
    error,
    help
  } = defaultStyle;

  return (
    <View>
      <View style={[formGroupStyle, styles.inlineFormGroup]}>
        <View style={styles.labelView}>
          {label}
        </View>
        <View style={textboxViewStyle}>
          <TextInput
            accessibilityLabel={locals.label}
            /* tslint:disable-next-line */
            ref='input'
            onChangeText={locals.onChange}
            onChange={locals.onChangeNative}
            style={textboxStyle}
            {...locals}
          />
        </View>
        {error}
      </View>
      <View>
        {help}
      </View>
    </View>
  );
}

import React from 'react';
import { TextInput, View } from 'react-native';
// @ts-ignore: TODO fix types for tcomb-form-native
import * as t from 'tcomb-form-native';
import { Dictionary } from '@brandingbrand/fsfoundation';
import { defaultFormStyle } from './formBoilerplate';

export function hiddenFormLabelTextbox(locals: Dictionary): JSX.Element {

  const defaultStyle = defaultFormStyle(locals);

  const {
    formGroupStyle,
    textboxStyle,
    textboxViewStyle,
    error,
    help
  } = defaultStyle;

  return (
    <View>
      <View style={formGroupStyle}>
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

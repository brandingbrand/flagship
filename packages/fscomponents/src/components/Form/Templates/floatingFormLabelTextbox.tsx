import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
// @ts-ignore: TODO fix types for tcomb-form-native
import * as t from 'tcomb-form-native';
import { Dictionary } from '@brandingbrand/fsfoundation';
import { defaultFormStyle } from './formBoilerplate';


const styles = StyleSheet.create({
  controlLabel: {
    fontSize: 15,
    color: 'grey'
  },
  errorControlLabel: {
    fontSize: 15,
    color: 'red'
  }
});


export function floatingFormLabelTextbox(locals: Dictionary): JSX.Element {

  const defaultStyle = defaultFormStyle(locals);

  const {
    formGroupStyle,
    controlLabelStyle,
    textboxStyle,
    textboxViewStyle,
    error,
    help
  } = defaultStyle;

  let {
    label
  } = defaultStyle;

  if (locals.value !== '') {
    locals.hasError
    ? label =
      <Text style={[controlLabelStyle, styles.errorControlLabel]}>{locals.placeholder}</Text>
    : label = <Text style={[controlLabelStyle, styles.controlLabel]}>{locals.placeholder}</Text>;
  } else {
    label = <Text style={[controlLabelStyle, styles.controlLabel]}>&nbsp;</Text>;
  }

  return (
    <View>
      <View style={formGroupStyle}>
        {label}
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

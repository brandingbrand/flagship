import React from 'react';
import { Text } from 'react-native';
// @ts-ignore: TODO fix types for tcomb-form-native
import * as t from 'tcomb-form-native';
import { Dictionary } from '@brandingbrand/fsfoundation';

export function defaultFormStyle(locals: Dictionary): Dictionary {

  const stylesheet = locals.stylesheet;

  let formGroupStyle = stylesheet.formGroup.normal;
  let controlLabelStyle = stylesheet.controlLabel.normal;
  let textboxStyle = stylesheet.textbox.normal;
  let textboxViewStyle = stylesheet.textboxView.normal;
  let helpBlockStyle = stylesheet.helpBlock.normal;
  const errorBlockStyle = stylesheet.errorBlock;

  if (locals.hasError) {
    formGroupStyle = stylesheet.formGroup.error;
    controlLabelStyle = stylesheet.controlLabel.error;
    textboxStyle = stylesheet.textbox.error;
    textboxViewStyle = stylesheet.textboxView.error;
    helpBlockStyle = stylesheet.helpBlock.error;
  }

  if (locals.editable === false) {
    textboxStyle = stylesheet.textbox.notEditable;
    textboxViewStyle = stylesheet.textboxView.notEditable;
  }

  let label;
  let error;
  let help;

  if (typeof locals.label === 'string') {
    label = <Text style={controlLabelStyle}>{locals.label}</Text>;
  } else if (React.isValidElement(locals.label)) {
    label = locals.label;
  }


  if (typeof locals.help === 'string') {
    help = <Text style={helpBlockStyle}>{locals.help}</Text>;
  } else if (React.isValidElement(locals.help)) {
    help = locals.help;
  }

  if (typeof locals.error === 'string') {
    error = (
      <Text accessibilityLiveRegion='polite' style={errorBlockStyle}>
        {locals.error}
      </Text>
    );
  } else if (React.isValidElement(locals.error)) {
    error = locals.error;
  }

  return {
    formGroupStyle,
    controlLabelStyle,
    textboxStyle,
    textboxViewStyle,
    helpBlockStyle,
    errorBlockStyle,
    label,
    help,
    error
  };

}

import React from 'react';
import { Text, TextInput, View } from 'react-native';

export function textbox(locals: {[key: string]: any}): JSX.Element | null {
  if (locals.hidden) {
    return null;
  }

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

  let label = null;
  let help = null;
  let error = null;

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

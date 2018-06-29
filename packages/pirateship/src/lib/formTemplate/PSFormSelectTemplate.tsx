import React from 'react';
import { Text, View } from 'react-native';
import { Selector } from '@brandingbrand/fscomponents';

interface Option {
  value: any;
  text: string;
}

export function select(locals: any): any {
  if (locals.hidden) {
    return null;
  }

  const stylesheet = locals.stylesheet;
  let formGroupStyle = stylesheet.formGroup.normal;
  let controlLabelStyle = stylesheet.controlLabel.normal;
  const selectContainerStyle = stylesheet.selectContainer.normal;
  let selectStyle = stylesheet.select.normal;
  let helpBlockStyle = stylesheet.helpBlock.normal;
  const errorBlockStyle = stylesheet.errorBlock;
  const selectButtonStyle = stylesheet.selectButtonStyle;
  let placeholderStyle = (stylesheet.selectPlaceholder || {}).normal;
  let labelStyle = (stylesheet.selectLabel || {}).normal;

  if (locals.hasError) {
    formGroupStyle = stylesheet.formGroup.error;
    controlLabelStyle = stylesheet.controlLabel.error;
    selectStyle = stylesheet.select.error;
    helpBlockStyle = stylesheet.helpBlock.error;
    placeholderStyle = (stylesheet.selectPlaceholder || {}).error;
    labelStyle = (stylesheet.selectLabel || {}).error;
  }

  delete selectStyle.color;

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

  const options = (locals.options as Option[]).map(({ value, text }) => ({
    label: text,
    value
  }));

  const onValueChange = (value: any) => {
    locals.onChange(value);
    if (locals.config && locals.config.onValueChange) {
      locals.config.onValueChange(value);
    }
  };

  return (
    <View>
      <View style={formGroupStyle}>
        {label}
        <Selector
          // tslint:disable-next-line
          ref='input'
          style={selectStyle}
          selectButtonStyle={selectButtonStyle}
          containerStyle={selectContainerStyle}
          placeholderStyle={placeholderStyle}
          labelStyle={labelStyle}
          selectedValue={locals.value}
          items={options}
          {...locals.config}
          onValueChange={onValueChange}
        />
        {error}
      </View>
      <View>
        {help}
      </View>
    </View>
  );
}

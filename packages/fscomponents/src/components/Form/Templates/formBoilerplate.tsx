import React from 'react';
import { Text } from 'react-native';
// @ts-ignore: TODO fix types for tcomb-form-native
import * as t from 'tcomb-form-native';
import { Dictionary } from '@brandingbrand/fsfoundation';

export type ComputeFieldType = (prevField: any) => () => void;

export interface StatefulTextboxProps {
  locals: Dictionary;
  // for use w/ custom field templates
  componentFactory?: any;
}

export interface StatefulTextboxState {
  active: boolean;
  validated: boolean;
}

export function getColor(state: Dictionary, locals: Dictionary): String {
  const colors = locals.stylesheet.colors;

  if (state.active) {
    return colors.active;
  } else {
    return locals.hasError ? colors.error : colors.inactive;
  }
}

export const successIcon = require('../../../../assets/images/checkmarkValidation.png');
export const errorIcon = require('../../../../assets/images/alert.png');

export function defaultTextboxStyle(locals: Dictionary): Dictionary {

  const stylesheet = locals.stylesheet;

  let controlLabelStyle = stylesheet.controlLabel.normal;
  let formGroupStyle = stylesheet.formGroup.normal;
  let helpBlockStyle = stylesheet.helpBlock.normal;
  let inlineFormGroupStyle = stylesheet.inlineFormGroup.normal;
  let textboxFullBorderStyle = stylesheet.textboxFullBorder.normal;
  let textboxInlineStyle = stylesheet.textboxInline.normal;
  let textboxUnderlineStyle = stylesheet.textboxUnderline.normal;
  let textboxViewStyle = stylesheet.textboxView.normal;

  const alertStyle = stylesheet.alert;
  const checkStyle = stylesheet.check;
  const errorBlockStyle = stylesheet.errorBlock;
  const floatingLabelViewStyle = stylesheet.floatingLabelView;
  const inlineLabelViewStyle = stylesheet.inlineLabelView;
  const rightTextboxIconStyle = stylesheet.rightTextboxIcon;

  if (locals.hasError) {
    controlLabelStyle = stylesheet.controlLabel.error;
    formGroupStyle = stylesheet.formGroup.error;
    helpBlockStyle = stylesheet.helpBlock.error;
    inlineFormGroupStyle = stylesheet.inlineFormGroup.error;
    textboxFullBorderStyle = stylesheet.textboxFullBorder.error;
    textboxInlineStyle = stylesheet.textboxInline.error;
    textboxUnderlineStyle = stylesheet.textboxUnderline.error;
    textboxViewStyle = stylesheet.textboxView.error;
  }

  if (locals.editable === false) {
    textboxFullBorderStyle = stylesheet.textboxFullBorder.notEditable;
    textboxInlineStyle = stylesheet.textboxInline.notEditable;
    textboxUnderlineStyle = stylesheet.textboxUnderline.notEditable;
    textboxViewStyle = stylesheet.textboxView.notEditable;
  }

  let error;
  let help;
  let label;

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

  const activeErrorField = (
    <Text accessibilityLiveRegion='polite' style={errorBlockStyle}>
      &nbsp;
    </Text>
    );

  error = locals.error ? (
            <Text accessibilityLiveRegion='polite' style={errorBlockStyle}>
              {locals.error}
            </Text>
            ) : activeErrorField;

  return {
    alertStyle,
    checkStyle,
    controlLabelStyle,
    activeErrorField,
    error,
    errorBlockStyle,
    floatingLabelViewStyle,
    formGroupStyle,
    help,
    helpBlockStyle,
    inlineFormGroupStyle,
    inlineLabelViewStyle,
    label,
    rightTextboxIconStyle,
    textboxFullBorderStyle,
    textboxInlineStyle,
    textboxUnderlineStyle,
    textboxViewStyle
  };
}


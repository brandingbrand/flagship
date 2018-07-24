import React from 'react';
import { TextInputMask } from 'react-native-masked-text';
import {
  labelAboveFieldTemplate,
  labelFloatingFieldTemplate,
  labelHiddenFieldTemplate,
  labelInlineFieldTemplate
} from './fieldTemplates';
import { Dictionary } from '@brandingbrand/fsfoundation';

function renderMaskedInput(locals: Dictionary, textboxStyle: Dictionary, color: string):
JSX.Element {
  return (
    <TextInputMask
      accessibilityLabel={locals.label}
      autoCapitalize={locals.autoCapitalize}
      autoCorrect={locals.autoCorrect}
      autoFocus={locals.autoFocus}
      blurOnSubmit={locals.blurOnSubmit}
      editable={locals.editable}
      keyboardType={locals.keyboardType}
      maxLength={locals.maxLength}
      multiline={locals.multiline}
      onBlur={locals.onBlur}
      onEndEditing={locals.onEndEditing}
      onFocus={locals.onFocus}
      onLayout={locals.onLayout}
      onSelectionChange={locals.onSelectionChange}
      onSubmitEditing={locals.onSubmitEditing}
      onContentSizeChange={locals.onContentSizeChange}
      placeholderTextColor={locals.placeholderTextColor}
      secureTextEntry={locals.secureTextEntry}
      selectTextOnFocus={locals.selectTextOnFocus}
      selectionColor={locals.selectionColor}
      numberOfLines={locals.numberOfLines}
      underlineColorAndroid={locals.underlineColorAndroid}
      clearButtonMode={locals.clearButtonMode}
      clearTextOnFocus={locals.clearTextOnFocus}
      enablesReturnKeyAutomatically={locals.enablesReturnKeyAutomatically}
      keyboardAppearance={locals.keyboardAppearance}
      onKeyPress={locals.onKeyPress}
      returnKeyType={locals.returnKeyType}
      selectionState={locals.selectionState}
      onChangeText={locals.onChange}
      onChange={locals.onChangeNative}
      placeholder={locals.placeholder}
      style={[textboxStyle, {borderColor: color}]}
      value={locals.value}
      {...locals.config}
    />
  );
}

export function maskedInputAboveLabelTemplate(locals: any): React.ReactNode {
  return labelAboveFieldTemplate(locals, (locals, textboxStyle, color) => {
    return renderMaskedInput(locals, textboxStyle, color);
  });
}

export function maskedInputFloatingLabelTemplate(locals: any): React.ReactNode {
  return labelFloatingFieldTemplate(locals, (locals, textboxStyle, color) => {
    return renderMaskedInput(locals, textboxStyle, color);
  });
}

export function maskedInputHiddenLabelTemplate(locals: any): React.ReactNode {
  return labelHiddenFieldTemplate(locals, (locals, textboxStyle, color) => {
    return renderMaskedInput(locals, textboxStyle, color);
  });
}

export function maskedInputInlineLabelTemplate(locals: any): React.ReactNode {
  return labelInlineFieldTemplate(locals, (locals, textboxStyle, color) => {
    return renderMaskedInput(locals, textboxStyle, color);
  });
}

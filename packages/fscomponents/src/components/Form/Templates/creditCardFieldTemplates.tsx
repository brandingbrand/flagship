import React from 'react';
import { CreditCardNumber } from '../../CreditCardNumber';
import {
  labelAboveFieldTemplate,
  labelFloatingFieldTemplate,
  labelHiddenFieldTemplate,
  labelInlineFieldTemplate
} from './fieldTemplates';
import { Dictionary } from '@brandingbrand/fsfoundation';

function renderCCNumber(locals: Dictionary, textboxStyle: Dictionary, color: string): JSX.Element {
  return (
    <CreditCardNumber
      accessibilityLabel={locals.label}
      autoCapitalize={locals.autoCapitalize}
      autoCorrect={locals.autoCorrect}
      autoFocus={locals.autoFocus}
      blurOnSubmit={locals.blurOnSubmit}
      cardImageStyle={locals.config.cardImageStyle}
      cardImageWidth={locals.config.cardImageWidth}
      creditCardTypeImages={locals.config.creditCardTypeImages}
      defaultCardImage={locals.config.defaultCardImage}
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
    />
  );
}


export function creditCardAboveLabelTemplate(locals: any): React.ReactNode {
  return labelAboveFieldTemplate(locals, (locals, textboxStyle, color) => {
    return renderCCNumber(locals, textboxStyle, color);
  });
}

export function creditCardFloatingLabelTemplate(locals: any): React.ReactNode {
  return labelFloatingFieldTemplate(locals, (locals, textboxStyle, color) => {
    return renderCCNumber(locals, textboxStyle, color);
  });
}


export function creditCardHiddenLabelTemplate(locals: any): React.ReactNode {
  return labelHiddenFieldTemplate(locals, (locals, textboxStyle, color) => {
    return renderCCNumber(locals, textboxStyle, color);
  });
}

export function creditCardInlineLabelTemplate(locals: any): React.ReactNode {
  return labelInlineFieldTemplate(locals, (locals, textboxStyle, color) => {
    return renderCCNumber(locals, textboxStyle, color);
  });
}


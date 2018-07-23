import React from 'react';
// @ts-ignore TODO: Update react-native-masked-text to support typing
import { memoize } from 'lodash-es';
import { TextInputMask } from 'react-native-masked-text';
import { Dictionary } from '@brandingbrand/fsfoundation';
import { CreditCardNumber } from '../../CreditCardNumber';
import { FormLabelPosition } from '../Form';
import StatefulTextbox from './StatefulTextbox';


export function labelInlineFieldTemplate(
  locals: Dictionary,
  componentFactory: (locals: Dictionary, textboxStyle: any) => JSX.Element
 ): React.ReactNode {
  return (
    <StatefulTextbox
      locals={locals}
      labelPosition={FormLabelPosition.Inline}
      componentFactory={componentFactory}
    />
  );
}


export function creditCardInlineLabelTemplate(locals: any): React.ReactNode {
  return labelInlineFieldTemplate(locals, (locals, textboxStyle) => {

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
        style={textboxStyle}
        value={locals.value}
      />
    );
  });
}

export function maskedInputInlineLabelTemplate(locals: any): React.ReactNode {
  return labelInlineFieldTemplate(locals, (locals, textboxStyle) => {
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
        style={textboxStyle}
        value={locals.value}
        {...locals.config}
      />
    );
  });
}

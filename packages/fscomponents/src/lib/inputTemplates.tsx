import React from 'react';
import { Text, View } from 'react-native';
// @ts-ignore TODO: Update react-native-masked-text to support typing
import { TextInputMask } from 'react-native-masked-text';

import { CreditCardNumber } from '../components/CreditCardNumber';

/* tslint:disable:jsx-no-lambda jsx-no-string-ref */

/*
 * Input component that follows
 * https://github.com/gcanti/tcomb-form-native/blob/master/lib/templates/bootstrap/textbox.js
 * but allows you to use a custom component instead of TextInput
 */
function customComponent(
  locals: any,
  componentFactory: (locals: any, textboxStyle: any) => JSX.Element
): React.ReactNode {
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

  const label = locals.label ? (
    <Text style={controlLabelStyle}>{locals.label}</Text>
  ) : null;
  const help = locals.help ? (
    <Text style={helpBlockStyle}>{locals.help}</Text>
  ) : null;
  const error =
    locals.hasError && locals.error ? (
      <Text style={errorBlockStyle}>
        {locals.error}
      </Text>
    ) : null;

  return (
    <View style={formGroupStyle}>
      {label}
      <View style={textboxViewStyle}>
        {componentFactory(locals, textboxStyle)}
      </View>
      {help}
      {error}
    </View>
  );
}

export function creditCardTemplate(locals: any): React.ReactNode {
  return customComponent(locals, (locals, textboxStyle) => {
    return (
      <CreditCardNumber
        accessibilityLabel={locals.label}
        ref='input'
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
        onChangeText={value => locals.onChange(value)}
        onChange={locals.onChangeNative}
        placeholder={locals.placeholder}
        style={textboxStyle}
        value={locals.value}
      />
    );
  });
}

export function maskedInputTemplate(locals: any): React.ReactNode {
  return customComponent(locals, (locals, textboxStyle) => {
    return (
      <TextInputMask
        accessibilityLabel={locals.label}
        ref='input'
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
        onChangeText={(value: string) => locals.onChange(value)}
        onChange={locals.onChangeNative}
        placeholder={locals.placeholder}
        style={textboxStyle}
        value={locals.value}
        {...locals.config}
      />
    );
  });
}

import React, { Component } from 'react';
import { Image, Text, View } from 'react-native';
// @ts-ignore TODO: Update react-native-masked-text to support typing
import { memoize } from 'lodash-es';
import { TextInputMask } from 'react-native-masked-text';
import { Dictionary } from '@brandingbrand/fsfoundation';
import { CreditCardNumber } from '../../../CreditCardNumber';
import {
  ComputeFieldType,
  defaultTextboxStyle,
  errorIcon,
  getColor,
  StatefulTextboxProps,
  StatefulTextboxState,
  successIcon
} from '../formBoilerplate';

class StatefulFieldTemplate extends Component<StatefulTextboxProps,
StatefulTextboxState> {

  state: StatefulTextboxState = {
    active: false,
    validated: false
  };

  // memoizes returned function so as not to recompute on each rerender
  private computeBlur: ComputeFieldType = memoize(prevOnBlur => () => {
    this.onBlur();

    if (typeof prevOnBlur === 'function') {
      prevOnBlur();
    }
  });

  private computeFocus: ComputeFieldType = memoize(prevOnFocus => () => {
    this.onFocus();

    if (typeof prevOnFocus === 'function') {
      prevOnFocus();
    }
  });

  constructor(props: StatefulTextboxProps) {
    super(props);
  }

  render(): JSX.Element {
    const {locals, componentFactory} = this.props;

    const prevOnBlur = locals.onBlur;
    const prevOnFocus = locals.onFocus;

    locals.onBlur = this.computeBlur(prevOnBlur);
    locals.onFocus = this.computeFocus(prevOnFocus);


    locals.placeholder = this.state.active ? null : locals.error;
    locals.placeholderTextColor = locals.stylesheet.colors.error;

    const defaultStyle = defaultTextboxStyle(locals);

    const {
      alertStyle,
      checkStyle,
      controlLabelStyle,
      help,
      inlineFormGroupStyle,
      inlineLabelViewStyle,
      rightTextboxIconStyle,
      textboxInlineStyle,
      textboxViewStyle
    } = defaultStyle;

    const getIcon = () => {
      return (this.props.locals.hasError ?
      <Image source={errorIcon} style={alertStyle}/> :
      <Image source={successIcon} style={checkStyle}/>
      );
    };

    const color = getColor(this.state, locals);

    return (
      <View>
        <View style={[inlineFormGroupStyle, {borderColor: color}]}>
          <View style={inlineLabelViewStyle}>
            <Text style={[controlLabelStyle, {color}]}>{locals.label}</Text>
          </View>
          <View style={textboxViewStyle}>
            {componentFactory(locals, textboxInlineStyle)}
            <View style={rightTextboxIconStyle}>
              {this.state.validated ? getIcon() : null}
            </View>
          </View>
        </View>
        <View>
          {help}
        </View>
      </View>
    );
  }

  private onFocus = () => {
    this.setState({
      active: true,
      validated: false
    });
  }

  private onBlur = () => {
    this.setState({
      active: false,
      validated: true
    });
  }

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

export function labelInlineFieldTemplate(
  locals: Dictionary,
  componentFactory: (locals: Dictionary, textboxStyle: any) => JSX.Element
 ): React.ReactNode {
  return (
    <StatefulFieldTemplate
      locals={locals}
      componentFactory={componentFactory}
    />
  );
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

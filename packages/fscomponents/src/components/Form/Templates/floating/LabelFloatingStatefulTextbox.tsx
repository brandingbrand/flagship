import React, { Component, RefObject } from 'react';
import { Image, Text, TextInput, View } from 'react-native';
import { memoize } from 'lodash-es';
import {
  ComputeFieldType,
  defaultTextboxStyle,
  errorIcon,
  getColor,
  StatefulTextboxProps,
  StatefulTextboxState,
  successIcon
} from '../formBoilerplate';

export default class StatefulInlineTextbox extends Component<StatefulTextboxProps,
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

  private input: RefObject<TextInput>;

  constructor(props: StatefulTextboxProps) {
    super(props);

    this.input = React.createRef<TextInput>();
  }

  render(): JSX.Element {
    const {locals} = this.props;

    const prevOnBlur = locals.onBlur;
    const prevOnFocus = locals.onFocus;

    locals.onBlur = this.computeBlur(prevOnBlur);
    locals.onFocus = this.computeFocus(prevOnFocus);

    const defaultStyle = defaultTextboxStyle(locals);

    const {
      alertStyle,
      checkStyle,
      controlLabelStyle,
      error,
      activeErrorField,
      floatingLabelViewStyle,
      formGroupStyle,
      help,
      rightTextboxIconStyle,
      textboxUnderlineStyle,
      textboxViewStyle
    } = defaultStyle;

    let {
      label
    } = defaultStyle;

    const getIcon = () => {
      return (this.props.locals.hasError ?
      <Image source={errorIcon} style={alertStyle}/> :
      <Image source={successIcon} style={checkStyle}/>
      );
    };

    const color = getColor(this.state, locals);

    locals.value ?
      label = (
      <Text style={[controlLabelStyle, {color}]}>{locals.placeholder}</Text>
      ) :
      label = (
      <Text style={controlLabelStyle}>&nbsp;</Text>
      );

    const prevPlaceHolderColor = locals.placeholderTextColor;
    locals.placeholderTextColor = prevPlaceHolderColor ?
      prevPlaceHolderColor : locals.stylesheet.colors.inactive;

    return (
      <View style={textboxViewStyle}>
        <View style={formGroupStyle}>
        <View style={floatingLabelViewStyle}>
          {label}
        </View>
          <View style={textboxViewStyle}>
            <TextInput
              accessibilityLabel={locals.label}
              ref={this.input}
              onChangeText={locals.onChange}
              onChange={locals.onChangeNative}
              style={[textboxUnderlineStyle, {borderColor: color}]}
              {...locals}
            />
            <View style={rightTextboxIconStyle}>
              {this.state.validated ? getIcon() : null}
            </View>
          </View>
        </View>
          {this.state.active ? activeErrorField : error}
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

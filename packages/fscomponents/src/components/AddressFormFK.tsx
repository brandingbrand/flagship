import React, { Component } from 'react';
import { StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { isFunction, merge, omit } from 'lodash-es';
import { styles } from './Form/Templates';
import { Dictionary } from '@brandingbrand/fsfoundation';

import { Formik } from 'formik';
import * as Yup from 'yup';

export interface AddressFormFKProps {
  onSubmit?: (value: any) => void;
  labelStyle?: any;
  textboxStyle?: any;
  checkboxStyle?: any;
  submitButtonStyle?: any;
  submitTextStyle?: any;
  submitText?: any;
  value?: any;
  style?: any;
  fieldsOptions?: any;

  // formik validation schema
  formConfig?: Yup.ObjectSchema<Yup.Shape<object, any>>;

  errorColor: string;
  activeColor: string;
  inactiveColor: string;
}

export interface AddressFormFKState {
  focused: string;
}

const S = StyleSheet.create({
  submitButtonStyle: {
    flex: 1,
    backgroundColor: '#EEE',
    padding: 10,
    alignItems: 'center',
    marginTop: 15
  }
});

interface Values {
  [key: string]: any;
}

export class AddressFormFK extends Component<AddressFormFKProps, AddressFormFKState> {
  static defaultProps: Partial<AddressFormFKProps> = {
    errorColor: '#d0021b',
    activeColor: '#000000',
    inactiveColor: '#cccccc'
  };

  formConfig: Yup.ObjectSchema<Yup.Shape<object, any>>;
  form: any;
  fieldsOptions: any;
  styles: Dictionary;

  constructor(props: AddressFormFKProps) {
    super(props);

    this.fieldsOptions = merge({}, {
      firstName: {
        placeholder: 'First name',
        returnKeyType: 'next',
        autoCorrect: false,
        onSubmitEditing: () => this.focusField('lastName'),
        error: 'Please enter the first name'
      },
      lastName: {
        placeholder: 'Last Name',
        returnKeyType: 'next',
        autoCorrect: false,
        onSubmitEditing: () => this.focusField('address1'),
        error: 'Please enter the last name'
      },
      address1: {
        placeholder: 'Address Line 1',
        returnKeyType: 'next',
        onSubmitEditing: () => this.focusField('address2'),
        error: 'Please enter the address'
      },
      address2: {
        placeholder: 'Address Line 2',
        returnKeyType: 'next',
        onSubmitEditing: () => this.focusField('city')
      },
      city: {
        placeholder: 'City',
        returnKeyType: 'next',
        onSubmitEditing: () => this.focusField('postalCode'),
        error: 'Please enter the city'
      },
      postalCode: {
        placeholder: 'Zip Code',
        keyboardType: 'number-pad',
        autoCorrect: false,
        returnKeyType: 'next',
        onSubmitEditing: () => this.focusField('stateCode'),
        error: 'Please enter a valid zip code'
      },
      stateCode: {
        placeholder: 'State',
        onSubmitEditing: () => this.focusField('phone'),
        error: 'Please enter the state'
      },
      phone: {
        placeholder: 'Phone',
        keyboardType: 'number-pad',
        autoCorrect: false,
        autoCapitalize: 'none',
        returnKeyType: 'next',
        onSubmitEditing: () => this.focusField('email'),
        error: 'Please enter a valid phone number'
      },
      email: {
        placeholder: 'Email',
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        keyboardType: 'email-address',
        error: 'Please enter a valid email address'
      },
      isPoBox: {
        placeholder: 'Check if this is P.O Box',
        checkbox: true
      }
    }, this.props.fieldsOptions);

    this.state = {
      focused: ''
    };

    this.styles = styles({
      activeColor: this.props.activeColor,
      errorColor: this.props.errorColor,
      inactiveColor: this.props.inactiveColor
    });

    const schema = {
      ...(this.props.formConfig || {})
    };

    this.formConfig = Yup.object().shape(schema);
  }

  handleSubmit = (values: any) => {
    const { onSubmit } = this.props;

    if (isFunction(onSubmit)) {
      onSubmit(values);
    }
  }

  focusField = (fieldName: string) => {
    // const field = this.form.getComponent(fieldName);

    // const ref = field.refs.input;
    // if (ref.focus) {
    //   ref.focus();
    // }
  }

  handleFocus = (key: string) => () => {
    this.setState({
      focused: key
    });
  }

  handleSwitch = (
    setFieldValue: (key: string, val: boolean) => void,
    key: string
  ) => (val: boolean) => {
    setFieldValue(key, val);
  }

  render(): JSX.Element {
    return (
      <View style={this.props.style}>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            address1: '',
            address2: '',
            isPoBox: false,
            city: '',
            postalCode: null,
            stateCode: '',
            phone: null,
            email: ''
          }}
          onSubmit={this.handleSubmit}
          validationSchema={this.formConfig}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            // errors,
            // touched,
            setFieldValue
          }: Values) => (
            <>
              {Object.keys(this.fieldsOptions).map((key: string) => (
                <View>
                  {!!(this.fieldsOptions[key].placeholder) && (
                    <Text
                      style={[
                        this.props.labelStyle,
                        {
                          color: (
                            this.state.focused === key ?
                            this.props.activeColor :
                            this.props.inactiveColor
                          )
                        }
                      ]}
                    >
                      {this.fieldsOptions[key].placeholder}
                    </Text>
                  )}
                  {this.fieldsOptions[key].checkbox ? (
                    <Switch
                      value={values[key]}
                      onValueChange={this.handleSwitch(setFieldValue, key)}
                    />
                  ) : (
                    <TextInput
                      {...omit(this.fieldsOptions[key], 'placeholder')}
                      onChangeText={handleChange(key)}
                      onBlur={handleBlur(key)}
                      onFocus={this.handleFocus(key)}
                      value={values[key]}
                      style={[
                        this.styles.textboxUnderline.normal,
                        this.props.textboxStyle,
                        {
                          borderBottomColor: (
                            this.state.focused === key ?
                            this.styles.textboxUnderline.normal.borderBottomColor :
                            this.props.inactiveColor
                          ),
                          color: (
                            this.state.focused === key ?
                            this.styles.textboxUnderline.normal.color :
                            this.props.inactiveColor
                          )
                        }
                      ]}
                      underlineColorAndroid='transparent'
                    />
                  )}
                </View>
              ))}

              <TouchableOpacity
                style={[S.submitButtonStyle, this.props.submitButtonStyle]}
                onPress={handleSubmit}
              >
                <Text style={this.props.submitTextStyle}>
                  {this.props.submitText || 'Submit'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    );
  }
}

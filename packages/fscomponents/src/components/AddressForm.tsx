import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// @ts-ignore TODO: Update tcomb-form-native to support typing
import * as t from 'tcomb-form-native';
import { cloneDeep, merge, pickBy } from 'lodash-es';
import { emailRegex } from '../lib/email';
import { Form, FormLabelPosition } from './Form';

export interface AddressFormProps {
  fieldsStyleConfig?: any;
  labelPosition?: FormLabelPosition;
  onSubmit?: (value: any) => void;
  submitButtonStyle?: any;
  submitTextStyle?: any;
  submitText?: any;
  value?: any;
  style?: any;
  checkboxStyleConfig?: any;
  fieldsOptions?: any;
  fieldsTypes?: any;
}

const EmailType = t.refinement(t.String, (str: string) => {
  return emailRegex.test((str || '').trim());
});

const S = StyleSheet.create({
  submitButtonStyle: {
    flex: 1,
    backgroundColor: '#EEE',
    padding: 10,
    alignItems: 'center'
  }
});

export class AddressForm extends Component<AddressFormProps> {
  form: any;
  fieldsStyleConfig: any;
  fieldsTypes: any;
  fieldsOptions: any;
  labelPosition: FormLabelPosition;

  constructor(props: AddressFormProps) {
    super(props);

    this.fieldsStyleConfig = {
      textbox: {
        normal: {
          borderRadius: 0,
          fontSize: 14
        },
        error: {
          borderRadius: 0,
          fontSize: 14
        }
      },
      ...props.fieldsStyleConfig
    };

    this.fieldsTypes = t.struct(
      pickBy(
        {
          firstName: t.String,
          lastName: t.String,
          address1: t.String,
          address2: t.maybe(t.String),
          isPoBox: t.Boolean,
          city: t.String,
          postalCode: t.Number,
          stateCode: t.String,
          phone: t.Number,
          email: EmailType,
          ...props.fieldsTypes
        },
        v => !!v
      )
    );

    let checkboxStyleConfig: any = null;
    if (props.checkboxStyleConfig) {
      checkboxStyleConfig = props.checkboxStyleConfig;
    } else {
      checkboxStyleConfig = cloneDeep(t.form.Form.stylesheet);
      checkboxStyleConfig.formGroup.normal.flexDirection = 'row-reverse';
      checkboxStyleConfig.formGroup.normal.alignItems = 'center';
      checkboxStyleConfig.controlLabel.normal.flex = 1;
      checkboxStyleConfig.controlLabel.normal.marginLeft = 10;
      checkboxStyleConfig.controlLabel.normal.fontSize = 14;
    }

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
        label: 'Check if this is P.O Box',
        stylesheet: checkboxStyleConfig
      }
    }, this.props.fieldsOptions);

    // check for number because FormLabelPosition enum can evaluate to 0 & thus as 'false';
    this.labelPosition = (typeof props.labelPosition === 'number') ?
      props.labelPosition : FormLabelPosition.Inline;
  }

  handleSubmit = () => {
    const { onSubmit } = this.props;
    const value = this.form.getValue();
    if (onSubmit && value) {
      onSubmit(value);
    }
  }

  focusField = (fieldName: string) => {
    const field = this.form.getComponent(fieldName);

    const ref = field.refs.input;
    if (ref.focus) {
      ref.focus();
    }
  }

  render(): JSX.Element {
    return (
      <View style={this.props.style}>
        <Form
          ref={ref => (this.form = ref)}
          fieldsTypes={this.fieldsTypes}
          fieldsOptions={this.fieldsOptions}
          fieldsStyleConfig={this.fieldsStyleConfig}
          labelPosition={this.labelPosition}
          value={this.props.value}
        />
        <TouchableOpacity
          style={[S.submitButtonStyle, this.props.submitButtonStyle]}
          onPress={this.handleSubmit}
        >
          <Text style={this.props.submitTextStyle}>
            {this.props.submitText || 'Submit'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

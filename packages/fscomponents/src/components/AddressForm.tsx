import React from 'react';
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


export const AddressForm = (props: AddressFormProps): JSX.Element => {
  let form: any;

  const fieldsStyleConfig = {
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

  const fieldsTypes = t.struct(
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

  const focusField = (fieldName: string) => {
    const field = form.getComponent(fieldName);

    const ref = field.refs.input;
    if (ref.focus) {
      ref.focus();
    }
  };

  const fieldsOptions = merge({}, {
    firstName: {
      placeholder: 'First name',
      returnKeyType: 'next',
      autoCorrect: false,
      onSubmitEditing: () => focusField('lastName'),
      error: 'Please enter the first name'
    },
    lastName: {
      placeholder: 'Last Name',
      returnKeyType: 'next',
      autoCorrect: false,
      onSubmitEditing: () => focusField('address1'),
      error: 'Please enter the last name'
    },
    address1: {
      placeholder: 'Address Line 1',
      returnKeyType: 'next',
      onSubmitEditing: () => focusField('address2'),
      error: 'Please enter the address'
    },
    address2: {
      placeholder: 'Address Line 2',
      returnKeyType: 'next',
      onSubmitEditing: () => focusField('city')
    },
    city: {
      placeholder: 'City',
      returnKeyType: 'next',
      onSubmitEditing: () => focusField('postalCode'),
      error: 'Please enter the city'
    },
    postalCode: {
      placeholder: 'Zip Code',
      keyboardType: 'number-pad',
      autoCorrect: false,
      returnKeyType: 'next',
      onSubmitEditing: () => focusField('stateCode'),
      error: 'Please enter a valid zip code'
    },
    stateCode: {
      placeholder: 'State',
      onSubmitEditing: () => focusField('phone'),
      error: 'Please enter the state'
    },
    phone: {
      placeholder: 'Phone',
      keyboardType: 'number-pad',
      autoCorrect: false,
      autoCapitalize: 'none',
      returnKeyType: 'next',
      onSubmitEditing: () => focusField('email'),
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
  }, props.fieldsOptions);

  // check for number because FormLabelPosition enum can evaluate to 0 & thus as 'false';
  const labelPosition = (typeof props.labelPosition === 'number') ?
  props.labelPosition : FormLabelPosition.Inline;


  const handleSubmit = () => {
    const { onSubmit } = props;
    const value = form.getValue();
    if (onSubmit && value) {
      onSubmit(value);
    }
  };

  return (
    <View style={props.style}>
      <Form
        ref={ref => (form = ref)}
        fieldsTypes={fieldsTypes}
        fieldsOptions={fieldsOptions}
        fieldsStyleConfig={fieldsStyleConfig}
        labelPosition={labelPosition}
        value={props.value}
      />
      <TouchableOpacity
        style={[S.submitButtonStyle, props.submitButtonStyle]}
        onPress={handleSubmit}
      >
        <Text style={props.submitTextStyle}>
          {props.submitText || 'Submit'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

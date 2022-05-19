import type { FunctionComponent } from 'react';
import React, { useEffect } from 'react';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

import { cloneDeep, merge, pickBy } from 'lodash-es';

import { emailRegex } from '../lib/email';

import { Form, FormLabelPosition } from './Form';

// Using import with tcomb-form-native seems to cause issues with the object being undefined.
const t = require('@brandingbrand/tcomb-form-native');

const componentTranslationKeys = translationKeys.flagship.addressForm;

export interface AddressFormProps {
  fieldsStyleConfig?: Record<string, unknown>;
  labelPosition?: FormLabelPosition;
  onSubmit?: (value: Record<string, unknown>) => void;
  submitButtonStyle?: StyleProp<ViewStyle>;
  submitTextStyle?: StyleProp<TextStyle>;
  submitText?: string;
  value?: Record<string, unknown>;
  style?: StyleProp<ViewStyle>;
  checkboxStyleConfig?: Record<string, unknown>;
  fieldsOptions?: Record<string, unknown>;
  fieldsTypes?: Record<string, unknown>;
}

const EmailType = t.refinement(t.String, (str: string) => emailRegex.test((str || '').trim()));

const S = StyleSheet.create({
  submitButtonStyle: {
    alignItems: 'center',
    backgroundColor: '#EEE',
    flex: 1,
    padding: 10,
  },
});

// eslint-disable-next-line max-lines-per-function
export const AddressForm: FunctionComponent<AddressFormProps> = (props): JSX.Element => {
  let form: Form | null;

  useEffect(() => {
    console.warn('AddressForm is deprecated and will be removed in the next version of Flagship.');
  }, []);

  const fieldsStyleConfig = {
    textbox: {
      normal: {
        borderRadius: 0,
        fontSize: 14,
      },
      error: {
        borderRadius: 0,
        fontSize: 14,
      },
    },
    ...props.fieldsStyleConfig,
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
        ...props.fieldsTypes,
      },
      Boolean
    )
  );

  let checkboxStyleConfig: Record<string, any>;
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
    const field = form !== null ? form.getComponent(fieldName) : null;

    const ref = field.refs.input;
    if (ref.focus) {
      ref.focus();
    }
  };

  const fieldsOptions = merge(
    {},
    {
      firstName: {
        placeholder: FSI18n.string(componentTranslationKeys.firstName),
        returnKeyType: 'next',
        autoCorrect: false,
        onSubmitEditing: () => {
          focusField('lastName');
        },
        error: FSI18n.string(componentTranslationKeys.firstNameError),
      },
      lastName: {
        placeholder: FSI18n.string(componentTranslationKeys.lastName),
        returnKeyType: 'next',
        autoCorrect: false,
        onSubmitEditing: () => {
          focusField('address1');
        },
        error: FSI18n.string(componentTranslationKeys.lastNameError),
      },
      address1: {
        placeholder: FSI18n.string(componentTranslationKeys.address1),
        returnKeyType: 'next',
        onSubmitEditing: () => {
          focusField('address2');
        },
        error: FSI18n.string(componentTranslationKeys.address1Error),
      },
      address2: {
        placeholder: FSI18n.string(componentTranslationKeys.address2),
        returnKeyType: 'next',
        onSubmitEditing: () => {
          focusField('city');
        },
      },
      city: {
        placeholder: FSI18n.string(componentTranslationKeys.city),
        returnKeyType: 'next',
        onSubmitEditing: () => {
          focusField('postalCode');
        },
        error: FSI18n.string(componentTranslationKeys.cityError),
      },
      postalCode: {
        placeholder: FSI18n.string(componentTranslationKeys.postal),
        keyboardType: 'number-pad',
        autoCorrect: false,
        returnKeyType: 'next',
        onSubmitEditing: () => {
          focusField('stateCode');
        },
        error: FSI18n.string(componentTranslationKeys.postalError),
      },
      stateCode: {
        placeholder: FSI18n.string(componentTranslationKeys.state),
        onSubmitEditing: () => {
          focusField('phone');
        },
        error: FSI18n.string(componentTranslationKeys.stateError),
      },
      phone: {
        placeholder: FSI18n.string(componentTranslationKeys.phone),
        keyboardType: 'number-pad',
        autoCorrect: false,
        autoCapitalize: 'none',
        returnKeyType: 'next',
        onSubmitEditing: () => {
          focusField('email');
        },
        error: FSI18n.string(componentTranslationKeys.phoneError),
      },
      email: {
        placeholder: FSI18n.string(componentTranslationKeys.email),
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        keyboardType: 'email-address',
        error: FSI18n.string(componentTranslationKeys.emailError),
      },
      isPoBox: {
        label: FSI18n.string(componentTranslationKeys.poBox),
        stylesheet: checkboxStyleConfig,
      },
    },
    props.fieldsOptions
  );

  // check for number because FormLabelPosition enum can evaluate to 0 & thus as 'false';
  const labelPosition =
    typeof props.labelPosition === 'number' ? props.labelPosition : FormLabelPosition.Inline;

  const handleSubmit = () => {
    const { onSubmit } = props;
    const value = form !== null && form.getValue();
    if (onSubmit && value) {
      onSubmit(value);
    }
  };

  return (
    <View style={props.style}>
      <Form
        fieldsOptions={fieldsOptions}
        fieldsStyleConfig={fieldsStyleConfig}
        fieldsTypes={fieldsTypes}
        labelPosition={labelPosition}
        ref={(ref) => (form = ref)}
        value={props.value}
      />
      <TouchableOpacity
        onPress={handleSubmit}
        style={[S.submitButtonStyle, props.submitButtonStyle]}
      >
        <Text style={props.submitTextStyle}>
          {props.submitText || FSI18n.string(componentTranslationKeys.submit)}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

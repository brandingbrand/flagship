import React, { FunctionComponent, useEffect } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';

// Using import with tcomb-form-native seems to cause issues with the object being undefined.
const t = require('@brandingbrand/tcomb-form-native');

import { cloneDeep, merge, pickBy } from 'lodash-es';
import { emailRegex } from '../lib/email';
import { Form, FormLabelPosition } from './Form';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
import { Dictionary } from '@brandingbrand/fsfoundation';
const componentTranslationKeys = translationKeys.flagship.addressForm;

export interface AddressFormProps {
  fieldsStyleConfig?: Dictionary;
  labelPosition?: FormLabelPosition;
  onSubmit?: (value: Dictionary) => void;
  submitButtonStyle?: StyleProp<ViewStyle>;
  submitTextStyle?: StyleProp<TextStyle>;
  submitText?: string;
  value?: Dictionary;
  style?: StyleProp<ViewStyle>;
  checkboxStyleConfig?: Dictionary;
  fieldsOptions?: Dictionary;
  fieldsTypes?: Dictionary;
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


export const AddressForm: FunctionComponent<AddressFormProps> = (props): JSX.Element => {
  let form: Form | null;

  useEffect(() => {
    console.warn('AddressForm is deprecated and will be removed in the next version of Flagship.');
  }, []);

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

  let checkboxStyleConfig: Dictionary;
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

  const fieldsOptions = merge({}, {
    firstName: {
      placeholder: FSI18n.string(componentTranslationKeys.firstName),
      returnKeyType: 'next',
      autoCorrect: false,
      onSubmitEditing: () => focusField('lastName'),
      error: FSI18n.string(componentTranslationKeys.firstNameError)
    },
    lastName: {
      placeholder: FSI18n.string(componentTranslationKeys.lastName),
      returnKeyType: 'next',
      autoCorrect: false,
      onSubmitEditing: () => focusField('address1'),
      error: FSI18n.string(componentTranslationKeys.lastNameError)
    },
    address1: {
      placeholder: FSI18n.string(componentTranslationKeys.address1),
      returnKeyType: 'next',
      onSubmitEditing: () => focusField('address2'),
      error: FSI18n.string(componentTranslationKeys.address1Error)
    },
    address2: {
      placeholder: FSI18n.string(componentTranslationKeys.address2),
      returnKeyType: 'next',
      onSubmitEditing: () => focusField('city')
    },
    city: {
      placeholder: FSI18n.string(componentTranslationKeys.city),
      returnKeyType: 'next',
      onSubmitEditing: () => focusField('postalCode'),
      error: FSI18n.string(componentTranslationKeys.cityError)
    },
    postalCode: {
      placeholder: FSI18n.string(componentTranslationKeys.postal),
      keyboardType: 'number-pad',
      autoCorrect: false,
      returnKeyType: 'next',
      onSubmitEditing: () => focusField('stateCode'),
      error: FSI18n.string(componentTranslationKeys.postalError)
    },
    stateCode: {
      placeholder: FSI18n.string(componentTranslationKeys.state),
      onSubmitEditing: () => focusField('phone'),
      error: FSI18n.string(componentTranslationKeys.stateError)
    },
    phone: {
      placeholder: FSI18n.string(componentTranslationKeys.phone),
      keyboardType: 'number-pad',
      autoCorrect: false,
      autoCapitalize: 'none',
      returnKeyType: 'next',
      onSubmitEditing: () => focusField('email'),
      error: FSI18n.string(componentTranslationKeys.phoneError)
    },
    email: {
      placeholder: FSI18n.string(componentTranslationKeys.email),
      returnKeyType: 'next',
      autoCorrect: false,
      autoCapitalize: 'none',
      keyboardType: 'email-address',
      error: FSI18n.string(componentTranslationKeys.emailError)
    },
    isPoBox: {
      label: FSI18n.string(componentTranslationKeys.poBox),
      stylesheet: checkboxStyleConfig
    }
  }, props.fieldsOptions);

  // check for number because FormLabelPosition enum can evaluate to 0 & thus as 'false';
  const labelPosition = (typeof props.labelPosition === 'number') ?
  props.labelPosition : FormLabelPosition.Inline;


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
          {props.submitText || FSI18n.string(componentTranslationKeys.submit)}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

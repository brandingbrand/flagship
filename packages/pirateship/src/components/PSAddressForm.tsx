import React, { Component } from 'react';
import {
  Alert,
  Image,
  InteractionManager,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { border, color, fontSize, padding, palette } from '../styles/variables';
import formFieldStyles from '../styles/FormField';
import { select, textbox } from '../lib/formTemplate';
// @ts-ignore TODO: Add types for tcomb-form-native
import * as t from 'tcomb-form-native';
import { Form } from '@brandingbrand/fscomponents';
import { merge } from 'lodash-es';
import { EMAIL_REGEX } from '../lib/constants';
import translate, { translationKeys } from '../lib/translations';

const kDeliveryType = 'Delivery Type';

const countries = require('../../assets/countries.json');
const states = require('../../assets/states.json');
const deliveryTypes = {
  R: 'Residential',
  C: 'Business'
};
const POCities = {
  APO: 'APO',
  FPO: 'FPO'
};
const POStateCode = ['AA', 'AE', 'AP'];

const styles = StyleSheet.create({
  apoHelpBlockContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: padding.base,
    alignItems: 'baseline',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    borderBottomColor: border.color,
    borderBottomWidth: border.width
  },
  apoLink: {
    color: palette.secondary,
    fontWeight: 'bold',
    fontSize: fontSize.base,
    flexShrink: 1
  },
  apoLinkIcon: {
    marginLeft: padding.narrow
  }
});

const EmailType = t.refinement(t.String, (str: string) =>
  EMAIL_REGEX.test((str || '').trim())
);

EmailType.getValidationErrorMessage = (value: string) => {
  if (!value) {
    return `Email is required`;
  } else {
    return `Please enter a valid email address`;
  }
};

export interface PSAddressFormProps {
  style?: StyleProp<ViewStyle>;
  onChange?: (value: any) => void;
  hiddenFields?: (keyof AddressFormFields)[];
  optionalFields?: (keyof AddressFormFields)[];
  updateFormRef?: (ref: any) => void;
  values: AddressFormValues;
}

export interface AddressFormValues {
  addressName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  addressField1?: string;
  countryCode?: string;
  address1?: string;
  address2?: string;
  city?: string;
  stateCode?: string;
  postalCode?: string;
  receiveEmail?: boolean;
}

export interface AddressFormFields {
  addressName: any;
  firstName: any;
  lastName: any;
  phone: any;
  email: any;
  addressField1: any;
  countryCode: any;
  address1: any;
  address2: any;
  city: any;
  stateCode: any;
  postalCode: any;
  receiveEmail: any;
}

export interface PSAddressFormState {
  types: any;
}

export default class PSAddressForm extends Component<
  PSAddressFormProps,
  PSAddressFormState
> {
  formRef: any;
  fields: any;
  fieldOptions: any;
  hiddenFields: Set<keyof AddressFormFields>;
  optionalFields: Set<keyof AddressFormFields>;

  constructor(props: PSAddressFormProps) {
    super(props);

    this.hiddenFields = new Set(props.hiddenFields);
    this.optionalFields = new Set(props.optionalFields);
    this.state = {
      types: this.getFormFields(props.values)
    };
    this.fieldOptions = this.getFormFieldOptions();
  }

  componentWillReceiveProps(nextProps: PSAddressFormProps): void {
    const values = this.props.values || {} as any;
    const newValues = nextProps.values || {} as any;
    const countryCode = (values && values.countryCode) || 'US';

    const wasPOState = values.stateCode && POStateCode.indexOf(values.stateCode) > -1;
    const isPOState = newValues.stateCode && POStateCode.indexOf(newValues.stateCode) > -1;

    if (newValues.countryCode !== countryCode || wasPOState !== isPOState) {
      this.setState({
        types: this.getFormFields(newValues)
      });
    }
  }

  getFormFields = (formValues: AddressFormValues) => {
    const selectedCountry = (formValues && formValues.countryCode) || 'US';
    const selectedState = states[selectedCountry];
    const isPOState = formValues.stateCode && POStateCode.indexOf(formValues.stateCode) > -1;

    const fields: AddressFormFields = {
      addressName: t.String,
      firstName: t.String,
      lastName: t.String,
      phone: t.String,
      email: EmailType,
      addressField1: t.maybe(t.enums(deliveryTypes)),
      countryCode: t.enums(countries),
      address1: t.String,
      address2: t.maybe(t.String),
      city: isPOState ? t.enums(POCities) : t.String,
      stateCode: selectedState ? t.enums(selectedState) : t.String,
      postalCode: t.String,
      receiveEmail: t.Boolean
    };

    this.hiddenFields.forEach(key => {
      delete fields[key];
    });

    this.optionalFields.forEach(key => {
      fields[key] = t.maybe(fields[key]);
    });

    return t.struct(fields);
  }

  getFormFieldOptions = () => {
    const options = {
      addressName: {
        hidden: this.hiddenFields.has('addressName'),
        label: translate.string(translationKeys.address.form.addressName.label),
        error: translate.string(translationKeys.address.form.addressName.error),
        placeholder: translate.string(translationKeys.formPlaceholders.required),
        placeholderTextColor: color.gray,
        returnKeyType: 'next',
        autoCorrect: false,
        onSubmitEditing: () => this.focusField('firstName')
      },
      firstName: {
        hidden: this.hiddenFields.has('firstName'),
        label: translate.string(translationKeys.address.form.firstName.label),
        error: translate.string(translationKeys.address.form.firstName.error),
        placeholder: translate.string(translationKeys.formPlaceholders.required),
        placeholderTextColor: color.gray,
        returnKeyType: 'next',
        autoCorrect: false,
        onSubmitEditing: () => this.focusField('lastName')
      },
      lastName: {
        hidden: this.hiddenFields.has('lastName'),
        label: translate.string(translationKeys.address.form.lastName.label),
        error: translate.string(translationKeys.address.form.lastName.error),
        placeholder: translate.string(translationKeys.formPlaceholders.required),
        placeholderTextColor: color.gray,
        returnKeyType: 'next',
        autoCorrect: false,
        onSubmitEditing: () => this.focusField('phone')
      },
      phone: {
        hidden: this.hiddenFields.has('phone'),
        label: translate.string(translationKeys.address.form.phone.label),
        error: translate.string(translationKeys.address.form.phone.error),
        placeholder: translate.string(translationKeys.formPlaceholders.required),
        placeholderTextColor: color.gray,
        keyboardType: 'phone-pad',
        returnKeyType: 'next',
        onSubmitEditing: () => this.focusField('email')
      },
      email: {
        hidden: this.hiddenFields.has('email'),
        label: translate.string(translationKeys.address.form.email.label),
        placeholder: translate.string(translationKeys.formPlaceholders.required),
        placeholderTextColor: color.gray,
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        keyboardType: 'email-address',
        onSubmitEditing: () => this.focusField('addressField1')
      },
      addressField1: {
        hidden: this.hiddenFields.has('addressField1'),
        label: kDeliveryType,
        error: 'Delivery Type is required',
        config: {
          title: kDeliveryType,
          placeholder: kDeliveryType
        },
        nullOption: false
      },
      countryCode: {
        hidden: this.hiddenFields.has('countryCode'),
        label: translate.string(translationKeys.address.form.countryCode.label),
        error: translate.string(translationKeys.address.form.countryCode.error),
        config: {
          title: translate.string(translationKeys.address.form.countryCode.title),
          placeholder: translate.string(translationKeys.address.form.countryCode.placeholder),
          onValueChange: () => {
            InteractionManager.runAfterInteractions(() => {
              this.focusField('address1');
            });
          }
        },
        nullOption: false
      },
      address1: {
        hidden: this.hiddenFields.has('address1'),
        label: translate.string(translationKeys.address.form.address1.label),
        error: translate.string(translationKeys.address.form.address1.error),
        placeholder: translate.string(translationKeys.formPlaceholders.required),
        placeholderTextColor: color.gray,
        returnKeyType: 'next',
        onSubmitEditing: () => this.focusField('address2')
      },
      address2: {
        hidden: this.hiddenFields.has('address2'),
        label: translate.string(translationKeys.address.form.address2.label),
        placeholder: translate.string(translationKeys.address.form.address2.placeholder),
        placeholderTextColor: color.gray,
        returnKeyType: 'next',
        onSubmitEditing: () => this.focusField('city')
      },
      city: {
        hidden: this.hiddenFields.has('city'),
        label: translate.string(translationKeys.address.form.city.label),
        error: translate.string(translationKeys.address.form.city.error),
        placeholder: translate.string(translationKeys.formPlaceholders.required),
        placeholderTextColor: color.gray,
        returnKeyType: 'next',
        onSubmitEditing: () => this.focusField('stateCode'),
        nullOption: false
      },
      stateCode: {
        hidden: this.hiddenFields.has('stateCode'),
        label: translate.string(translationKeys.address.form.stateCode.label),
        error: translate.string(translationKeys.address.form.stateCode.error),
        placeholder: translate.string(translationKeys.formPlaceholders.required),
        help: (
          <TouchableOpacity
            style={styles.apoHelpBlockContainer}
            onPress={this.displayApoInfo}
          >
            {/* tslint:disable-next-line:jsx-use-translation-function - Not a translatable word */}
            <Text style={styles.apoLink}>APO/FPO</Text>
            <Image
              source={require('../../assets/images/question.png')}
              style={styles.apoLinkIcon}
            />
          </TouchableOpacity>
        ),
        config: {
          title: translate.string(translationKeys.address.form.stateCode.title),
          placeholder: translate.string(translationKeys.address.form.stateCode.placeholder),
          onValueChange: () => {
            InteractionManager.runAfterInteractions(() => {
              this.focusField('postalCode');
            });
          }
        },
        nullOption: false
      },
      postalCode: {
        hidden: this.hiddenFields.has('postalCode'),
        label: translate.string(translationKeys.address.form.postalCode.label),
        error: translate.string(translationKeys.address.form.postalCode.error),
        placeholder: translate.string(translationKeys.formPlaceholders.required),
        placeholderTextColor: color.gray,
        keyboardType: 'numbers-and-punctuation',
        returnKeyType: 'next'
      },
      receiveEmail: {
        hidden: this.hiddenFields.has('receiveEmail'),
        label: 'Send me emails about store specials',
        onTintColor: palette.secondary,
        // Android changes the color of the thumb switch when toggled on to be a conflicting green
        thumbTintColor:
          Platform.OS === 'android' ? palette.surface : undefined,
        stylesheet: merge({}, t.form.Form.stylesheet, formFieldStyles, {
          formGroup: {
            normal: {
              backgroundColor: palette.surface,
              padding: padding.base,
              paddingLeft: 0,
              borderBottomWidth: 0
            }
          },
          controlLabel: {
            normal: {
              width: 'auto',
              fontWeight: 'normal'
            },
            error: {
              width: 'auto',
              fontWeight: 'normal'
            }
          }
        })
      }
    } as any;

    this.optionalFields.forEach(fieldName => {
      const optionalString = translate.string(translationKeys.formPlaceholders.optional);
      options[fieldName].placeholder = optionalString;
      options[fieldName].returnKeyType = 'done';
      options[fieldName].onSubmitEditing = undefined;
      if (options[fieldName].config) {
        options[fieldName].config.onValueChange = undefined;

        if (options[fieldName].config.title) {
          options[fieldName].config.title += ` (${optionalString})`;
        }
        if (options[fieldName].config.placeholder) {
          options[fieldName].config.placeholder += ` (${optionalString})`;
        }
      }
    });

    return options;
  }

  focusField = (fieldName: string) => {
    const field = this.formRef.getComponent(fieldName);
    if (!field) {
      return console.warn(`field ${fieldName} doesn't exist`);
    }

    const inputRef = field.refs.input;
    if (inputRef.focus) {
      inputRef.focus();
    } else if (inputRef.openModal) {
      inputRef.openModal();
    } else {
      console.warn(`field ${fieldName} cannot be focused`);
    }
  }

  updateFormRef = (ref: any) => {
    this.formRef = ref;

    const { updateFormRef } = this.props;
    if (updateFormRef) {
      updateFormRef(ref);
    }
  }

  displayApoInfo = () => {
    Alert.alert(
      'APO/FPO',
      'Please select United States as the country' +
        ' and then either Armed Forces Americas, Armed Forces Europe, or ' +
        'Armed Forces Pacific from the state selections.'
    );
  }

  render(): JSX.Element {
    const { types } = this.state;
    const values = {
      countryCode: 'US',
      ...this.props.values
    };

    return (
      <View style={this.props.style}>
        <Form
          ref={this.updateFormRef}
          fieldsTypes={types}
          fieldsOptions={this.fieldOptions}
          fieldsStyleConfig={formFieldStyles}
          value={values}
          onChange={this.onChange}
          templates={{ textbox, select }}
        />
      </View>
    );
  }

  onChange = (newValues: AddressFormValues) => {
    const { values = {}, onChange } = this.props;
    const countryCode = (values && values.countryCode) || 'US';

    const wasPOState = values.stateCode && POStateCode.indexOf(values.stateCode) > -1;
    const isPOState = newValues.stateCode && POStateCode.indexOf(newValues.stateCode) > -1;

    if (newValues.countryCode !== countryCode || wasPOState !== isPOState) {
      this.setState({
        types: this.getFormFields(newValues)
      });
    }

    // auto select first po city if po state is selected, reset if not
    if (wasPOState !== isPOState) {
      if (isPOState) {
        newValues.city = POCities.APO;
      } else {
        newValues.city = '';
      }
    }

    if (onChange) {
      onChange(newValues);
    }
  }
}

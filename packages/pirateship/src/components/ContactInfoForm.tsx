import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from 'react-native';
import React, { Component } from 'react';
// @ts-ignore TODO: Add types for tcomb-form-native
import * as t from 'tcomb-form-native';
import { Form } from '@brandingbrand/fscomponents';
import { EMAIL_REGEX } from '../lib/constants';
import { select, textbox } from '../lib/formTemplate';
import { border, color, padding, palette } from '../styles/variables';
import formFieldStyles from '../styles/FormField';
import { merge } from 'lodash-es';
import translate, {translationKeys} from '../lib/translations';

const styles = StyleSheet.create({
  helpBlockContainer: {
    borderBottomColor: border.color,
    borderBottomWidth: border.width
  }
});

export interface ContactInfoFormProps {
  values: ContactFormValues;
  onChange: (values: any) => void;
  updateFormRef: (ref: any) => void;
  style?: StyleProp<ViewStyle>;
  hiddenFields?: (keyof FormFields)[];
  optionalFields?: (keyof FormFields)[];
}

export interface ContactInfoFormState {
  hidePassword: boolean;
  hidePasswordConfirmation: boolean;
  errors?: string[];
}

export interface ContactFormValues {
  firstName?: string;
  lastName?: string;
  email?: string;
  emailConfirmation?: string;
  password?: string;
  passwordConfirmation?: string;
  age?: string;
  gender?: string;
  specials?: boolean;
}

export interface FormFields {
  firstName: any;
  lastName: any;
  email: any;
  emailConfirmation: any;
  password: any;
  passwordConfirmation: any;
  age: any;
  gender: any;
  specials: any;
}

export default class ContactInfoForm extends Component<
  ContactInfoFormProps,
  ContactInfoFormState
> {
  hiddenFields: Set<keyof FormFields>;
  optionalFields: Set<keyof FormFields>;
  fieldOptions: any;
  fields: any;
  form: any;

  constructor(props: ContactInfoFormProps) {
    super(props);

    this.state = {
      hidePassword: true,
      hidePasswordConfirmation: true
    };

    this.hiddenFields = new Set(props.hiddenFields);
    this.optionalFields = new Set(props.optionalFields);
    this.fields = this.getFormFields();
    this.fieldOptions = this.getFormFieldOptions();
  }

  getFormFields = () => {
    const EmailType = t.refinement(t.String, (value: string) => {
      const { email, emailConfirmation } = this.props.values;
      const isEmailFormat = EMAIL_REGEX.test((value || '').trim());
      const isSameEmail = email === emailConfirmation;

      return isEmailFormat && isSameEmail;
    });
    EmailType.getValidationErrorMessage = (value: string) => {
      const { email, emailConfirmation } = this.props.values;

      if (!value) {
        return translate.string(translationKeys.contactInfo.errors.email.missing);
      } else if (value !== email || value !== emailConfirmation) {
        return translate.string(translationKeys.contactInfo.errors.email.mismatch);
      } else {
        return translate.string(translationKeys.contactInfo.errors.email.invalid);
      }
    };

    const PasswordType = t.refinement(t.String, (value: string) => {
      const { password, passwordConfirmation } = this.props.values;

      const isLongEnough = value.length >= 6;
      const passwordsMatch = password === passwordConfirmation;

      return isLongEnough && passwordsMatch;
    });

    PasswordType.getValidationErrorMessage = (value: string) => {
      const { password, passwordConfirmation } = this.props.values;

      if (!value) {
        return translate.string(translationKeys.contactInfo.errors.password.invalid);
      } else if (value.length < 6) {
        return translate.string(translationKeys.contactInfo.errors.password.tooShort, {
          minCharacters: 6
        });
      } else if (value !== password || value !== passwordConfirmation) {
        return translate.string(translationKeys.contactInfo.errors.password.mismatch);
      }
      return true;
    };

    const ageRanges = {
      1: '10-19',
      2: '20-29',
      3: '30-39',
      4: '40-49',
      5: '50-59',
      6: '60+'
    };

    const genders = {
      M: 'Male',
      F: 'Female'
    };

    const fields = {
      firstName: t.String,
      lastName: t.String,
      email: EmailType,
      emailConfirmation: EmailType,
      password: PasswordType,
      passwordConfirmation: PasswordType,
      age: t.enums(ageRanges),
      gender: t.enums(genders),
      specials: t.Boolean
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
      firstName: {
        label: translate.string(translationKeys.contactInfo.form.firstName.label),
        error: translate.string(translationKeys.contactInfo.form.firstName.error),
        placeholder: translate.string(translationKeys.formPlaceholders.required),
        placeholderTextColor: color.gray,
        returnKeyType: 'next',
        autoCorrect: false,
        onSubmitEditing: () => this.focusField('lastName')
      },
      lastName: {
        label: translate.string(translationKeys.contactInfo.form.lastName.label),
        error: translate.string(translationKeys.contactInfo.form.firstName.error),
        placeholder: translate.string(translationKeys.formPlaceholders.required),
        placeholderTextColor: color.gray,
        returnKeyType: 'next',
        autoCorrect: false,
        onSubmitEditing: () => this.focusField('email')
      },
      email: {
        label: translate.string(translationKeys.contactInfo.form.email.label),
        help: (
          <View style={styles.helpBlockContainer}>
            <Text
              style={[
                t.form.Form.stylesheet.helpBlock.normal,
                formFieldStyles.helpBlock.normal
              ]}
            >
              <Text style={{ fontWeight: 'bold' }}>
                {translate.string(translationKeys.contactInfo.notes.callout)}
              </Text>
              <Text>: {translate.string(translationKeys.contactInfo.notes.email)}</Text>
            </Text>
          </View>
        ),
        placeholder: translate.string(translationKeys.formPlaceholders.required),
        placeholderTextColor: color.gray,
        returnKeyType: 'next',
        autoCorrect: false,
        keyboardType: 'email-address',
        autoCapitalize: 'none',
        onSubmitEditing: () => this.focusField('emailConfirmation')
      },
      emailConfirmation: {
        label: translate.string(translationKeys.contactInfo.form.emailConfirmation.label),
        placeholder: translate.string(translationKeys.formPlaceholders.required),
        placeholderTextColor: color.gray,
        returnKeyType: 'next',
        autoCorrect: false,
        keyboardType: 'email-address',
        autoCapitalize: 'none',
        onSubmitEditing: () => this.focusField('password')
      },
      password: {
        label: translate.string(translationKeys.contactInfo.form.password.label),
        placeholder: translate.string(translationKeys.formPlaceholders.required),
        placeholderTextColor: color.gray,
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        secureTextEntry: this.state.hidePassword,
        password: true,
        onSubmitEditing: () => this.focusField('passwordConfirmation')
      },
      passwordConfirmation: {
        label: translate.string(translationKeys.contactInfo.form.passwordConfirmation.label),
        placeholder: translate.string(translationKeys.formPlaceholders.required),
        placeholderTextColor: color.gray,
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        secureTextEntry: this.state.hidePasswordConfirmation,
        password: true,
        onSubmitEditing: () => this.focusField('age')
      },
      age: {
        label: 'Age',
        error: 'Age is required',
        config: {
          title: 'Select Age',
          placeholder: 'Select Age'
        },
        nullOption: false
      },
      gender: {
        label: 'Gender',
        error: 'Gender is required',
        config: {
          title: 'Select Gender',
          placeholder: 'Select Gender'
        },
        nullOption: false
      },
      specials: {
        label: 'Send me emails about store specials.',
        onTintColor: palette.secondary,
        // Android changes the color of the thumb switch when toggled on to be a conflicting green
        thumbTintColor: Platform.OS === 'android' ? palette.surface : undefined,
        stylesheet: merge({}, t.form.Form.stylesheet, formFieldStyles, {
          formGroup: {
            normal: {
              paddingTop: 20,
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
      options[fieldName].placeholder = translate.string(translationKeys.formPlaceholders.optional);
      options[fieldName].returnKeyType = 'done';
      options[fieldName].onSubmitEditing = undefined;
      if (options[fieldName].config) {
        options[fieldName].config.onValueChange = undefined;

        if (options[fieldName].config.title) {
          options[fieldName].config.title +=
          ` (${translate.string(translationKeys.formPlaceholders.optional)})`;
        }
        if (options[fieldName].config.placeholder) {
          options[fieldName].config.placeholder +=
            ` (${translate.string(translationKeys.formPlaceholders.optional)})`;
        }
      }
    });

    return options;
  }

  render(): JSX.Element {
    const { values, onChange } = this.props;
    this.fieldOptions = t.update(this.fieldOptions, {
      password: {
        secureTextEntry: {
          $set: this.state.hidePassword
        }
      },
      passwordConfirmation: {
        secureTextEntry: {
          $set: this.state.hidePasswordConfirmation
        }
      }
    });

    return (
      <Form
        style={this.props.style}
        ref={this.updateFormRef}
        fieldsTypes={this.fields}
        fieldsOptions={this.fieldOptions}
        fieldsStyleConfig={formFieldStyles}
        value={values}
        onChange={onChange}
        templates={{ textbox, select }}
      />
    );
  }

  updateFormRef = (ref: any) => {
    const { updateFormRef } = this.props;
    if (updateFormRef) {
      updateFormRef(ref);
    }
    this.form = ref;
  }

  focusField = (fieldName: string) => {
    const field = this.form.getComponent(fieldName);

    const ref = field.refs.input;
    if (ref.focus) {
      ref.focus();
    } else if (ref.openModal) {
      ref.openModal();
    }
  }
}

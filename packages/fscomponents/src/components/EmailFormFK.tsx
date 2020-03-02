import React, { FunctionComponent } from 'react';

import { Formik, FormikProps } from 'formik';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { Button } from './Button';
import FSTextInput from './FSTextInput';

export interface EmailFormFKValue {
  email: string;
}

export interface EmailFormFKProps {
  onSubmit: (value: EmailFormFKValue) => void;
  validateForm?: (value: EmailFormFKValue) => void;
  submitButtonStyle?: StyleProp<ViewStyle>;
  submitTextStyle?: StyleProp<TextStyle>;
  submitText?: string;
  value?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters" | undefined;
  autoCorrect?: boolean;
  placeholder?: string;
  inputStyle?: StyleProp<ViewStyle>;
  name?: string;
  label?: string;
  renderButton?: () => React.ReactNode;
}

export const EmailFormFK: FunctionComponent<EmailFormFKProps> = React.memo((props): JSX.Element => {
  const renderButton = (formikProps: FormikProps<any>): React.ReactNode => {
    if (props.renderButton) {
      return props.renderButton();
    }
    return (
      <Button
        style={props.submitButtonStyle}
        title={props.submitText || 'Submit'}
        titleStyle={props.submitTextStyle}
        // tslint:disable-next-line: no-unbound-method
        onPress={formikProps.submitForm}
      />
    );
  };

  return (
    <View>
      <Formik
        initialValues={{email: props.value || ''}}
        onSubmit={props.onSubmit}
        validate={props.validateForm}
      >
        {formikProps => (
          <View>
            <FSTextInput
              {...formikProps}
              value={formikProps.values.email}
              name={props.name || 'email'}
              label={props.label || 'Email'}
              autoCapitalize={props.autoCapitalize || 'none'}
              autoCorrect={props.autoCorrect || false}
              autoCompleteType='email'
              keyboardType='email-address'
              textContentType='emailAddress'
            />
            {renderButton(formikProps)}
          </View>
        )}
      </Formik>
    </View>
  );
});

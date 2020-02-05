import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { Formik, FormikProps, FormikValues } from 'formik';
import { style as S } from '../styles/FormFK';
import { TextField } from './FormikFields/TextField';
import { FormLabelPosition } from './Form';


export interface SingleLineFormPropsFK {
  initialValues: FormikValues;
  onSubmit?: (value: any) => void; // the behaviour we want onpress of submit button
  submitButtonStyle?: StyleProp<ViewStyle>;
  submitTextStyle?: StyleProp<TextStyle>;
  submitText?: any; // Text to override the submit button
  style?: StyleProp<ViewStyle>;
  value: string;
  fieldStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  labelPosition?: FormLabelPosition;
  validationSchema?: any | (() => any);
  fieldsOptions?: FieldOption;
  placeholder: string;
  fieldsStyleConfig?: any;
}

const buttonStyle = StyleSheet.create({
  submitButtonStyle: {
    width: 100,
    backgroundColor: '#EEE',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 38
  }
});

export type FieldOption = {
  [key in keyof FormValues]: TextInputProps;
};

export interface FormValues {
  [x: string] : string;
}


export const SingleLineFormFK: React.FC<SingleLineFormPropsFK> = props => {

  const labelPosition = (typeof props.labelPosition === 'number') ?
    props.labelPosition : FormLabelPosition.Inline;

  const onSubmit = (values: FormValues) => {
    if (values && props.onSubmit) {
      props.onSubmit(values);
    }
  };

  const handleButton = (f: FormikProps<FormValues>) => () => {
    f.handleSubmit();
  };

  return (
    <View>
      <Formik
        initialValues={props.initialValues}
        validationSchema={props.validationSchema}
        onSubmit={onSubmit}
      >
        {(f: FormikProps<FormValues>) => (
          <View style={[S.container, props.containerStyle]}>
            <TextField
              name={props.value}
              labelStyle={props.labelStyle}
              label={props.value}
              placeholder={props.placeholder}
              style={[S.textInput, props.fieldsStyleConfig]}
              {...props.fieldsOptions && props.fieldsOptions[props.value]}
            />
            <TouchableOpacity
              style={[
                buttonStyle.submitButtonStyle,
                props.submitButtonStyle,
                labelPosition === 0 && { marginLeft: 10, marginTop: -12 }
              ]}
              onPress={handleButton(f)}
            >
              <Text style={props.submitTextStyle}>
                {props.submitText || 'Submit'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
};


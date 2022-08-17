import React from 'react';

import type { StyleProp, TextInputProps, TextStyle } from 'react-native';
import { Text, TextInput, View } from 'react-native';

import { useField, useFormikContext } from 'formik';

import { style as S } from '../../styles/FormFK';

interface FormFieldProps extends TextInputProps {
  label?: string;
  name: string;
  labelStyle?: StyleProp<TextStyle>;
  errStyle?: StyleProp<TextStyle>;
}

export const TextField: React.FC<FormFieldProps> = ({
  errStyle,
  label,
  labelStyle,
  name,
  ...props
}) => {
  const [field, meta] = useField(name);
  const { handleChange, setFieldTouched } = useFormikContext();
  const fieldName = field.name;
  const setTouched = () => {
    setFieldTouched(fieldName);
  };
  return (
    <View style={S.inputContainer}>
      {label ? <Text style={[S.label, labelStyle]}>{label}</Text> : null}
      <TextInput {...props} onBlur={setTouched} onChangeText={handleChange(fieldName)} />
      {meta.touched && meta.error ? (
        <Text style={[S.errorMessageText, errStyle]}>{meta.error}</Text>
      ) : null}
    </View>
  );
};

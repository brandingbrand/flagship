import React from 'react';
import { useField, useFormikContext } from 'formik';
import { StyleProp, Text, TextInput, TextInputProps, TextStyle, View } from 'react-native';
import { style as S } from '../../styles/FormFK';


interface FormFieldProps extends TextInputProps {
  label?: string;
  name: string;
  labelStyle?: StyleProp<TextStyle>;
  errStyle?: StyleProp<TextStyle>;
}

export const TextField: React.FC<FormFieldProps> = (
  {label, name, labelStyle, errStyle, ...props}) => {
  const [field, meta] = useField(name);
  const { handleChange, setFieldTouched } = useFormikContext();
  const fieldName = field.name;
  const setTouched = () => setFieldTouched(fieldName);
  return (
    <View style={S.inputContainer}>
      {label && <Text style={[S.label, labelStyle]}>{label}</Text>}
        <TextInput
          {...props}
          onChangeText={handleChange(fieldName)}
          onBlur={setTouched}
        />
      {meta.touched && meta.error ? (
        <Text style={[S.errorMessageText, errStyle]}>
          {meta.error}
        </Text>
      ) : null}
    </View>
  );
};

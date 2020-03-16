import React from 'react';
import { useField, useFormikContext } from 'formik';
import {
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { style as S } from '../../styles/FormFK';

export interface FormFieldStylesProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errStyle?: StyleProp<TextStyle>;
}

interface FormFieldProps extends FormFieldStylesProps {
  label?: string;
  name: string;
}

export const TextField: React.FC<FormFieldProps> = (
  // tslint:disable-next-line:handle-callback-err
  { label, name, containerStyle, labelStyle, errStyle, ...props }) => {
  const [field, meta] = useField(name);
  const { handleChange, setFieldTouched } = useFormikContext();
  const fieldName = field.name;
  const setTouched = () => setFieldTouched(fieldName);
  return (
    <View style={[S.inputContainer, containerStyle]}>
      {label && <Text style={[S.label, labelStyle]}>{label}</Text>}
      <TextInput
        {...props}
        onChangeText={handleChange(fieldName)}
        onBlur={setTouched}
        value={field.value}
      />
      {meta.touched && meta.error ?
        <Text style={[S.errorMessageText, errStyle]}>
          {meta.error}
        </Text> : null}
    </View>
  );
};

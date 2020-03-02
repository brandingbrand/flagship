import React from 'react';

import { ErrorMessage, FormikProps } from 'formik';

import {
  Image,
  ImageProps,
  ImageRequireSource,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';

import { Omit } from '@brandingbrand/fsfoundation';

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#cccccc',
    padding: 10
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  label: {
    fontSize: 12,
    color: 'black',
    marginBottom: 3
  },
  textInput: {
    fontSize: 18,
    flexGrow: 1
  },
  error: {
    marginTop: 3,
    fontSize: 12,
    color: 'red' 
  }
});

interface FSTextInputProps extends FormikProps<any>, TextInputProps {
  value: string;
  name: string;
  label?: string;
  setRef?: (instance: TextInput) => void;
  icon?: ImageRequireSource;
  iconProps?: Omit<ImageProps, 'source'>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  textInputStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  errorStyle?: StyleProp<TextStyle>;
}

const FSTextInput = (props: FSTextInputProps): JSX.Element => {
  const {
    containerStyle,
    icon,
    iconProps,
    inputContainerStyle,
    name,
    textInputStyle,
    value,
    ...textProps
  } = props;

  return (
    <View style={[styles.container, containerStyle]}>
      {!!name && <Text style={styles.label}>{textProps.label}</Text>}
      <View style={[styles.inputContainer, inputContainerStyle]}>
        <TextInput
          placeholder={textProps.label}
          onChangeText={textProps.handleChange(name)}
          onBlur={textProps.handleBlur(name)}
          value={value}
          style={[styles.textInput, textInputStyle]}
          ref={textProps.setRef}
          {...textProps}
        />
        {icon !== undefined && (<Image source={icon} {...iconProps}/>)}
      </View>
      <ErrorMessage name={name}>
        {(msg: any) => <Text style={[styles.error, textProps.errorStyle]}>{msg}</Text>}
      </ErrorMessage>
    </View>
  );
};

export default FSTextInput;

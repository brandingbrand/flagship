import type { FC, ReactNode } from 'react';
import React, { useState } from 'react';

import type {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Image, StyleSheet, Text, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import type { Item } from 'react-native-picker-select';

import arrowDown from '../../../../assets/images/ArrowDown.png';
import warning from '../../../../assets/images/warning.png';
import { palette } from '../../../styles/variables';

const icons = {
  arrowDown,
  warning,
};

const styles = StyleSheet.create({
  arrowIcon: {
    right: 20,
  },
  container: {
    marginBottom: 30,
    position: 'relative',
    width: '100%',
  },
  errorIconStyle: {
    height: 11,
    marginRight: 5,
    width: 12,
  },
  errorMessage: {
    color: palette.error,
  },
  errorWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 3,
  },
  inputValueText: {
    color: palette.primary,
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  placeholder: {
    color: palette.primary,
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: palette.background,
    borderColor: palette.secondary,
    borderRadius: 5,
    borderWidth: 1,
    height: 55,
    justifyContent: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  title: {
    color: palette.primary,
    fontSize: 13,
    letterSpacing: 0.5,
    lineHeight: 13,
    marginBottom: 3,
  },
});

interface SerializeableFormPickerProps {
  formFieldName: string;
  items: Item[];
  errorsMessage?: string;
  required?: boolean;
  requiredSymbol?: string;
  title?: string;
  placeholder?: string;
  iconUrl?: ImageSourcePropType;
  errorIcon?: ImageSourcePropType;
  containerStyles?: ViewStyle;
  textInputViewStyles?: ViewStyle;
  titleStyles?: TextStyle;
  placeholderStyles?: TextStyle;
  errorMessageStyle?: TextStyle;
  textInputTextStyles?: TextStyle;
  activeInputStyles?: ViewStyle;
  imageWrapperStyle?: ViewStyle;
  errorContainerStyles?: ViewStyle;
  imageStyles?: ImageStyle;
  errorIconStyle?: ImageStyle;
}

interface FormPickerProps
  extends Omit<
    SerializeableFormPickerProps,
    | 'activeInputStyles'
    | 'containerStyles'
    | 'errorContainerStyles'
    | 'errorIconStyle'
    | 'errorMessageStyle'
    | 'imageStyles'
    | 'imageWrapperStyle'
    | 'placeholderStyles'
    | 'textInputTextStyles'
    | 'textInputViewStyles'
    | 'titleStyles'
  > {
  onBlur?: () => void;
  onFocus?: () => void;
  setFormikField?: (field: string, value: unknown, shouldValidate?: boolean) => void;
  containerStyles?: StyleProp<ViewStyle>;
  textInputViewStyles?: StyleProp<ViewStyle>;
  titleStyles?: StyleProp<TextStyle>;
  placeholderStyles?: StyleProp<TextStyle>;
  errorMessageStyle?: StyleProp<TextStyle>;
  textInputTextStyles?: StyleProp<TextStyle>;
  activeInputStyles?: StyleProp<ViewStyle>;
  imageWrapperStyle?: StyleProp<ViewStyle>;
  errorContainerStyles?: StyleProp<ViewStyle>;
  imageStyles?: StyleProp<ImageStyle>;
  errorIconStyle?: StyleProp<ImageStyle>;
}

const FormPicker: FC<FormPickerProps> = (props) => {
  const {
    containerStyles,
    errorContainerStyles,
    errorIcon,
    errorIconStyle,
    errorMessageStyle,
    errorsMessage,
    formFieldName,
    placeholder,
    placeholderStyles,
    required,
    requiredSymbol,
    setFormikField,
    textInputTextStyles,
    textInputViewStyles,
    title,
    titleStyles,
  } = props;

  const [pickerValue, setValue] = useState<string>('');

  const handleChange = (value: string | null) => {
    // Fix for function being called twice with null the second time
    // https://github.com/lawnstarter/react-native-picker-select/issues/369
    if (value !== null) {
      setValue(value);
      setFormikField?.(formFieldName, value);
    }
  };

  const renderPickerIcon =
    (icon: ImageSourcePropType, iconStyle?: StyleProp<ImageStyle>) => (): ReactNode =>
      <Image source={icon} style={[styles.arrowIcon, iconStyle]} />;

  const pickerStyle = {
    inputIOSContainer: { ...styles.textInput, textInputViewStyles },
    inputIOS: { ...styles.inputValueText, textInputTextStyles },
    inputAndroidContainer: { ...styles.textInput, textInputViewStyles },
    inputAndroid: { ...styles.inputValueText, textInputTextStyles },
    placeholder: { ...styles.placeholder, placeholderStyles },
  };

  return (
    <View style={[styles.container, containerStyles]}>
      <Text style={[styles.title, titleStyles]}>
        {required ? requiredSymbol || `*${title}` : title}
      </Text>
      <RNPickerSelect
        Icon={renderPickerIcon(icons.arrowDown)}
        onValueChange={handleChange}
        placeholder={placeholder}
        style={pickerStyle}
        useNativeAndroidPickerStyle={false}
        value={pickerValue}
        {...props}
      />
      {Boolean(errorsMessage) && (
        <View style={[styles.errorWrapper, errorContainerStyles]}>
          <Image
            source={errorIcon || icons.warning}
            style={[styles.errorIconStyle, errorIconStyle]}
          />
          <Text style={[styles.errorMessage, errorMessageStyle]}>{errorsMessage}</Text>
        </View>
      )}
    </View>
  );
};

export default FormPicker;

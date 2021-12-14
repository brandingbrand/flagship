import React, { FC, ReactNode, useState } from 'react';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import { palette } from '../../../styles/variables';

import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    marginBottom: 30
  },
  title: {
    color: palette.primary,
    letterSpacing: 0.5,
    fontSize: 13,
    lineHeight: 13,
    marginBottom: 3
  },
  textInput: {
    width: '100%',
    height: 55,
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: palette.secondary,
    backgroundColor: palette.background,
    paddingHorizontal: 20
  },
  arrowIcon: {
    right: 20
  },
  inputValueText: {
    fontWeight: '500',
    fontSize: 17,
    letterSpacing: 0.5,
    color: palette.primary
  },
  placeholder: {
    fontWeight: '500',
    fontSize: 17,
    letterSpacing: 0.5,
    color: palette.primary
  },
  errorMessage: {
    color: palette.error
  },
  errorIconStyle: {
    width: 12,
    height: 11,
    marginRight: 5
  },
  errorWrapper: {
    marginTop: 3,
    flexDirection: 'row',
    alignItems: 'center'
  }
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

interface FormPickerProps extends Omit<
  SerializeableFormPickerProps,
  'containerStyles' | 'textInputViewStyles' | 'titleStyles' | 'placeholderStyles' |
  'errorMessageStyle' | 'textInputTextStyles' | 'activeInputStyles' | 'imageWrapperStyle' |
  'errorContainerStyles' | 'imageStyles' | 'errorIconStyle'
> {
  onBlur?: () => void;
  onFocus?: () => void;
  setFormikField?: (field: string, value: any, shouldValidate?: boolean) => void;
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

const icons = {
  arrowDown: require('../../../../assets/images/ArrowDown.png'),
  warning: require('../../../../assets/images/warning.png')
};

const FormPicker: FC<FormPickerProps> = props => {
  const {
    title,
    containerStyles,
    titleStyles,
    placeholder,
    setFormikField,
    textInputViewStyles,
    textInputTextStyles,
    placeholderStyles,
    formFieldName,
    errorsMessage,
    errorMessageStyle,
    required,
    requiredSymbol,
    errorIcon,
    errorIconStyle,
    errorContainerStyles
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

  const renderPickerIcon = (
    icon: ImageSourcePropType,
    iconStyle?: StyleProp<ImageStyle>
  ) => (): ReactNode => {
    return (
      <>
        <Image
          source={icon}
          style={[
            styles.arrowIcon,
            iconStyle
          ]}
        />
      </>
    );
  };

  const pickerStyle = {
    inputIOSContainer: {...styles.textInput, textInputViewStyles},
    inputIOS: {...styles.inputValueText, textInputTextStyles},
    inputAndroidContainer: {...styles.textInput, textInputViewStyles},
    inputAndroid: {...styles.inputValueText, textInputTextStyles},
    placeholder: {...styles.placeholder, placeholderStyles}
  };

  return (
    <View
      style={[
        styles.container,
        containerStyles
      ]}
    >
      <Text
        style={[
          styles.title,
          titleStyles
        ]}
      >
        {
          required ?
            requiredSymbol || '*' + title :
            title
        }
      </Text>
      <RNPickerSelect
        style={pickerStyle}
        placeholder={placeholder}
        onValueChange={handleChange}
        useNativeAndroidPickerStyle={false}
        value={pickerValue}
        Icon={renderPickerIcon(icons.arrowDown)}
        {...props}
      />
      {!!errorsMessage && (
        <View
          style={[
            styles.errorWrapper,
            errorContainerStyles
          ]}
        >
          <Image
            source={errorIcon || icons.warning}
            style={[
              styles.errorIconStyle,
              errorIconStyle
            ]}
          />
          <Text
            style={[
              styles.errorMessage,
              errorMessageStyle
            ]}
          >
            {errorsMessage}
          </Text>
        </View>
      )}
    </View>
  );
};

export default FormPicker;

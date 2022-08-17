import React, { PureComponent } from 'react';

import type {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {
  Animated,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import clearIcon from '../../assets/images/clear.png';
import { tr, trKeys } from '../lib/translations';
import { style as S } from '../styles/SearchBar';
import type { ClearButtonMode } from '../types/Store';

const kCancelButtonWidthDefault = 75; // In pts
const kCancelButtonAnimationDuration = 200; // In ms

const isIOS = Platform.OS === 'ios';

export interface SearchBarProps {
  placeholder?: string;
  initialValue?: string;
  onSubmit?: (value: string) => void;
  onChange?: (value: string) => void;
  onFocus?: (input: TextInput, container: View) => void;
  onBlur?: (input: TextInput, container: View) => void;
  onCancel?: () => void;
  renderCancelButton?: () => React.ReactNode;

  // accessibility
  accessibilityLabel?: string;
  rightBtnAccessibilityLabel?: string;

  // visibility
  showSearchIcon?: boolean;
  showLocator?: boolean;
  showCancel?: boolean | 'left' | 'right';
  clearButtonMode?: ClearButtonMode;

  // button
  searchTitle?: string;
  cancelTitle?: string;
  searchIcon?: ImageSourcePropType;
  locateIcon?: ImageSourcePropType;
  cancelImage?: ImageSourcePropType;
  clearIcon?: ImageSourcePropType;
  onLocateButtonPress?: () => void;

  // input
  inputProps?: TextInputProps;
  shouldClearOnSubmit?: boolean;

  // style
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  searchTitleStyle?: StyleProp<TextStyle>;
  cancelTitleStyle?: StyleProp<TextStyle>;
  searchIconStyle?: StyleProp<ImageStyle>;
  locateIconStyle?: StyleProp<ImageStyle>;
  inputTextStyle?: StyleProp<TextStyle>;
  cancelImageStyle?: StyleProp<ImageStyle>;
  cancelImageBoxStyle?: StyleProp<ViewStyle>;
  cancelContainerStyle?: StyleProp<ViewStyle>;

  cancelButtonWidth?: number;
  cancelButtonAlwaysVisible?: boolean;

  showRightBtnIcon?: boolean;
  rightBtnIcon?: ImageSourcePropType;
  onRightBtnPress?: () => void;
  rightBtnStyle?: StyleProp<ViewStyle>;
  rightBtnIconStyle?: StyleProp<ImageStyle>;
  clearIconStyle?: StyleProp<ImageStyle>;
  clearIconWrapper?: StyleProp<ViewStyle>;
}

export interface SearchBarState {
  value: string;
  cancelButtonWidth: Animated.Value;
  isFocused: boolean;
}

const styles = StyleSheet.create({
  rightIcon: {
    width: 25,
  },
});

export class SearchBar extends PureComponent<SearchBarProps, SearchBarState> {
  public static defaultProps: Partial<SearchBarProps> = {
    shouldClearOnSubmit: true,
  };

  constructor(props: SearchBarProps) {
    super(props);

    let cancelButtonWidth;

    cancelButtonWidth = props.cancelButtonAlwaysVisible
      ? new Animated.Value(props.cancelButtonWidth || kCancelButtonWidthDefault)
      : new Animated.Value(0);

    this.state = {
      value: props.initialValue || '',
      cancelButtonWidth,
      isFocused: false,
    };
  }

  private input!: TextInput;
  private container!: View;

  private readonly saveInputRef = (input: TextInput) => (this.input = input);
  private readonly saveContainerRef = (container: View) => (this.container = container);

  private readonly renderInput = () => {
    const {
      accessibilityLabel,
      clearButtonMode,
      containerStyle,
      inputProps,
      inputTextStyle,
      placeholder,
      searchIcon,
      searchIconStyle,
      showSearchIcon,
    } = this.props;

    const { isFocused } = this.state;
    const imageStyle: StyleProp<ImageStyle> = [
      S.searchIcon,
      isFocused && S.searchIconFocused,
      searchIconStyle,
    ];

    return (
      <View style={[S.inputContainer, containerStyle]}>
        {showSearchIcon && searchIcon ? (
          <Image resizeMode="contain" source={searchIcon} style={imageStyle} />
        ) : null}
        <TextInput
          accessibilityLabel={accessibilityLabel || 'search bar'}
          clearButtonMode={clearButtonMode || 'never'}
          onBlur={this.handleBlur}
          onChangeText={this.handleChangeText}
          onFocus={this.handleFocus}
          onSubmitEditing={this.handleSubmit}
          placeholder={placeholder}
          ref={this.saveInputRef}
          returnKeyType="search"
          style={[S.input, inputTextStyle]}
          underlineColorAndroid="transparent"
          value={this.state.value}
          {...inputProps}
        />
        {this.renderAndroidClearButton()}
        {this.renderRightBtnIcon()}
      </View>
    );
  };

  private readonly renderAndroidClearButton = () => {
    if (
      this.props.clearButtonMode === 'never' ||
      isIOS ||
      !this.state.value ||
      this.state.value.length === 0 ||
      !this.props.clearButtonMode
    ) {
      return null;
    }

    const icon = (
      <Image
        resizeMode="contain"
        source={this.props.clearIcon || clearIcon}
        style={[styles.rightIcon, this.props.clearIconStyle]}
      />
    );

    return (
      <TouchableOpacity
        accessibilityRole="button"
        onPress={this.handleClear}
        style={[S.clearIconWrapper, this.props.clearIconWrapper]}
      >
        {icon}
      </TouchableOpacity>
    );
  };

  private readonly renderRightBtnIcon = () => {
    const {
      onRightBtnPress,
      onSubmit,
      rightBtnIcon,
      rightBtnIconStyle,
      rightBtnStyle,
      showRightBtnIcon,
    } = this.props;

    if (!showRightBtnIcon || !rightBtnIcon) {
      return null;
    }

    const icon = <Image resizeMode="contain" source={rightBtnIcon} style={rightBtnIconStyle} />;

    if (!onRightBtnPress && !onSubmit) {
      return icon;
    }

    return (
      <TouchableOpacity
        accessibilityLabel={
          this.props.rightBtnAccessibilityLabel ||
          tr.string(trKeys.flagship.search.actions.search.accessibilityLabel, {
            value: this.state.value,
          })
        }
        accessibilityRole="button"
        onPress={onRightBtnPress || this.handleSubmit}
        style={rightBtnStyle}
      >
        {icon}
      </TouchableOpacity>
    );
  };

  private readonly handleChangeText = (value: string) => {
    this.setState({ value });
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  private readonly handleSubmit = () => {
    const { onSubmit, shouldClearOnSubmit } = this.props;

    if (onSubmit) {
      onSubmit(this.state.value);
    }

    this.input.blur();
    if (shouldClearOnSubmit) {
      this.setState({ value: '' });
    }
  };

  private readonly handleCancel = () => {
    this.setState({ value: '' });
    this.input.blur();
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  };

  private readonly handleClear = () => {
    this.input.blur();
    this.setState({ value: '' });

    if (this.props.onChange) {
      this.props.onChange('');
    }
  };

  private readonly handleFocus = () => {
    const { cancelButtonAlwaysVisible, cancelButtonWidth, onFocus } = this.props;

    this.setState({ isFocused: true });

    if (onFocus) {
      onFocus(this.input, this.container);
    }

    if (!cancelButtonAlwaysVisible) {
      // The cancel button may not be visible. Animate it to full width.
      Animated.timing(this.state.cancelButtonWidth, {
        toValue: cancelButtonWidth || kCancelButtonWidthDefault,
        duration: kCancelButtonAnimationDuration,
        useNativeDriver: false,
      }).start();
    }
  };

  private readonly handleBlur = () => {
    const { cancelButtonAlwaysVisible, onBlur } = this.props;

    this.setState({ isFocused: false });

    if (onBlur) {
      onBlur(this.input, this.container);
    }

    if (!cancelButtonAlwaysVisible) {
      // Cancel button is not supposed to be visible on blur. Animate it away.
      Animated.timing(this.state.cancelButtonWidth, {
        toValue: 0,
        duration: kCancelButtonAnimationDuration,
        useNativeDriver: false,
      }).start();
    }
  };

  private readonly handleLocate = () => {
    const { onLocateButtonPress } = this.props;
    if (onLocateButtonPress) {
      onLocateButtonPress();
    }
  };

  public readonly focusInput = () => {
    this.input.focus();
  };

  private readonly renderCancelButton = () => {
    const {
      cancelContainerStyle,
      cancelImage,
      cancelImageBoxStyle,
      cancelImageStyle,
      cancelTitle,
      cancelTitleStyle,
      renderCancelButton,
    } = this.props;

    const { cancelButtonWidth } = this.state;

    if (renderCancelButton) {
      return renderCancelButton();
    }

    const viewStyle = cancelButtonWidth ? { width: cancelButtonWidth } : null;
    // if cancelButtonWidth is defined, parent width is defined, so just fill all the space
    const cancelStyle = cancelButtonWidth ? { flex: 1 } : { width: kCancelButtonWidthDefault };
    const cancelImageBoxStyleInput = cancelImageBoxStyle ? cancelImageBoxStyle : null;
    const touchableStyle = [S.rightButton, cancelStyle, cancelImageBoxStyleInput];

    return (
      <Animated.View style={[viewStyle, cancelContainerStyle]}>
        <TouchableOpacity
          accessibilityLabel="Cancel search"
          accessibilityRole="button"
          onPress={this.handleCancel}
          style={touchableStyle}
        >
          {cancelImage ? (
            <Image source={cancelImage} style={cancelImageStyle} />
          ) : (
            <Text style={cancelTitleStyle}>{cancelTitle || 'Cancel'}</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  private readonly renderLocateButton = () => {
    const { locateIcon, locateIconStyle } = this.props;

    if (!locateIcon) {
      console.warn('locateIcon is required to show locator');
      return null;
    }

    return (
      <TouchableOpacity
        accessibilityLabel="Locate me"
        accessibilityRole="button"
        onPress={this.handleLocate}
        style={S.locateButton}
      >
        <Image resizeMode="contain" source={locateIcon} style={[S.locateIcon, locateIconStyle]} />
      </TouchableOpacity>
    );
  };

  public render(): JSX.Element {
    const { showCancel, showLocator, style } = this.props;

    return (
      <View ref={this.saveContainerRef} style={[S.container, style]}>
        <View style={S.searchBarContainer}>
          {showCancel === 'left' && this.renderCancelButton()}
          {showLocator ? this.renderLocateButton() : null}
          {this.renderInput()}
          {(showCancel === true || showCancel === 'right') && this.renderCancelButton()}
        </View>
      </View>
    );
  }
}

import React, { PureComponent } from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import type { SwatchItemType } from './Swatches';

import { style as S } from '../styles/Swatches';

export interface SwatchStyle {
  // color style
  colorContainerStyle?: StyleProp<ViewStyle>;
  selectedColorContainerStyle?: StyleProp<ViewStyle>;
  disabledColorContainerStyle?: StyleProp<ViewStyle>;
  colorStyle?: StyleProp<ViewStyle>;
  selectedColorStyle?: StyleProp<ViewStyle>;
  disabledColorStyle?: StyleProp<ViewStyle>;

  // text style
  textContainerStyle?: StyleProp<ViewStyle>;
  selectedTextContainerStyle?: StyleProp<ViewStyle>;
  disabledTextContainerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  selectedTextStyle?: StyleProp<TextStyle>;
  disabledTextStyle?: StyleProp<TextStyle>;

  // image style
  imageContainerStyle?: StyleProp<ViewStyle>;
  selectedImageContainerStyle?: StyleProp<ViewStyle>;
  disabledImageContainerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  selectedImageStyle?: StyleProp<ImageStyle>;
  disabledImageStyle?: StyleProp<ImageStyle>;
}

export interface SerializableSwatchProps extends SwatchItemType {
  // selection
  index: number;
  selected: boolean;
  disabled?: boolean;
}

// deprecated misspelling
export type SerializaSwatchProps = SerializableSwatchProps;

export interface SwatchProps extends SwatchStyle, SerializableSwatchProps {
  // actions
  onSelect: (swatch: SwatchProps) => void;

  // custom render
  render?: (swatch: SwatchProps) => React.ReactNode;
}

// tslint:disable:no-boolean-literal-compare
export class Swatch extends PureComponent<SwatchProps> {

  _renderTouchable(style: StyleProp<ViewStyle>, child: JSX.Element): JSX.Element {
    const { disabled, name, onSelect, value } = this.props;

    return (
      <TouchableOpacity
        style={style}
        onPress={onSelect.bind(this, this.props)}
        disabled={disabled}
        accessibilityRole='button'
        accessibilityLabel={name || value}
      >
        {child}
      </TouchableOpacity>
    );
  }

  _renderColor(color: string): JSX.Element {
    const {
      selected,
      colorContainerStyle,
      selectedColorContainerStyle,
      disabledColorContainerStyle,
      colorStyle,
      selectedColorStyle,
      disabledColorStyle,
      disabled
    } = this.props;


    const style: StyleProp<ViewStyle> = [
      [S.colorContainerItem, colorContainerStyle],
      selected && [S.selectedColorContainerItem, selectedColorContainerStyle],
      disabled && disabledColorContainerStyle
    ];

    return this._renderTouchable(style,
      (
        <View
          style={[
            S.colorItem,
            colorStyle,
            selected ? selectedColorStyle : null,
            disabled ? disabledColorStyle : null,
            { backgroundColor: color }
          ]}
        />
      )
    );
  }

  _renderImage(image: ImageSourcePropType): React.ReactNode {
    const {
      selected,
      imageContainerStyle,
      selectedImageContainerStyle,
      disabledImageContainerStyle,
      imageStyle,
      selectedImageStyle,
      disabledImageStyle,
      disabled
    } = this.props;

    if (!image) {
      return null;
    }

    const style: StyleProp<ViewStyle> = [
      [S.imageContainerItem, imageContainerStyle],
      selected && [S.selectedImageContainerItem, selectedImageContainerStyle],
      disabled && disabledImageContainerStyle
    ];

    return this._renderTouchable(style,
      (
        <Image
          style={[
            S.imageItem,
            selected ? S.selectedImageItem : [],
            imageStyle,
            selected ? selectedImageStyle : [],
            disabled ? disabledImageStyle : []
          ]}
          source={image}
        />
      )
    );
  }

  _renderText(): JSX.Element {
    const {
      value,
      selected,
      textContainerStyle,
      selectedTextContainerStyle,
      disabledTextContainerStyle,
      textStyle,
      selectedTextStyle,
      disabledTextStyle,
      disabled,
      name
    } = this.props;


    const style: StyleProp<ViewStyle> = [
      [S.textContainerItem, textContainerStyle],
      selected && [S.selectedTextContainerItem, selectedTextContainerStyle],
      disabled && disabledTextContainerStyle
    ];

    return this._renderTouchable(style,
      (
        <Text
          style={[
            S.textItem,
            textStyle,
            selected ? selectedTextStyle : [],
            disabled ? disabledTextStyle : []
          ]}
        >
          {name || value}
        </Text>
      )
    );
  }

  render(): React.ReactNode {
    const {
      color,
      image,
      value,
      render,
      swatch
    } = this.props;

    if (render) {
      return render(this.props);
    } else if (color) {
      return this._renderColor(color);
    } else if (image) {
      return this._renderImage(image);
    } else if (swatch) {
      if (typeof swatch === 'string') {
        return this._renderColor(swatch);
      } else {
        return this._renderImage(swatch);
      }
    } else if (value) {
      return this._renderText();
    } else {
      return null;
    }
  }

}

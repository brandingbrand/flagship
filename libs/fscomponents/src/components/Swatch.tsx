import React, { PureComponent } from 'react';

import type {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { style as S } from '../styles/Swatches';

import type { SwatchItemType } from './Swatches';

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

export class Swatch extends PureComponent<SwatchProps> {
  private renderTouchable(style: StyleProp<ViewStyle>, child: JSX.Element): JSX.Element {
    const { disabled, name, onSelect, value } = this.props;

    return (
      <TouchableOpacity
        accessibilityLabel={name || value}
        accessibilityRole="button"
        disabled={disabled}
        onPress={onSelect.bind(this, this.props)}
        style={style}
      >
        {child}
      </TouchableOpacity>
    );
  }

  private renderColor(color: string): JSX.Element {
    const {
      colorContainerStyle,
      colorStyle,
      disabled,
      disabledColorContainerStyle,
      disabledColorStyle,
      selected,
      selectedColorContainerStyle,
      selectedColorStyle,
    } = this.props;

    const style: StyleProp<ViewStyle> = [
      [S.colorContainerItem, colorContainerStyle],
      selected && [S.selectedColorContainerItem, selectedColorContainerStyle],
      disabled && disabledColorContainerStyle,
    ];

    return this.renderTouchable(
      style,
      <View
        style={[
          S.colorItem,
          colorStyle,
          selected ? selectedColorStyle : null,
          disabled ? disabledColorStyle : null,
          { backgroundColor: color },
        ]}
      />
    );
  }

  private renderImage(image: ImageSourcePropType): React.ReactNode {
    const {
      disabled,
      disabledImageContainerStyle,
      disabledImageStyle,
      imageContainerStyle,
      imageStyle,
      selected,
      selectedImageContainerStyle,
      selectedImageStyle,
    } = this.props;

    if (!image) {
      return null;
    }

    const style: StyleProp<ViewStyle> = [
      [S.imageContainerItem, imageContainerStyle],
      selected && [S.selectedImageContainerItem, selectedImageContainerStyle],
      disabled && disabledImageContainerStyle,
    ];

    return this.renderTouchable(
      style,
      <Image
        source={image}
        style={[
          S.imageItem,
          selected ? S.selectedImageItem : [],
          imageStyle,
          selected ? selectedImageStyle : [],
          disabled ? disabledImageStyle : [],
        ]}
      />
    );
  }

  private renderText(): JSX.Element {
    const {
      disabled,
      disabledTextContainerStyle,
      disabledTextStyle,
      name,
      selected,
      selectedTextContainerStyle,
      selectedTextStyle,
      textContainerStyle,
      textStyle,
      value,
    } = this.props;

    const style: StyleProp<ViewStyle> = [
      [S.textContainerItem, textContainerStyle],
      selected && [S.selectedTextContainerItem, selectedTextContainerStyle],
      disabled && disabledTextContainerStyle,
    ];

    return this.renderTouchable(
      style,
      <Text
        style={[
          S.textItem,
          textStyle,
          selected ? selectedTextStyle : [],
          disabled ? disabledTextStyle : [],
        ]}
      >
        {name || value}
      </Text>
    );
  }

  public render(): React.ReactNode {
    const { color, image, render, swatch, value } = this.props;

    if (render) {
      return render(this.props);
    } else if (color) {
      return this.renderColor(color);
    } else if (image) {
      return this.renderImage(image);
    } else if (swatch) {
      if (typeof swatch === 'string') {
        return this.renderColor(swatch);
      }
      return this.renderImage(swatch);
    } else if (value) {
      return this.renderText();
    }
    return null;
  }
}

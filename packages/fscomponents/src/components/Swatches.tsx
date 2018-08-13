import React, { Component } from 'react';
import {
  ImageURISource,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import { findIndex } from 'lodash-es';

import { style as S } from '../styles/Swatches';

import { Swatch, SwatchStyle } from './Swatch';

export interface SwatchItemType extends CommerceTypes.OptionValue {
  color?: string;
  image?: ImageURISource;
}

export interface SwatchesProps extends SwatchStyle {
  title?: string;
  items: SwatchItemType[];
  defaultValue?: string;
  style?: StyleProp<ViewStyle>;
  renderSwatch?: (swatch: any) => React.ReactNode;

  label?: boolean;
  labelContainerStyle?: StyleProp<ViewStyle>;
  labelTitleStyle?: StyleProp<TextStyle>;
  labelValueStyle?: StyleProp<TextStyle>;
  renderLabel?: (swatch: any) => void;

  onChangeSwatch?: (swatch: any) => void;

  // Can you select swatches
  disabled?: boolean;

  // More/Less
  maxSwatches?: number;
  renderMoreLess?: (showMore: boolean) => React.ReactNode;
  moreLessStyle?: StyleProp<ViewStyle>;
}

export interface SwatchesState {
  selected: any;

  shouldShowMoreLess: boolean;
  showMore: boolean;
}

export class Swatches extends Component<SwatchesProps, SwatchesState> {
  static getDerivedStateFromProps(nextProps: SwatchesProps): Partial<SwatchesState> | null {
    const { defaultValue, items } = nextProps;

    // Default swatch selection
    if (defaultValue) {
      const defaultIndex = findIndex(items, { value: defaultValue });
      if (defaultIndex > -1) {
        const defaultSwatch = items[defaultIndex];
        return {
          selected: {
            index: defaultIndex,
            swatch: {
              value: defaultSwatch.value,
              name: defaultSwatch.name
            }
          }
        };
      }
    }

    return null;
  }

  constructor(props: SwatchesProps) {
    super(props);

    // Default State
    this.state = {
      selected: {
        index: null,
        swatch: {
          value: null,
          name: null
        }
      },
      shouldShowMoreLess: props.maxSwatches ? (props.maxSwatches < props.items.length) : false,
      showMore: false
    };
  }

  onSelect = (swatch: any) => {
    const option = {
      value: swatch.value,
      name: swatch.name
    };

    this.setState({
      selected: {
        index: swatch.index,
        swatch: option
      }
    });

    const { onChangeSwatch } = this.props;
    if (onChangeSwatch) {
      onChangeSwatch(swatch.value);
    }
  }

  _renderSwatch = (item: SwatchItemType, i: number) => {
    const { selected } = this.state;
    const {
      colorContainerStyle,
      selectedColorContainerStyle,
      disabledColorContainerStyle,
      colorStyle,
      selectedColorStyle,
      disabledColorStyle,
      textContainerStyle,
      selectedTextContainerStyle,
      disabledTextContainerStyle,
      textStyle,
      selectedTextStyle,
      disabledTextStyle,
      imageContainerStyle,
      selectedImageContainerStyle,
      disabledImageContainerStyle,
      imageStyle,
      selectedImageStyle,
      disabledImageStyle,
      renderSwatch,
      disabled
    } = this.props;

    return (
      <View key={i}>
        <Swatch
          index={i}
          disabled={disabled || item.available === false}
          colorContainerStyle={colorContainerStyle}
          disabledColorContainerStyle={disabledColorContainerStyle}
          selectedColorContainerStyle={selectedColorContainerStyle}
          colorStyle={colorStyle}
          disabledColorStyle={disabledColorStyle}
          selectedColorStyle={selectedColorStyle}
          textContainerStyle={textContainerStyle}
          disabledTextContainerStyle={disabledTextContainerStyle}
          selectedTextContainerStyle={selectedTextContainerStyle}
          textStyle={textStyle}
          disabledTextStyle={disabledTextStyle}
          selectedTextStyle={selectedTextStyle}
          imageContainerStyle={imageContainerStyle}
          disabledImageContainerStyle={disabledImageContainerStyle}
          selectedImageContainerStyle={selectedImageContainerStyle}
          imageStyle={imageStyle}
          disabledImageStyle={disabledImageStyle}
          selectedImageStyle={selectedImageStyle}
          selected={i === selected.index}
          onSelect={this.onSelect}
          render={renderSwatch}
          {...item}
        />
      </View>
    );
  }

  _renderLabel = (swatch: any) => {
    const {
      title,
      labelContainerStyle,
      labelTitleStyle,
      labelValueStyle,
      renderLabel
    } = this.props;

    const { selected } = this.state;
    const name = selected.swatch.name;

    if (renderLabel) {
      return renderLabel(swatch);
    }

    return (
      <View style={[S.labelContainer, labelContainerStyle]}>
        <Text style={[S.labelTitle, labelTitleStyle]}>{title || 'Selected'}: </Text>
        <Text style={labelValueStyle}>{name || ''}</Text>
      </View>
    );
  }

  toggleMoreLess = () => {
    this.setState({ showMore: !this.state.showMore });
  }

  _renderMoreLess = () => {
    const { shouldShowMoreLess, showMore } = this.state;
    const { textStyle, moreLessStyle, renderMoreLess } = this.props;

    let moreLess;
    if (renderMoreLess) {
      moreLess = renderMoreLess(showMore);
    } else {
      // Default Render: + or - text
      moreLess = <Text style={[S.textItem, textStyle]}>{showMore ? '-' : '+'}</Text>;
    }

    if (shouldShowMoreLess) {
      return (
        <TouchableOpacity
          accessibilityLabel='Toggle More/Less Swatches'
          activeOpacity={0.8}
          onPress={this.toggleMoreLess}
          style={moreLessStyle}
        >
          {moreLess}
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  }

  render(): JSX.Element {
    const {
      items,
      style,
      maxSwatches,
      label
    } = this.props;

    const { shouldShowMoreLess, showMore } = this.state;
    const { swatch } = this.state.selected;

    let displayItems = [...items];
    if (shouldShowMoreLess && !showMore) {
      // Show Less
      displayItems = displayItems.slice(0, maxSwatches);
    }

    return (
      <View>
        {label && this._renderLabel(swatch)}
        <View style={[S.container, style]}>
          {displayItems.map(this._renderSwatch)}
          {this._renderMoreLess()}
        </View>
      </View>
    );
  }
}

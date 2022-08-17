import React, { Component } from 'react';

import type { ImageURISource, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Text, TouchableOpacity, View } from 'react-native';

import type { CommerceTypes } from '@brandingbrand/fscommerce';

import { style as S } from '../styles/Swatches';

import type { SwatchProps, SwatchStyle } from './Swatch';
import { Swatch } from './Swatch';

export interface SwatchItemType extends CommerceTypes.OptionValue {
  color?: string; // deprecated
  image?: ImageURISource; // deprecated
}

export interface SerializableSwatchesProps {
  items: SwatchItemType[];
  title?: string;
  defaultValue?: string;
  style?: ViewStyle;
  label?: boolean;
  labelContainerStyle?: ViewStyle;
  labelTitleStyle?: TextStyle;
  labelValueStyle?: TextStyle;
  showingMoreStyle?: ViewStyle;
  showingLessStyle?: ViewStyle;
  separateMoreButton?: boolean;

  // Can you select swatches
  disabled?: boolean;

  // More/Less
  maxSwatches?: number;
  moreLessStyle?: ViewStyle;
}

export interface SwatchesProps
  extends SwatchStyle,
    Omit<
      SerializableSwatchesProps,
      | 'labelContainerStyle'
      | 'labelTitleStyle'
      | 'labelValueStyle'
      | 'moreLessStyle'
      | 'showingLessStyle'
      | 'showingMoreStyle'
      | 'style'
    > {
  style?: StyleProp<ViewStyle>;
  renderSwatch?: (swatch: SwatchProps) => React.ReactNode;

  labelContainerStyle?: StyleProp<ViewStyle>;
  labelTitleStyle?: StyleProp<TextStyle>;
  labelValueStyle?: StyleProp<TextStyle>;
  showingMoreStyle?: StyleProp<ViewStyle>;
  showingLessStyle?: StyleProp<ViewStyle>;
  renderLabel?: (swatch: SelectedSwatchItem) => void;

  onChangeSwatch?: (swatch: string) => void;
  onColorPress?: (elem: CommerceTypes.OptionValue) => void;

  // More/Less
  renderMoreLess?: (showMore: boolean) => React.ReactNode;
  moreLessStyle?: StyleProp<ViewStyle>;
  onClickPlus?: () => void;
}

export interface SelectedSwatchItem {
  value: string;
  name: string;
}

export interface SwatchesState {
  selected: {
    index: number | null;
    swatch: SelectedSwatchItem;
  };
  shouldShowMoreLess: boolean;
  showMore: boolean;
}

export class Swatches extends Component<SwatchesProps, SwatchesState> {
  constructor(props: SwatchesProps) {
    super(props);

    let hasColor = false;
    let hasImage = false;
    for (const item of props.items) {
      hasColor = hasColor || Boolean(item.color);
      hasImage = hasImage || Boolean(item.image);
    }

    if (hasColor) {
      console.error('Swatch "color" is deprecated. Please use "swatch" instead.');
    }

    if (hasImage) {
      console.error('Swatch "image" is deprecated. Please use "swatch" instead.');
    }

    const selectedSwatch: SwatchesState['selected'] = this.getSelectedSwatch(props) || {
      index: null,
      swatch: {
        value: '',
        name: '',
      },
    };

    // Default State
    this.state = {
      selected: selectedSwatch,
      shouldShowMoreLess: props.maxSwatches ? props.maxSwatches < props.items.length : false,
      showMore: false,
    };
  }

  private getSelectedSwatch(props: SwatchesProps): SwatchesState['selected'] | null {
    const { defaultValue, items } = props;

    // Default swatch selection
    if (defaultValue) {
      const defaultIndex = items.findIndex((item) => item.value === defaultValue);
      const defaultSwatch = items[defaultIndex];
      if (defaultSwatch) {
        return {
          index: defaultIndex,
          swatch: {
            value: defaultSwatch.value,
            name: defaultSwatch.name,
          },
        };
      }
    }
    return null;
  }

  private readonly onSelect = (swatch: SwatchProps) => {
    const option = {
      value: swatch.value || '',
      name: swatch.name || '',
    };

    this.setState({
      selected: {
        index: swatch.index,
        swatch: option,
      },
    });

    const { onChangeSwatch, onColorPress } = this.props;
    if (onColorPress) {
      try {
        onColorPress(swatch);
      } catch (error) {
        console.error(error);
      }
    }
    if (onChangeSwatch) {
      try {
        onChangeSwatch(swatch.value || '');
      } catch (error) {
        console.error(error);
      }
    }
  };

  private readonly _renderSwatch = (item: SwatchItemType, i: number) => {
    const { selected } = this.state;
    const {
      colorContainerStyle,
      colorStyle,
      disabled,
      disabledColorContainerStyle,
      disabledColorStyle,
      disabledImageContainerStyle,
      disabledImageStyle,
      disabledTextContainerStyle,
      disabledTextStyle,
      imageContainerStyle,
      imageStyle,
      renderSwatch,
      selectedColorContainerStyle,
      selectedColorStyle,
      selectedImageContainerStyle,
      selectedImageStyle,
      selectedTextContainerStyle,
      selectedTextStyle,
      textContainerStyle,
      textStyle,
    } = this.props;

    return (
      <View key={i}>
        <Swatch
          colorContainerStyle={colorContainerStyle}
          colorStyle={colorStyle}
          disabled={disabled || item.available === false}
          disabledColorContainerStyle={disabledColorContainerStyle}
          disabledColorStyle={disabledColorStyle}
          disabledImageContainerStyle={disabledImageContainerStyle}
          disabledImageStyle={disabledImageStyle}
          disabledTextContainerStyle={disabledTextContainerStyle}
          disabledTextStyle={disabledTextStyle}
          imageContainerStyle={imageContainerStyle}
          imageStyle={imageStyle}
          index={i}
          onSelect={this.onSelect}
          render={renderSwatch}
          selected={i === selected.index}
          selectedColorContainerStyle={selectedColorContainerStyle}
          selectedColorStyle={selectedColorStyle}
          selectedImageContainerStyle={selectedImageContainerStyle}
          selectedImageStyle={selectedImageStyle}
          selectedTextContainerStyle={selectedTextContainerStyle}
          selectedTextStyle={selectedTextStyle}
          textContainerStyle={textContainerStyle}
          textStyle={textStyle}
          {...item}
        />
      </View>
    );
  };

  private readonly renderLabel = (swatch: SelectedSwatchItem) => {
    const { labelContainerStyle, labelTitleStyle, labelValueStyle, renderLabel, title } =
      this.props;

    const { selected } = this.state;
    const { name } = selected.swatch;

    if (renderLabel) {
      renderLabel(swatch);
      return;
    }

    return (
      <View style={[S.labelContainer, labelContainerStyle]}>
        <Text style={[S.labelTitle, labelTitleStyle]}>{title || 'Selected'}: </Text>
        <Text style={labelValueStyle}>{name || ''}</Text>
      </View>
    );
  };

  private readonly toggleMoreLess = () => {
    this.setState({ showMore: !this.state.showMore });
  };

  private readonly renderMoreLess = () => {
    const { shouldShowMoreLess, showMore } = this.state;
    const { moreLessStyle, onClickPlus, renderMoreLess, textStyle } = this.props;

    if (shouldShowMoreLess) {
      let moreLess;
      if (renderMoreLess) {
        moreLess = renderMoreLess(showMore);
      } else {
        // Default Render: + or - text
        moreLess = <Text style={[S.textItem, textStyle]}>{showMore ? '-' : '+'}</Text>;
      }

      return (
        <TouchableOpacity
          accessibilityLabel="Toggle More/Less Swatches"
          activeOpacity={0.8}
          onPress={onClickPlus || this.toggleMoreLess}
          style={moreLessStyle}
        >
          {moreLess}
        </TouchableOpacity>
      );
    }
    return null;
  };

  public componentDidUpdate(prevProps: SwatchesProps, prevState: SwatchesState): void {
    if (
      prevProps.defaultValue !== this.props.defaultValue ||
      prevProps.items !== this.props.items
    ) {
      const selected = this.getSelectedSwatch(this.props);
      if (selected !== null) {
        this.setState({
          selected,
        });
      }
    }
  }

  public render(): JSX.Element {
    const { items, label, maxSwatches, showingLessStyle, showingMoreStyle, style } = this.props;

    const { shouldShowMoreLess, showMore } = this.state;
    const { swatch } = this.state.selected;

    let displayItems = [...items];
    if (shouldShowMoreLess && !showMore && (maxSwatches === undefined || maxSwatches > 0)) {
      // Show Less
      displayItems = displayItems.slice(0, maxSwatches);
    }

    return (
      <View>
        {label ? this.renderLabel(swatch) : null}
        <View>
          <View
            // @ts-expect-error className is web-only
            className={`swatch-scroll ${showMore ? 'showing-more' : 'showing-less'}`}
            style={[S.container, showMore ? showingMoreStyle : showingLessStyle, style]}
          >
            {displayItems.map(this._renderSwatch)}
            {this.props.separateMoreButton ? null : this.renderMoreLess()}
          </View>
          {this.props.separateMoreButton ? this.renderMoreLess() : null}
        </View>
      </View>
    );
  }
}

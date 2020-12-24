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

import { Swatch, SwatchProps, SwatchStyle } from './Swatch';

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

export interface SwatchesProps extends SwatchStyle, Omit<
  SerializableSwatchesProps,
  'style' |
  'labelContainerStyle' |
  'labelTitleStyle' |
  'labelValueStyle' |
  'showingMoreStyle' |
  'showingLessStyle' |
  'moreLessStyle'
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
    props.items.forEach(item => {
      hasColor = hasColor || !!item.color;
      hasImage = hasImage || !!item.image;
    });

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
        name: ''
      }
    };

    // Default State
    this.state = {
      selected: selectedSwatch,
      shouldShowMoreLess: props.maxSwatches ? (props.maxSwatches < props.items.length) : false,
      showMore: false
    };
  }

  componentDidUpdate(prevProps: SwatchesProps, prevState: SwatchesState): void {
    if (prevProps.defaultValue !== this.props.defaultValue ||
      prevProps.items !== this.props.items) {
      const selected = this.getSelectedSwatch(this.props);
      if (selected !== null) {
        this.setState({
          selected
        });
      }
    }
  }

  getSelectedSwatch(props: SwatchesProps): SwatchesState['selected'] | null {
    const { defaultValue, items } = props;

    // Default swatch selection
    if (defaultValue) {
      const defaultIndex = findIndex(items, { value: defaultValue });
      if (defaultIndex > -1) {
        const defaultSwatch = items[defaultIndex];
        return {
          index: defaultIndex,
          swatch: {
            value: defaultSwatch.value,
            name: defaultSwatch.name
          }
        };
      }
    }
    return null;
  }

  onSelect = (swatch: SwatchProps) => {
    const option = {
      value: swatch.value || '',
      name: swatch.name || ''
    };

    this.setState({
      selected: {
        index: swatch.index,
        swatch: option
      }
    });

    const { onColorPress, onChangeSwatch } = this.props;
    if (onColorPress) {
      try {
        onColorPress(swatch);
      } catch (e) {
        console.error(e);
      }
    }
    if (onChangeSwatch) {
      try {
        onChangeSwatch(swatch.value || '');
      } catch (e) {
        console.error(e);
      }
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

  _renderLabel = (swatch: SelectedSwatchItem) => {
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
    const { textStyle, moreLessStyle, onClickPlus, renderMoreLess } = this.props;

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
          accessibilityLabel='Toggle More/Less Swatches'
          activeOpacity={0.8}
          onPress={onClickPlus || this.toggleMoreLess}
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
      label,
      maxSwatches,
      showingLessStyle,
      showingMoreStyle,
      style
    } = this.props;

    const { shouldShowMoreLess, showMore } = this.state;
    const { swatch } = this.state.selected;

    let displayItems = [...items];
    if (shouldShowMoreLess && !showMore && (maxSwatches === undefined || maxSwatches > 0)) {
      // Show Less
      displayItems = displayItems.slice(0, maxSwatches);
    }

    return (
      <View>
        {label && this._renderLabel(swatch)}
        <View>
          <View
            style={[S.container, showMore ? showingMoreStyle : showingLessStyle, style]}
            // @ts-ignore className is web-only
            className={'swatch-scroll ' + (showMore ? 'showing-more' : 'showing-less')}
          >
            {displayItems.map(this._renderSwatch)}
            {this.props.separateMoreButton ? null : this._renderMoreLess()}
          </View>
          {this.props.separateMoreButton ? this._renderMoreLess() : null}
        </View>
      </View>
    );
  }
}

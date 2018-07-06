import React, { Component } from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { Total } from '@brandingbrand/fscomponents';
import { border, palette } from '../styles/variables';

export interface PSTotalsLineItem {
  label: string;
  value: string;
  textStyle?: StyleProp<TextStyle>;
}

export interface PSTotalsProps {
  items: PSTotalsLineItem[];
  promoItemTextStyle?: StyleProp<TextStyle>;
  lastItemTextStyle?: StyleProp<TextStyle>;
  lastItemViewStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}

const defaultViewStyle: ViewStyle = {
  marginHorizontal: 10
};

const defaultPromoItemTextStyle: TextStyle = {
  color: palette.accent
};

const defaultLastItemTextStyle: TextStyle = {
  fontWeight: 'bold'
};

const defaultLastItemViewStyle: ViewStyle = {
  borderTopColor: border.color,
  borderTopWidth: border.width
};

export default class PSTotals extends Component<PSTotalsProps> {
  style: StyleProp<ViewStyle>;
  promoItemTextStyle: any;
  lastItemTextStyle: any;
  lastItemViewStyle: any;

  constructor(props: PSTotalsProps) {
    super(props);

    this.style = this.props.style || defaultViewStyle;
    this.promoItemTextStyle = this.props.promoItemTextStyle || defaultPromoItemTextStyle;
    this.lastItemTextStyle = this.props.lastItemTextStyle || defaultLastItemTextStyle;
    this.lastItemViewStyle = this.props.lastItemViewStyle || defaultLastItemViewStyle;
  }

  render(): JSX.Element {
    return (
      <View style={this.style}>
        {this.props.items.map((line, index) => {
          return this.renderLine(line, (index + 1) === this.props.items.length);
        })}
      </View>
    );
  }

  renderLine(obj: PSTotalsLineItem, last: boolean): JSX.Element {
    if (last) {
      return (
        <Total
          key={obj.label + obj.value}
          keyName={obj.label}
          value={obj.value}

          style={this.lastItemViewStyle}
          keyStyle={this.lastItemTextStyle}
          valueStyle={this.lastItemTextStyle}
        />
      );
    } else if (/total savings/i.test(obj.label)) {
      return (
        <Total
          key={obj.label + obj.value}
          keyName={obj.label}
          value={obj.value}

          keyStyle={this.promoItemTextStyle}
          valueStyle={this.promoItemTextStyle}
        />
      );
    }
    return (
      <Total
        key={obj.label + obj.value}
        keyName={obj.label}
        value={obj.value}

        keyStyle={obj.textStyle}
        valueStyle={obj.textStyle}
      />
    );
  }
}

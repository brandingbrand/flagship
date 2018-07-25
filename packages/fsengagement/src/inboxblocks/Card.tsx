import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleProp, TextStyle, TouchableOpacity
} from 'react-native';
import { InboxBlock, InjectedProps } from '../types';

export interface CardProps extends InjectedProps {
  containerStyle?: StyleProp<TextStyle>;
  story?: InboxBlock;
}

export default class Card extends Component<CardProps> {

  static childContextTypes: any = {
    story: PropTypes.object
  };

  getChildContext = () => ({
    story: this.props.story
  })

  onCardPress = (): void => {
    this.props.clickHandler(this.props.messageId, this.props.story);
  }

  render(): JSX.Element {
    const {
      containerStyle,
      children
    } = this.props;

    return (
      <TouchableOpacity
        style={containerStyle}
        activeOpacity={0.9}
        onPress={this.onCardPress}
      >
        {children}
      </TouchableOpacity>
    );
  }
}

import React, { Component } from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';

import {
  InboxBlock,
  InjectedProps
} from '../types';

import TextBlock from './TextBlock';
import CTABlock from './CTABlock';
import ImageBlock from './ImageBlock';

export interface ComponentProps extends InjectedProps {
  containerStyle?: StyleProp<TextStyle>;
  story?: InboxBlock;
  contents: any;
}

export default class Card extends Component<ComponentProps> {

  static childContextTypes: any = {
    story: PropTypes.object
  };

  getChildContext = () => ({
    story: this.props.story
  })

  onCardPress = (): void => {
    const { story } = this.props;
    if (story) {
      this.props.clickHandler(story.messageId, story);
    }
  }

  render(): JSX.Element {
    const {
      containerStyle,
      contents
    } = this.props;

    return (
      <TouchableOpacity
        style={containerStyle}
        activeOpacity={0.9}
        onPress={this.onCardPress}
      >
        <ImageBlock
          {...contents.Image}
        />
        <TextBlock
          {...contents.Text}
        />
        <CTABlock
          {...contents.CTA}
          story={this.props.story}
        />

      </TouchableOpacity>
    );
  }
}

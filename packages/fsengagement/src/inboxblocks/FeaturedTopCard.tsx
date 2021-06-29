import React, { Component } from 'react';
import {
  DeviceEventEmitter,
  StyleProp,
  TextStyle,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import {
  CardProps,
  JSON,
  StoryGradient
} from '../types';

import { TextBlock, TextBlockProps } from './TextBlock';
import { CTABlock, CTABlockProps } from './CTABlock';
import { ImageBlock, ImageBlockProps } from './ImageBlock';

export interface FeaturedTopCardContents {
  Image: ImageBlockProps;
  Text: TextBlockProps;
  CTA: CTABlockProps;
}


export interface ComponentProps extends CardProps {
  containerStyle?: StyleProp<TextStyle>;
  story?: JSON;
  contents: FeaturedTopCardContents;
  api?: any;
  storyGradient?: StoryGradient;

}

export default class Card extends Component<ComponentProps> {
  static childContextTypes: any = {
    story: PropTypes.object,
    handleStoryAction: PropTypes.func
  };

  constructor(props: ComponentProps) {
    super(props);
  }

  getChildContext = () => ({
    story: this.props.story,
    handleStoryAction: this.handleStoryAction
  })

  handleStoryAction = async (json: JSON) => {
    DeviceEventEmitter.emit('viewStory', {
      title: this.props.name,
      id: this.props.id
    });
    this.props.api?.logEvent('viewInboxStory', {
      messageId: this.props.id
    });
    return this.props.navigator?.push({
      component: {
        name: 'EngagementComp',
        options: {
          topBar: {
            visible: false
          }
        },
        passProps: {
          json,
          backButton: true,
          name: this.props.name,
          id: this.props.id
        }
      }
    });
  }

  onCardPress = async (): Promise<void> => {
    const { story, storyGradient } = this.props;
    const actionPayload: any = storyGradient ?
      { ...story, storyGradient } : { ...story };
    return this.handleStoryAction(actionPayload);
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
        />

      </TouchableOpacity>
    );
  }
}

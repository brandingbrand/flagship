import React, { Component } from 'react';
import {
  DeviceEventEmitter,
  StyleProp,
  TextStyle,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import { Navigator } from '@brandingbrand/fsapp';
import {
  EmitterProps,
  JSON,
  ScreenProps,
  StoryGradient
} from '../types';

import TextBlock from './TextBlock';
import CTABlock from './CTABlock';
import ImageBlock from './ImageBlock';

export interface ComponentProps extends ScreenProps, EmitterProps {
  containerStyle?: StyleProp<TextStyle>;
  story?: JSON;
  contents: any;
  api?: any;
  storyGradient?: StoryGradient;
}

export default class Card extends Component<ComponentProps> {
  static childContextTypes: any = {
    story: PropTypes.object,
    handleStoryAction: PropTypes.func
  };
  navigator: Navigator;

  constructor(props: ComponentProps) {
    super(props);
    this.navigator = new Navigator({
      componentId: props.componentId,
      tabs: []
    });
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
    this.props.api.logEvent('viewInboxStory', {
      messageId: this.props.id
    });
    return this.navigator.push({
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
          story={this.props.story}
        />

      </TouchableOpacity>
    );
  }
}

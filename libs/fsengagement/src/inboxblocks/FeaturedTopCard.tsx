import React from 'react';

import type { StyleProp, TextStyle } from 'react-native';
import { DeviceEventEmitter, TouchableOpacity } from 'react-native';

import { useNavigator } from '@brandingbrand/fsapp';
import { Navigator } from '@brandingbrand/fsapp/legacy';

import { CardContext } from '../lib/contexts';
import type { CardProps, JSON, StoryGradient } from '../types';

import type { CTABlockProps } from './CTABlock';
import { CTABlock } from './CTABlock';
import type { ImageBlockProps } from './ImageBlock';
import { ImageBlock } from './ImageBlock';
import type { TextBlockProps } from './TextBlock';
import { TextBlock } from './TextBlock';

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

export const FeaturedTopCard: React.FunctionComponent<ComponentProps> = React.memo((props) => {
  const navigator = props.discoverPath ? useNavigator() : props.navigator;
  const { containerStyle, contents } = props;

  const handleStoryAction = async (json: JSON) => {
    DeviceEventEmitter.emit('viewStory', {
      title: props.name,
      id: props.id,
    });

    if (!navigator) {
      return;
    }
    if (props.discoverPath && !(navigator instanceof Navigator)) {
      navigator.open(`${props.discoverPath}/${props.id}`, {
        json,
        backButton: true,
        name: props.name,
        discoverPath: props.discoverPath,
      });

      return;
    }
    return navigator.push({
      component: {
        name: 'EngagementComp',
        options: {
          topBar: {
            visible: false,
          },
        },
        passProps: {
          json,
          backButton: true,
          name: props.name,
          id: props.id,
        },
      },
    });
  };

  const onCardPress = async (): Promise<void> => {
    const { story, storyGradient } = props;
    const actionPayload: any = storyGradient ? { ...story, storyGradient } : { ...story };
    return handleStoryAction(actionPayload);
  };

  return (
    <CardContext.Provider
      value={{
        story: props.story,
        handleStoryAction,
      }}
    >
      <TouchableOpacity style={containerStyle} activeOpacity={0.9} onPress={onCardPress}>
        <ImageBlock {...contents.Image} />
        <TextBlock {...contents.Text} />
        <CTABlock {...contents.CTA} />
      </TouchableOpacity>
    </CardContext.Provider>
  );
});

import React from 'react';
import { DeviceEventEmitter, StyleProp, TextStyle, TouchableOpacity } from 'react-native';

import { CardProps, JSON, StoryGradient } from '../types';
import { Navigator, useNavigator } from '@brandingbrand/fsapp';
import { CardContext } from '../lib/contexts';
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
      return navigator.open(`${props.discoverPath}/${props.id}`, {
        json,
        backButton: true,
        name: props.name,
        discoverPath: props.discoverPath,
      });
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

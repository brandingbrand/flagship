import React from 'react';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import rightArrow from '../../assets/images/rightArrow.png';
import rightBlockArrow from '../../assets/images/rightBlockArrow.png';
import { CardContext, EngagementContext } from '../lib/contexts';
import type { Action, EmitterProps, Icon, JSON } from '../types';

const images = {
  rightArrow,
  rightBlockArrow,
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexShrink: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 8,
    height: 13,
    marginLeft: 10,
  },
  buttonContents: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

interface LocalizationData {
  value: string;
  language: string;
}

export interface CTABlockProps extends EmitterProps {
  action: string;
  text: string;
  icon?: Icon;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  actions: Action;
  animateIndex?: number;
  onBack?: () => void;
  localization?: LocalizationData[];
}
export const CTABlock: React.FC<CTABlockProps> = React.memo((props) => {
  const { buttonStyle, containerStyle, icon, localization, textStyle } = props;
  let { text } = props;

  const { cardPosition, handleAction, language } = React.useContext(EngagementContext);
  const { cardActions, handleStoryAction, story } = React.useContext(CardContext);

  const filterLocalization =
    (localization && localization.find((item) => item.language === language)) || null;

  if (filterLocalization) {
    text = filterLocalization.value;
  }

  const handleActionNoStory = (actions: Action) => {
    if ((actions && !actions.value) || !handleAction) {
      return;
    }
    if (actions && actions.type) {
      handleAction({
        ...actions,
        name: props.name,
        id: props.id,
        position: cardPosition,
      });
      return;
    }
    // tappable card with no story - CTAs use actions of container card
    handleAction({
      ...cardActions,
      name: props.name,
      id: props.id,
      position: cardPosition,
    });
  };

  const handleActionWithStory = (action: string, actions: Action, story: JSON) => {
    if (story.html && handleAction) {
      handleAction({
        type: 'blog-url',
        value: story.html.link,
        position: cardPosition,
      });
      return;
    } else if (
      action === 'story' ||
      (story && actions && (actions.type === null || actions.type === 'story'))
    ) {
      // go to story card
      return handleStoryAction(story);
    } else if (story && actions && actions.type !== 'story') {
      handleActionNoStory(actions);
      return;
    }
    return null;
  };

  const takeAction = (action: string, actions: Action): void => {
    if (action === 'story' || story) {
      return handleActionWithStory(action, actions, story);
    }
    handleActionNoStory(actions);
  };

  const onButtonPress = () => {
    takeAction(props.action, props.actions);
  };

  return (
    <View style={[styles.buttonContainer, containerStyle]}>
      <TouchableOpacity style={buttonStyle} onPress={onButtonPress} activeOpacity={1}>
        <View style={styles.buttonContents}>
          <Text style={textStyle}>{text}</Text>
          {icon && (
            <Image
              style={[styles.backIcon, icon.iconStyle]}
              source={images[icon.type as keyof typeof images]}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
});

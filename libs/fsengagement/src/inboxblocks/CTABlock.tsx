import React from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { CardContext, EngagementContext } from '../lib/contexts';

import { Action, EmitterProps, Icon, JSON } from '../types';

import rightArrow from '../../assets/images/rightArrow.png';
import rightBlockArrow from '../../assets/images/rightBlockArrow.png';

const images = {
  rightArrow,
  rightBlockArrow,
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
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
  const { buttonStyle, textStyle, containerStyle, icon, localization } = props;
  let { text } = props;
  const { handleAction, cardPosition, language } = React.useContext(EngagementContext);
  const { cardActions, handleStoryAction, story } = React.useContext(CardContext);

  const filterLocalization =
    (localization &&
      localization.find((item) => {
        return item.language === language;
      })) ||
    null;

  if (filterLocalization) {
    text = filterLocalization.value;
  }

  const handleActionNoStory = (actions: Action) => {
    if ((actions && !actions.value) || !handleAction) {
      return;
    }
    if (actions && actions.type) {
      return handleAction({
        ...actions,
        name: props.name,
        id: props.id,
        position: cardPosition,
      });
    }
    // tappable card with no story - CTAs use actions of container card
    return handleAction({
      ...cardActions,
      name: props.name,
      id: props.id,
      position: cardPosition,
    });
  };
  // eslint-disable-next-line complexity
  const handleActionWithStory = (action: string, actions: Action, story: JSON) => {
    if (story.html && handleAction) {
      return handleAction({
        type: 'blog-url',
        value: story.html.link,
        position: cardPosition,
      });
    } else if (
      action === 'story' ||
      (story && actions && (actions.type === null || actions.type === 'story'))
    ) {
      // go to story card
      return handleStoryAction(story);
    } else if (story && actions && actions.type !== 'story') {
      return handleActionNoStory(actions);
    }
    return null;
  };

  const takeAction = (action: string, actions: Action): void => {
    if (action === 'story' || story) {
      return handleActionWithStory(action, actions, story);
    }
    return handleActionNoStory(actions);
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

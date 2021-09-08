import React from 'react';
import {
  DeviceEventEmitter,
  TouchableOpacity,
  View
} from 'react-native';

import {
  Action,
  CardProps,
  JSON
} from '../types';
import { CardContext, EngagementContext } from '../lib/contexts';

export interface ActionsCard extends CardProps {
  actions?: Action;
}

export const Card: React.FunctionComponent<ActionsCard> = React.memo(props => {
  const { handleAction } = React.useContext(EngagementContext);

  const handleStoryAction = async (json: JSON) => {
    DeviceEventEmitter.emit('viewStory', {
      title: props.name,
      id: props.id
    });

    return props.navigator.push({
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
          name: props.name,
          id: props.id
        }
      }
    });
  };

  const onCardPress = async (): Promise<void> => {
    const { actions, story, storyGradient } = props;

    // if there is a story attached and either
    //    1) no actions object (Related)
    //    2) actions.type is null or 'story' (new default tappable cards)
    if (story &&
      (!actions || (actions && (actions.type === null || actions.type === 'story')))
    ) {
      if (story.html) {
        handleAction({
          type: 'blog-url',
          value: story.html.link
        });
      } else {
        return handleStoryAction({
          ...story,
          storyGradient
        });
      }
    } else if (actions && actions.type) {
      handleAction(actions);
    }
  };

  if (props.plainCard) {
    return (
      <CardContext.Provider
        value={{
          story: props.story,
          handleStoryAction,
          cardActions: props.actions,
          id: props.id,
          name: props.name,
          isCard: true
        }}
      >
        <View style={props.containerStyle}>
          {props.children}
        </View>
      </CardContext.Provider>
    );
  }

  return (
    <CardContext.Provider
      value={{
        story: props.story,
        handleStoryAction,
        cardActions: props.actions,
        id: props.id,
        name: props.name,
        isCard: true
      }}
    >
      <TouchableOpacity
        style={props.containerStyle}
        activeOpacity={0.9}
        onPress={onCardPress}
      >
        {props.children}
      </TouchableOpacity>
    </CardContext.Provider>
  );
});

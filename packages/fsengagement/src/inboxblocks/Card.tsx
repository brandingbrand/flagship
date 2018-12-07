import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

export interface ActionsCard extends CardProps {
  actions?: Action;
}

export default class Card extends Component<ActionsCard> {
  static childContextTypes: any = {
    story: PropTypes.object,
    handleStoryAction: PropTypes.func,
    cardActions: PropTypes.object,
    id: PropTypes.string,
    name: PropTypes.string
  };
  static contextTypes: any = {
    handleAction: PropTypes.func
  };

  getChildContext = () => ({
    story: this.props.story,
    handleStoryAction: this.handleStoryAction,
    cardActions: this.props.actions,
    id: this.props.id,
    name: this.props.name
  })

  handleStoryAction = (json: JSON) => {
    DeviceEventEmitter.emit('viewStory', {
      title: this.props.name,
      id: this.props.id
    });
    this.props.api.logEvent('viewInboxStory', {
      messageId: this.props.id
    });
    this.props.navigator.push({
      screen: 'EngagementComp',
      navigatorStyle: {
        navBarHidden: true
      },
      passProps: {
        json,
        backButton: true,
        name: this.props.name,
        id: this.props.id
      }
    });
  }

  onCardPress = (): void => {
    const { handleAction } = this.context;
    const { actions, story, storyGradient } = this.props;

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
        this.handleStoryAction({
          ...story,
          storyGradient
        });
      }
    } else if (actions && actions.type) {
      handleAction(actions);
    }
  }

  render(): JSX.Element {
    const {
      containerStyle,
      plainCard,
      children
    } = this.props;

    if (plainCard) {
      return (
        <View style={containerStyle}>
          {children}
        </View>
      );
    }
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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  DeviceEventEmitter,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

const styles = StyleSheet.create({
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 40,
    marginHorizontal: 25
  },
  fullScreen: {
    width: '100%',
    height: '100%'
  }
});

import {
  Action,
  CardProps,
  JSON
} from '../types';
import TextBlock from './TextBlock';

export interface ImageProp {
  uri: string;
}
export interface FullScreenCardProps extends CardProps {
  actions?: Action;
  contents: any;
  source: ImageProp;
}

export default class FullScreenImageCard extends Component<FullScreenCardProps> {
  static childContextTypes: any = {
    story: PropTypes.object,
    handleStoryAction: PropTypes.func,
    cardActions: PropTypes.object,
    id: PropTypes.string,
    name: PropTypes.string
  };
  static contextTypes: any = {
    handleAction: PropTypes.func,
    language: PropTypes.string
  };

  getChildContext = () => ({
    story: this.props.story,
    handleStoryAction: this.handleStoryAction,
    cardActions: this.props.actions,
    id: this.props.id,
    name: this.props.name
  })

  handleStoryAction = async (json: JSON) => {
    DeviceEventEmitter.emit('viewStory', {
      title: this.props.name,
      id: this.props.id
    });
    this.props.api.logEvent('viewInboxStory', {
      messageId: this.props.id
    });
    return this.props.navigator.push({
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
          language: this.context && this.context.language,
          name: this.props.name,
          id: this.props.id
        }
      }
    });
  }

  onCardPress = async (): Promise<void> => {
    const { handleAction } = this.context;
    const { actions, story, storyGradient } = this.props;

    // if there is a story attached and either
    //    1) no actions object (Related)
    //    2) actions.type is null or 'story' (new default tappable cards)
    if (story &&
      (!actions || (actions && (actions.type === null || actions.type === 'story')))
    ) {
      return this.handleStoryAction({
        ...story,
        storyGradient
      });
    } else if (actions && actions.type) {
      handleAction(actions);
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
        onPress={this.onCardPress}
        activeOpacity={1}
      >
        <ImageBackground source={contents.Image.source} style={styles.fullScreen}>
          <View style={styles.bottom}>
            <TextBlock
              {...contents.Eyebrow}
            />
            <TextBlock
              {...contents.Headline}
            />
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  }
}

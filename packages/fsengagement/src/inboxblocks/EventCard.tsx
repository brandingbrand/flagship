import React, { Component } from 'react';
import {
  DeviceEventEmitter,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import PropTypes from 'prop-types';

import {
  CardProps,
  JSON
} from '../types';

import TextBlock from './TextBlock';
import CTABlock from './CTABlock';
import ImageBlock from './ImageBlock';

const styles = StyleSheet.create({
  whenIcon: {
    width: 10,
    height: 10
  },
  whereIcon: {
    width: 8,
    height: 11
  },
  eventContainer: {
    marginLeft: 50,
    paddingLeft: 100
  },
  eventType: {
    flexDirection: 'row',
    marginVertical: 5
  },
  imageContainer: {
    position: 'absolute',
    left: 30,
    top: 40
  },
  dateRow: {
    width: 12,
    paddingTop: 2,
    alignItems: 'center',
    marginRight: 5
  }

});

export interface ComponentProps extends CardProps {
  contents: any;
}

const whenIcon = require('../../assets/images/whenIcon.png');
const whereIcon = require('../../assets/images/whereIcon.png');

export default class EventCard extends Component<ComponentProps> {

  static childContextTypes: any = {
    story: PropTypes.object,
    handleStoryAction: PropTypes.func
  };

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
        activeOpacity={0.9}
        onPress={this.onCardPress}
      >
        <View style={[containerStyle, styles.eventContainer]}>
          <TextBlock
            {...contents.Title}
          />
          <View style={styles.eventType}>
            <ImageBlock
              source={whenIcon}
              containerStyle={styles.dateRow}
              imageStyle={styles.whenIcon}
            />
            <TextBlock
              {...contents.When}
            />
          </View>
          <View style={styles.eventType}>
            <ImageBlock
              source={whereIcon}
              containerStyle={styles.dateRow}
              imageStyle={styles.whereIcon}
            />
            <TextBlock
              {...contents.Where}
            />
          </View>
          <CTABlock
            {...contents.CTA}
            story={this.props.story}
          />
        </View>
        <View style={styles.imageContainer}>
          <ImageBlock
            {...contents.Image}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

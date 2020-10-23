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
    width: 13,
    height: 13
  },
  timeIcon: {
    width: 14,
    height: 14
  },
  whereIcon: {
    width: 10,
    height: 14
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

const timeIcon = require('../../assets/images/time.png');
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
          {!contents.When.textDate && !contents.When.textTime && (
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
          )}
          {contents.When.textDate && (
            <View style={styles.eventType}>
              <ImageBlock
                source={whenIcon}
                containerStyle={styles.dateRow}
                imageStyle={styles.whenIcon}
              />
              <TextBlock
                {...{ ...contents.When, text: contents.When.textDate }}
              />
            </View>
          )}
          {contents.When.textTime && (
            <View style={styles.eventType}>
              <ImageBlock
                source={timeIcon}
                containerStyle={styles.dateRow}
                imageStyle={styles.timeIcon}
              />
              <TextBlock
                {...{ ...contents.When, text: contents.When.textTime }}
              />
            </View>
          )}

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

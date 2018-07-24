import React, { Component } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View
} from 'react-native';
import PropTypes from 'prop-types';

import {
  InboxBlock,
  InjectedProps
} from '../types';

import TextBlock from './TextBlock';
import CTABlock from './CTABlock';
import ImageBlock from './ImageBlock';

const styles = StyleSheet.create({
  whenIcon: {
    width: 11,
    height: 11
  },
  whereIcon: {
    width: 8,
    height: 11
  },
  eventContainer: {
    flexDirection: 'row',
    marginLeft: -50
  },
  eventType: {
    flexDirection: 'row',
    marginVertical: 5
  },
  eventText: {
    flex: 1,
    marginLeft: 15
  },
  imageContainer: {
    width: 12,
    alignItems: 'center'
  },
  dateRow: {
    width: 12,
    paddingTop: 2,
    alignItems: 'center',
    marginRight: 5
  }

});

export interface ComponentProps extends InjectedProps {
  containerStyle?: StyleProp<TextStyle>;
  story?: InboxBlock;
  contents: any;
}

const whenIcon = require('../../assets/images/whenIcon.png');
const whereIcon = require('../../assets/images/whereIcon.png');

export default class EventCard extends Component<ComponentProps> {

  static childContextTypes: any = {
    story: PropTypes.object
  };

  getChildContext = () => ({
    story: this.props.story
  })

  onCardPress = (): void => {
    const { story } = this.props;
    if (story) {
      this.props.clickHandler(story.messageId, story);
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
        activeOpacity={0.9}
        onPress={this.onCardPress}
      >
        <View style={styles.eventContainer}>
          <ImageBlock
            {...contents.Image}
          />
          <View style={styles.eventText}>
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
        </View>
      </TouchableOpacity>
    );
  }
}

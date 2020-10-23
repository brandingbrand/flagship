import React, { Component } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';

import TextBlock from './TextBlock';
import ImageBlock from './ImageBlock';

const styles = StyleSheet.create({
  eventTitle: {
    fontSize: 13,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 3
  },
  imageContainer: {
    width: 25,
    alignItems: 'center',
    paddingTop: 2
  },
  whenIcon: {
    width: 20,
    height: 20
  },
  whereIcon: {
    width: 16,
    height: 22
  },
  whyIcon: {
    width: 22,
    height: 20
  },
  eventType: {
    flexDirection: 'row',
    marginBottom: 20
  },
  eventText: {
    flex: 1,
    marginLeft: 20
  }
});
export interface EventWhen {
  date: string;
  time: string;
  textDate?: string;
  textTime?: string;
}
export interface EventInfo {
  when: EventWhen;
  where: string;
  why: string;
}

export interface EventBlockProps {
  textStyle?: StyleProp<TextStyle>;
  titleStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  eventInfo: EventInfo;
}

const whenIcon = require('../../assets/images/whenIcon.png');
const whereIcon = require('../../assets/images/whereIcon.png');
const whyIcon = require('../../assets/images/whyIcon.png');

export default class EventBlock extends Component<EventBlockProps> {

  shouldComponentUpdate(nextProps: EventBlockProps): boolean {
    return nextProps.textStyle !== this.props.textStyle ||
      nextProps.titleStyle !== this.props.titleStyle ||
      nextProps.containerStyle !== this.props.containerStyle ||
      nextProps.eventInfo !== this.props.eventInfo;
  }

  render(): JSX.Element {
    const {
      textStyle,
      titleStyle,
      containerStyle,
      eventInfo: {
        when,
        where,
        why
        }
    } = this.props;

    return (
      <View style={containerStyle}>
        <View style={styles.eventType}>
          <ImageBlock
            source={whenIcon}
            containerStyle={styles.imageContainer}
            imageStyle={styles.whenIcon}
          />
          <View style={styles.eventText}>
            <TextBlock
              text='WHEN'
              textStyle={[styles.eventTitle, titleStyle]}
            />
            {!when.textDate && !when.textTime && (
              <TextBlock
                text={when.date + ' | ' + when.time}
                textStyle={textStyle}
              />
            )}
            {when.textDate && (
              <TextBlock
                text={when.textDate}
                textStyle={textStyle}
              />
            )}
            {when.textTime && (
              <TextBlock
                text={when.textTime}
                textStyle={textStyle}
              />
            )}
          </View>
        </View>
        <View style={styles.eventType}>
          <ImageBlock
            source={whereIcon}
            containerStyle={styles.imageContainer}
            imageStyle={styles.whereIcon}
          />
          <View style={styles.eventText}>
            <TextBlock
              text='WHERE'
              textStyle={[styles.eventTitle, titleStyle]}
            />
            <TextBlock
              text={where}
              textStyle={textStyle}
            />
          </View>
        </View>
        <View style={styles.eventType}>
          <ImageBlock
            source={whyIcon}
            containerStyle={styles.imageContainer}
            imageStyle={styles.whyIcon}
          />
          <View style={styles.eventText}>
            <TextBlock
              text='WHY'
              textStyle={[styles.eventTitle, titleStyle]}
            />
            <TextBlock
              text={why}
              textStyle={textStyle}
            />
          </View>
        </View>
      </View>
    );
  }
}

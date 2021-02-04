import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import {
  // boolean,
  object,
  text
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';
import { LinkCard } from '../LinkCard';
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

const defaultTitleStyle: TextStyle = {
  fontWeight: 'bold',
  fontSize: 20,
  lineHeight: 23,
  letterSpacing: 0.5
};

const defaultSubtitleStyle: TextStyle = {
  fontSize: 15,
  lineHeight: 22,
  letterSpacing: 0.5
};

const defaultImageStyle: ImageStyle = {
  marginBottom: 10,
  width: 300,
  height: 130
};

const defaultStyle: ViewStyle = {
  paddingHorizontal: 20,
  paddingBottom: 41,
  paddingTop: 10,
  borderBottomWidth: StyleSheet.hairlineWidth,
  borderBottomColor: '#DBDBDB'
};

storiesOf('LinkCard', module)
  .add('basic usage', () => {
    return (
      <LinkCard
        title={text('Title', 'Promo Title')}
        titleStyle={object('Title Style', defaultTitleStyle)}
        subtitle={text('Subtitle', 'Promo Subtitle')}
        subtitleStyle={object('Subtitle Style', defaultSubtitleStyle)}
        image={object('Image', { uri: 'https://via.placeholder.com/300x130' })}
        imageStyle={object('Image Style', defaultImageStyle)}
        style={object('Style', defaultStyle)}
      />
    );
  });

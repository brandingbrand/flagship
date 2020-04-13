/* tslint:disable:jsx-use-translation-function */
// We don't need to worry about translating the element
// strings in this file since this is mainly a demo

import React from 'react';
import {
  Image,
  Text,
  View
} from 'react-native';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { Accordion } from '../Accordion';
// tslint:disable-next-line:no-implicit-dependencies
import { boolean, number, object, select, text } from '@storybook/addon-knobs';

const icons = {
  closed: require('../../../assets/images/alert.png'),
  open: require('../../../assets/images/checkmarkValidation.png')
};

const renderTitle = (): JSX.Element => {
  return (
    <Text>{text('title', 'Menu Item')}</Text>
  );
};

const renderContent = (): JSX.Element => {
  return(
    <View>
      <Text>Sub Menu Item</Text>
    </View>
  );
};

const renderImageContent = (): JSX.Element => {
  const options = ['cover', 'contain', 'stretch', 'repeat', 'center'];
  return (
    <View>
      <Text>Sub Menu Item</Text>
      <Image
        source={{ uri: text('Image Source', 'https://via.placeholder.com/350x150') }}
        resizeMode={select('Image Resize Mode', options, 'cover') as any}
        style={object('Image Style', { height: 150, width: 350 })}
      />
    </View>
  );
};

storiesOf('Accordion', module)
  .add('basic usage', () => (
    <Accordion
      title={renderTitle()}
      style={object('style', {padding: 10})}
      paddingHorizontal={number('paddingHorizontal?', 15)}
      titleUnderlayColor={text('titleUnderlayColor?', 'transparent')}
      disableAnimation={boolean('disableAnimation?', false)}
      content={renderContent()}
    />
  ))
  .add('w/ image', () => (
    <Accordion
      title={renderTitle()}
      style={object('style', {padding: 10})}
      paddingHorizontal={number('paddingHorizontal?', 15)}
      titleUnderlayColor={text('titleUnderlayColor?', 'transparent')}
      disableAnimation={boolean('disableAnimation?', false)}
      content={renderImageContent()}
    />
  ))
  .add('w/ arrow disclosure icon', () => (
    <Accordion
      title={renderTitle()}
      style={object('style', {padding: 10})}
      paddingHorizontal={number('paddingHorizontal?', 15)}
      titleUnderlayColor={text('titleUnderlayColor?', 'transparent')}
      content={renderContent()}
      iconFormat={select('iconFormat?', ['plusminus', 'arrow'], 'arrow')}
      disableAnimation={boolean('disableAnimation?', false)}
    />
  ))
  .add('w/ custom disclosure icon', () => (
    <Accordion
      title={renderTitle()}
      style={object('style', {padding: 10})}
      paddingHorizontal={number('paddingHorizontal?', 15)}
      titleUnderlayColor={text('titleUnderlayColor?', 'transparent')}
      content={renderContent()}
      iconFormat={select('iconFormat?', ['image', 'plusminus', 'arrow'], 'image')}
      disableAnimation={boolean('disableAnimation?', false)}
      openIconImage={icons.open}
      closedIconImage={icons.closed}
    />
  ));

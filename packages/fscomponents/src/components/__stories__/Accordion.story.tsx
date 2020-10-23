/* tslint:disable:jsx-use-translation-function */
// We don't need to worry about translating the element
// strings in this file since this is mainly a demo

import React from 'react';
import {
  Image,
  ImageURISource,
  Text,
  View
} from 'react-native';
import {
  boolean,
  number,
  object,
  select,
  text
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { Accordion } from '../Accordion';

const icons: Record<string, ImageURISource> = {
  closed: require('../../../assets/images/alert.png'),
  open: require('../../../assets/images/checkmarkValidation.png')
};

const content = (
  <View>
    <Text>Sub Menu Item</Text>
  </View>
);

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
      title={text('title', 'Menu Item')}
      style={object('style', {padding: 10})}
      paddingHorizontal={number('paddingHorizontal?', 15)}
      titleUnderlayColor={text('titleUnderlayColor?', 'transparent')}
      disableAnimation={boolean('disableAnimation?', false)}
      content={content}
    />
  ))
  .add('w/ image', () => (
    <Accordion
      title={text('title', 'Menu Item')}
      style={object('style', {padding: 10})}
      paddingHorizontal={number('paddingHorizontal?', 15)}
      titleUnderlayColor={text('titleUnderlayColor?', 'transparent')}
      disableAnimation={boolean('disableAnimation?', false)}
      content={renderImageContent()}
    />
  ))
  .add('w/ arrow or plusminus disclosure icon', () => (
    <Accordion
      title={text('title', 'Menu Item')}
      style={object('style', {padding: 10})}
      paddingHorizontal={number('paddingHorizontal?', 15)}
      titleUnderlayColor={text('titleUnderlayColor?', 'transparent')}
      content={content}
      iconFormat={select('iconFormat?', ['plusminus', 'arrow'], 'arrow')}
      disableAnimation={boolean('disableAnimation?', false)}
    />
  ))
  .add('w/ custom disclosure icon', () => (
    <Accordion
      title={text('title', 'Menu Item')}
      style={object('style', {padding: 10})}
      paddingHorizontal={number('paddingHorizontal?', 15)}
      titleUnderlayColor={text('titleUnderlayColor?', 'transparent')}
      content={content}
      iconFormat={'image'}
      disableAnimation={boolean('disableAnimation?', false)}
      openIconImage={icons[select('Open Icon', Object.keys(icons), 'open')]}
      closedIconImage={icons[select('Closed Icon', Object.keys(icons), 'closed')]}
    />
  ))
  .add('nested as a child with a string title', () => (
    <Accordion
      title={text('Parent title', 'Parent')}
      style={object('Parent style', {padding: 5})}
      paddingHorizontal={number('Parent paddingHorizontal?', 0)}
      titleUnderlayColor={text('Parent titleUnderlayColor?', 'transparent')}
      state={'open'}
    >
      <Accordion
        title={text('Child title', 'Menu Item')}
        style={object('Child style', {padding: 5})}
        paddingHorizontal={number('Child paddingHorizontal?', 0)}
        titleUnderlayColor={text('Child titleUnderlayColor?', 'transparent')}
        content={content}
      />
    </Accordion>
  ));

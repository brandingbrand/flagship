// We don't need to worry about translating the element
// strings in this file since this is mainly a demo

import React from 'react';

import type { ImageRequireSource } from 'react-native';
import { Image, Text, View } from 'react-native';

import { boolean, number, object, select, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import closed from '../assets/images/alert.png';
import open from '../assets/images/checkmarkValidation.png';
import { Accordion } from '../src/components/Accordion';

const icons: Record<string, ImageRequireSource> = {
  closed,
  open,
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
        resizeMode={select('Image Resize Mode', options, 'cover') as any}
        source={{ uri: text('Image Source', 'https://via.placeholder.com/350x150') }}
        style={object('Image Style', { height: 150, width: 350 })}
      />
    </View>
  );
};

storiesOf('Accordion', module)
  .add('basic usage', () => (
    <Accordion
      content={content}
      disableAnimation={boolean('disableAnimation?', false)}
      paddingHorizontal={number('paddingHorizontal?', 15)}
      style={object('style', { padding: 10 })}
      title={text('title', 'Menu Item')}
      titleUnderlayColor={text('titleUnderlayColor?', 'transparent')}
    />
  ))
  .add('w/ image', () => (
    <Accordion
      content={renderImageContent()}
      disableAnimation={boolean('disableAnimation?', false)}
      paddingHorizontal={number('paddingHorizontal?', 15)}
      style={object('style', { padding: 10 })}
      title={text('title', 'Menu Item')}
      titleUnderlayColor={text('titleUnderlayColor?', 'transparent')}
    />
  ))
  .add('w/ arrow or plusminus disclosure icon', () => (
    <Accordion
      content={content}
      disableAnimation={boolean('disableAnimation?', false)}
      iconFormat={select('iconFormat?', ['plusminus', 'arrow'], 'arrow')}
      paddingHorizontal={number('paddingHorizontal?', 15)}
      style={object('style', { padding: 10 })}
      title={text('title', 'Menu Item')}
      titleUnderlayColor={text('titleUnderlayColor?', 'transparent')}
    />
  ))
  .add('w/ custom disclosure icon', () => (
    <Accordion
      closedIconImage={icons[select('Closed Icon', Object.keys(icons), 'closed')]}
      content={content}
      disableAnimation={boolean('disableAnimation?', false)}
      iconFormat="image"
      openIconImage={icons[select('Open Icon', Object.keys(icons), 'open')]}
      paddingHorizontal={number('paddingHorizontal?', 15)}
      style={object('style', { padding: 10 })}
      title={text('title', 'Menu Item')}
      titleUnderlayColor={text('titleUnderlayColor?', 'transparent')}
    />
  ))
  .add('nested as a child with a string title', () => (
    <Accordion
      paddingHorizontal={number('Parent paddingHorizontal?', 0)}
      state="open"
      style={object('Parent style', { padding: 5 })}
      title={text('Parent title', 'Parent')}
      titleUnderlayColor={text('Parent titleUnderlayColor?', 'transparent')}
    >
      <Accordion
        content={content}
        paddingHorizontal={number('Child paddingHorizontal?', 0)}
        style={object('Child style', { padding: 5 })}
        title={text('Child title', 'Menu Item')}
        titleUnderlayColor={text('Child titleUnderlayColor?', 'transparent')}
      />
    </Accordion>
  ));

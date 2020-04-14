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
  select,
  text
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { Accordion } from '../Accordion';

const title = <Text>Menu Item</Text>;

const icons: Record<string, ImageURISource> = {
  closed: require('../../../assets/images/alert.png'),
  open: require('../../../assets/images/checkmarkValidation.png')
};

const content = (
  <View>
    <Text>Sub Menu Item</Text>
  </View>
);

const imageContent = (
  <View>
    <Text>Sub Menu Item</Text>
    <Image
      resizeMode='contain'
      source={{ uri: 'https://via.placeholder.com/350x150' }}
      style={{ height: 150, width: 350 }}
    />
  </View>
);

storiesOf('Accordion', module)
  .add('basic usage', () => (
    <Accordion
      title={title}
      content={content}
    />
  ))
  .add('w/ image', () => (
    <Accordion
      title={title}
      content={imageContent}
    />
  ))
  .add('w/ arrow or plusminus disclosure icon', () => (
    <Accordion
      title={title}
      content={content}
      iconFormat={select('Format', ['arrow', 'plusminus'], 'arrow')}
    />
  ))
  .add('w/ custom disclosure icon', () => (
    <Accordion
      title={title}
      content={content}
      iconFormat={'image'}
      openIconImage={icons[select('Open Icon', Object.keys(icons), 'open')]}
      closedIconImage={icons[select('Closed Icon', Object.keys(icons), 'closed')]}
    />
  ))
  .add('nested as a child with a string title', () => (
    <Accordion
      title={text('Parent title', 'Parent')}
      state={'open'}
    >
      <Accordion
        title={title}
        content={content}
        paddingHorizontal={0}
      />
    </Accordion>
  ));

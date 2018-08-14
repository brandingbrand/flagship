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

const title = <Text>Menu Item</Text>;

const icons = {
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
  .add('w/ arrow disclosure icon', () => (
    <Accordion
      title={title}
      content={content}
      iconFormat={'arrow'}
    />
  ))
  .add('w/ custom disclosure icon', () => (
    <Accordion
      title={title}
      content={content}
      iconFormat={'image'}
      openIconImage={icons.open}
      closedIconImage={icons.closed}
    />
  ));

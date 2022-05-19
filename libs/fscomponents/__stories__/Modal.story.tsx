// We don't need to worry about translating the element
// strings in this file since this is mainly a demo

import React from 'react';

import { Text } from 'react-native';

import { boolean, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { Modal } from '../src/components/Modal';

storiesOf('Modal', module).add('basic usage', () => (
  <Modal
    animationType={select('animationType', ['none', 'slide', 'fade'], 'none')}
    visible={boolean('visible', true)}
  >
    <Text>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus fuga recusandae cum. Ducimus
      soluta possimus vel harum earum laborum quae quis dolore, quidem officiis incidunt consequatur
      est quam minus neque.
    </Text>
  </Modal>
));

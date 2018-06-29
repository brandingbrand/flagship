/* tslint:disable:jsx-use-translation-function */
// We don't need to worry about translating the element
// strings in this file since this is mainly a demo

import React from 'react';
import { Text } from 'react-native';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import {
  boolean
// tslint:disable-next-line no-submodule-imports no-implicit-dependencies
} from '@storybook/addon-knobs/react';
import { Modal } from '../Modal';

storiesOf('Modal', module)
  .add('basic usage', () => (
    <Modal
      visible={boolean('visible', true)}
    >
      <Text>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus fuga recusandae cum.
        Ducimus soluta possimus vel harum earum laborum quae quis dolore, quidem officiis incidunt
        consequatur est quam minus neque.
      </Text>
    </Modal>
  ));

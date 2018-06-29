import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  object,
  text
// tslint:disable-next-line no-submodule-imports no-implicit-dependencies
} from '@storybook/addon-knobs/react';
import { Button } from '../Button';

const defaultStyle = {
  width: 250
};

storiesOf('Button', module)
  .add('basic usage', () => (
    <Button
      onPress={action('onPress')}
      title={text('Title', 'Button Title')}
      style={object('Style', defaultStyle)}
    />
  ));

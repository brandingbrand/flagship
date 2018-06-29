import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  boolean,
  text
// tslint:disable-next-line no-submodule-imports no-implicit-dependencies
} from '@storybook/addon-knobs/react';
import { Breadcrumbs } from '../Breadcrumbs';

const crumbs = [
  {
    title: 'First item',
    onPress: action('First item')
  },
  {
    title: 'Second item',
    onPress: action('Second item')
  },
  {
    title: 'Third item',
    onPress: action('Third item')
  },
  {
    title: 'Fourth item',
    onPress: action('Fourth item')
  },
  {
    title: 'Fifth item'
  }
];

storiesOf('Breadcrumbs', module)
  .add('basic usage', () => (
    <Breadcrumbs
      items={crumbs}
      separator={text('separator', '•')}
      showTrailingSeparator={boolean('showTrailingSeparator', false)}
    />
  ));

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { Breadcrumbs } from '../src/components/Breadcrumbs';

const crumbs = [
  {
    title: 'First item',
    onPress: action('First item'),
  },
  {
    title: 'Second item',
    onPress: action('Second item'),
  },
  {
    title: 'Third item',
    onPress: action('Third item'),
  },
  {
    title: 'Fourth item',
    onPress: action('Fourth item'),
  },
  {
    title: 'Fifth item',
  },
];

storiesOf('Breadcrumbs', module).add('basic usage', () => (
  <Breadcrumbs
    items={crumbs}
    separator={text('separator', '•')}
    showTrailingSeparator={boolean('showTrailingSeparator', false)}
  />
));

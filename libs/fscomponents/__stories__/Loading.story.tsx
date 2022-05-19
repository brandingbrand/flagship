import React from 'react';

import { object } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { Loading } from '../src/components/Loading';

const defaultStyle = {
  padding: 20,
};

storiesOf('Loading', module).add('basic usage', () => (
  <Loading style={object('style', defaultStyle)} />
));

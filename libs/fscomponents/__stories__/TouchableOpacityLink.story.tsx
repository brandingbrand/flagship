import React from 'react';

import { Text } from 'react-native';

import { action } from '@storybook/addon-actions';
import { object, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { TouchableOpacityLink } from '../src/components/TouchableOpacityLink';

const defaultStyle = {
  color: 'blue',
  textDecoration: 'underline',
};

storiesOf('TouchableOpacityLink', module).add('basic usage', () => (
  <TouchableOpacityLink
    href="/"
    onPress={action('TouchableOpacityLink onPress')}
    style={{ padding: 10 }}
  >
    <Text style={object('style', defaultStyle)}>{text('Link Text', 'Link')}</Text>
  </TouchableOpacityLink>
));

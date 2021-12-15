import React from 'react';
import { Text } from 'react-native';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { object, text } from '@storybook/addon-knobs';
import { TouchableOpacityLink } from '../src/components/TouchableOpacityLink';

const defaultStyle = {
  color: 'blue',
  textDecoration: 'underline',
};

storiesOf('TouchableOpacityLink', module).add('basic usage', () => (
  <TouchableOpacityLink
    href="/"
    style={{ padding: 10 }}
    onPress={action('TouchableOpacityLink onPress')}
  >
    <Text style={object('style', defaultStyle)}>{text('Link Text', 'Link')}</Text>
  </TouchableOpacityLink>
));

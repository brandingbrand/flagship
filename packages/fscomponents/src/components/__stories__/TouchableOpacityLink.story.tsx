import React from 'react';
import { Text } from 'react-native';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  object,
  text
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';
import { TouchableOpacityLink } from '../TouchableOpacityLink';

const defaultStyle = {
  color: 'blue',
  textDecoration: 'underline'
};

storiesOf('TouchableOpacityLink', module)
  .add('basic usage', () => (
    <TouchableOpacityLink
      href='/'
      style={{ padding: 10 }}
      onPress={action('TouchableOpacityLink onPress')}
    >
      <Text style={object('style', defaultStyle)}>{text('Link Text', 'Link')}</Text>
    </TouchableOpacityLink>
  ));

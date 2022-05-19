import React from 'react';

import { Text, View } from 'react-native';

import { boolean, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { TooltipDisplay } from '../src/components/TooltipDisplay';

storiesOf('TooltipDisplay', module).add('basic usage', () => (
  <View>
    <View>
      <Text>Attached Text</Text>
    </View>
    <View>
      <TooltipDisplay
        positionX={select('Position X', ['left', 'right', 'center'], 'left')}
        positionY={select('Position Y', ['top', 'bottom'], 'top')}
        show={boolean('Show', true)}
        style={{
          marginTop: 10,
        }}
      >
        Tooltip Text
      </TooltipDisplay>
    </View>
  </View>
));

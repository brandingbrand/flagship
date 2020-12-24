import React from 'react';
import { Text, View } from 'react-native';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import {
  boolean,
  select
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';
import { TooltipDisplay } from '../TooltipDisplay';

storiesOf('TooltipDisplay', module)
  .add('basic usage', () => (
    <View>
      <View>
        {/* tslint:disable-next-line: jsx-use-translation-function */}
        <Text>Attached Text</Text>
      </View>
      <View>
        <TooltipDisplay
          positionX={select('Position X', ['left', 'right', 'center'], 'left')}
          positionY={select('Position Y', ['top', 'bottom'], 'top')}
          show={boolean('Show', true)}
          style={{
            marginTop: 10
          }}
        >
          {/* tslint:disable-next-line: jsx-use-translation-function */}
          Tooltip Text
        </TooltipDisplay>
      </View>
    </View>
  ));

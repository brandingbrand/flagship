import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  boolean,
  text
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';

import { CTABlock } from '../src/inboxblocks/CTABlock';
import { Action } from '../src/types';
import ActionContext from './assets/ActionContext';

const submitAction = action('submit');

const WrapperContext = ActionContext((actions: Action) => {
  submitAction(actions);
}, {
  html: {
    link: text('Story Link', 'test.html')
  }
});

storiesOf('Engagement CTABlock', module)
  .add('basic usage', () => (
    <WrapperContext>
      <CTABlock
        action={boolean('Is Story', false) ? 'story' : 'click'}
        actions={{
          type: 'actionType',
          value: text('actionValue', 'click')
        }}
        text={text('buttonText', 'Submit')}
      />
    </WrapperContext>
  ));

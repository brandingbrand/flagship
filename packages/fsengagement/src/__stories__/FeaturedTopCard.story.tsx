import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  boolean,
  text
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';

import FeaturedTopCard from '../inboxblocks/FeaturedTopCard';
import { Text } from 'react-native';
import { Navigator } from '@brandingbrand/fsapp';
import { Action } from '../types';
import ActionContext from './assets/ActionContext';

const submitAction = action('submit');
const pushAction = action('push');
const WrapperContext = ActionContext((actions: Action) => {
  submitAction(actions);
});

// tslint:disable-next-line: no-object-literal-type-assertion
const navigator: Navigator = {
  push: (params: any) => {
    pushAction(params);
  }
} as Navigator;

storiesOf('Engagement FeaturedTopCard', module)
  .add('basic usage', () => (
    <WrapperContext>
      <FeaturedTopCard
        private_blocks={[]}
        navigator={navigator}
        contents={{
          Image: {
            source: {
              uri: ''
            }
          },
          Text: {
            text: text('Card Text', 'TestText')
          },
          CTA: {
            action: text('Card Action Event', 'Test'),
            text: text('Card Action Text', 'Test'),
            actions: {
              type: boolean('Is Story', false) ? 'story' : 'click',
              value: text('actionValue', 'click')
            }
          }
        }}
        story={{
          html: {
            link: text('Story Link', 'test.html'),
            body: '',
            iframe: '',
            image: {
              private_type: 'image'
            },
            title: {
              private_type: 'title'
            }
          },
          private_type: 'story'
        }}
      >
        <Text>{text('Card Text', 'Card Text')}</Text>
      </FeaturedTopCard>
    </WrapperContext>
  ));

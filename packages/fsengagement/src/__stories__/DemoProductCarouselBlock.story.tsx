import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  text
// tslint:disable-next-line no-submodule-imports no-implicit-dependencies
} from '@storybook/addon-knobs';

import DemoProductCarouselBlock from '../inboxblocks/DemoProductCarouselBlock';
import { Navigator } from '@brandingbrand/fsapp';

const share = require('../../assets/images/share-icn.png');

const showModalAction = action('show modal');
const pushAction = action('push');

// tslint:disable-next-line: no-object-literal-type-assertion
const navigator: Navigator = {
  push: (params: any) => {
    pushAction(params);
  },
  showModal: (params: any) => {
    showModalAction(params);
  }
} as Navigator;

storiesOf('Engagement DemoProductCarouselBlock', module)
  .add('basic usage', () => (
    <DemoProductCarouselBlock
      navigator={navigator}
      items={[{
        title: text('Title', 'product'),
        image: {
          source: share,
          ratio: 1
        },
        price: text('Price', '$1')
      }]}
      options={{
        itemWidthPercent: 30,
        itemHorizontalPaddingPercent: 10
      }}
      containerStyle={{
        width: '100%'
      }}
    />
  ));

import React from 'react';
import {
  text
// tslint:disable-next-line no-submodule-imports no-implicit-dependencies
} from '@storybook/addon-knobs/react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { ShareButton } from '../ShareButton/ShareButton';

storiesOf('ShareButton', module)
  .add('basic usage', () => (
    <ShareButton
      content={{
        title: text('Share Text', 'Test Share Text'),
        url: text('Share URL', 'https://brandingbrand.github.io/flagship/storybook')
      }}
    />
  ));

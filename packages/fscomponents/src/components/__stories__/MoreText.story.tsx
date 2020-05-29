import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import {
  number,
  select,
  text
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';
import { FormatType, MoreText } from '../MoreText';

const lorem = 'here are many variations of passages of Lorem Ipsum available, but the majority \
have suffered alteration in some form, by injected humour, or randomised words which do not look \
even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be \
sure there is not anything embarrassing hidden in the middle of text. All the Lorem Ipsum \
generators on the Internet tend to repeat predefined chunks as necessary, making this the \
first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined \
with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. \
The generated Lorem Ipsum is therefore always free from repetition, injected humour, or \
non-characteristic words etc.';

const formatOptions = ['outward', 'inward'];

storiesOf('MoreText', module)
  .add('basic usage', () => (
    <MoreText
      numberOfCharacters={number('numberOfCharacters', 105)}
      text={text('text', lorem)}
      format={select('format', formatOptions, 'outward') as FormatType}
      textMore={text('textMore', 'Read More')}
      textLess={text('textLess', 'Read Less')}
    />
  ));

import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  boolean,
  number,
  text
// tslint:disable-next-line no-submodule-imports no-implicit-dependencies
} from '@storybook/addon-knobs/react';
import { ReviewItem } from '../ReviewItem';

const review = {
  user: 'SenseSeeker',
  created: 'October 17, 2017',
  title: 'This blender is a Powerful Machine at 1200 Watts',
  text: 'Makes no sense to spend megabucks on a Ninja or NutriBullet Rx. This machine will do the\
  job for much less. There is a difference in this machine in that the base of the jar is larger\
  than its predecessors. The other Osters will fit a canning jar on the base and also have many\
  accessories that can be purchased here on Amazon. I contacted Oster and asked them if they will\
  be coming out with a food processor attachment for this. I would think that they will soon. I\
  chose this model because of the power and also it is just a little shorter in height and fits\
  well under my kitchen cabinets. Crushes ice perfectly, and makes great smoothies.'
};

storiesOf('ReviewItem', module)
  .add('basic usage', () => (
    <ReviewItem
      rating={number('value', 2.4)}
      user={text('user', review.user)}
      title={text('title', review.title)}
      text={text('text', review.text)}
      created={text('created', review.created)}
      helpful={number('helpful', 214)}
      verified={boolean('verified', true)}
      onHelpful={action('ReviewItem onHelpful')}
      onNotHelpful={action('ReviewItem onNotHelpful')}
    />
  ));

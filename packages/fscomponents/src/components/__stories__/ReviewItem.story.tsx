import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  number,
  object,
  text
// tslint:disable-next-line no-submodule-imports no-implicit-dependencies
} from '@storybook/addon-knobs/react';
import { ReviewItem } from '../ReviewItem';

const review: import ('@brandingbrand/fscommerce').ReviewTypes.Review = {
  user: {
    name: 'SenseSeeker'
  },
  rating: 2.4,
  created: 'October 17, 2017',
  title: 'This blender is a Powerful Machine at 1200 Watts',
  text: 'Makes no sense to spend megabucks on a Ninja or NutriBullet Rx. This machine will do the\
  job for much less. There is a difference in this machine in that the base of the jar is larger\
  than its predecessors. The other Osters will fit a canning jar on the base and also have many\
  accessories that can be purchased here on Amazon. I contacted Oster and asked them if they will\
  be coming out with a food processor attachment for this. I would think that they will soon. I\
  chose this model because of the power and also it is just a little shorter in height and fits\
  well under my kitchen cabinets. Crushes ice perfectly, and makes great smoothies.',
  feedback: {
    total: 214,
    positive: 214,
    negative: 0
  }
};

storiesOf('ReviewItem', module)
  .add('basic usage', () => (
    <ReviewItem
      rating={number('value', review.rating)}
      user={object('user', review.user)}
      title={text('title', review.title)}
      text={text('text', review.text || '')}
      created={text('created', review.created)}
      feedback={object('feedback', review.feedback)}
      onHelpful={action('ReviewItem onHelpful')}
      onNotHelpful={action('ReviewItem onNotHelpful')}
    />
  ));

import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import { ReviewsList } from '../ReviewsList';

const reviews: import ('@brandingbrand/fscommerce').ReviewTypes.Review[] = [
  {
    rating: 5.2,
    title: 'Review Title',
    text: 'Review Text'
  },
  {
    rating: 1.5,
    title: 'This blender is a Powerful Machine at 1200 Watts',
    text: 'Makes no sense to spend megabucks on a Ninja or NutriBullet Rx. This machine will do the\
    job for much less. There is a difference in this machine in that the base of the jar is larger\
    than its predecessors.'
  },
  {
    rating: 3.4,
    created: 'October 17, 2017',
    title: 'This blender is a Powerful Machine at 1200 Watts',
    text: 'Makes no sense to spend megabucks on a Ninja or NutriBullet Rx. This machine will do the\
    job for much less. There is a difference in this machine in that the base of the jar is larger\
    than its predecessors. The other Osters will fit a canning jar on the base and also have many\
    accessories that can be purchased here on Amazon. I contacted Oster and asked them if they will\
    be coming out with a food processor attachment for this. I would think that they will soon. I\
    chose this model because of the power and also it is just a little shorter in height and fits\
    well under my kitchen cabinets. Crushes ice perfectly, and makes great smoothies.',
    user: {
      name: 'SenseSeeker',
      isVerifiedBuyer: true
    },
    feedback: {
      total: 189,
      positive: 189,
      negative: 0
    }
  }
];

storiesOf('ReviewsList', module)
  .add('basic usage', () => (
    <ReviewsList
      reviews={reviews}
      onHelpful={action('ReviewsList onHelpful')}
      onNotHelpful={action('ReviewsList onNotHelpful')}
    />
  ));

import { addDecorator, addParameters } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { configureActions } from '@storybook/addon-actions';

// Add knobs to all stories
addDecorator(withKnobs);

// Default viewport
addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: 'iphonex',
  },
});

configureActions({
  depth: 1
});

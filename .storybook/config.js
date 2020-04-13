import React from 'react';
import { View } from 'react-native';
import { addDecorator, addParameters, configure } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

// Add knobs to all stories
addDecorator(withKnobs);

// Default viewport
addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: 'iphonex',
  },
});

function loadStories() {
  const req = require.context('../packages', true, /\/__stories__\/.*\.(story|stories)\.tsx?$/);
  req.keys().forEach(file => req(file));
}

configure(loadStories, module);

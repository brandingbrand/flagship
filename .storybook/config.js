import React from 'react';
import { View } from 'react-native';
import { configure, addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs/react';
import { configureViewport, INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

// Add knobs to all stories
addDecorator(withKnobs);

// Default viewport
configureViewport({
  defaultViewport: 'iphone6',
  viewports: INITIAL_VIEWPORTS
});

function loadStories() {
  const req = require.context('../packages', true, /\/__stories__\/.*\.(story|stories)\.tsx?$/);
  req.keys().forEach(file => req(file));
}

configure(loadStories, module);

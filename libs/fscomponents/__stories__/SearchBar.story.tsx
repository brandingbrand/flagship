import React from 'react';

import { View } from 'react-native';

import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { SearchBar } from '../src/components/SearchBar';

import locate from './assets/images/locate.png';
import search from './assets/images/search.png';

const icons = {
  search,
  locate,
};

storiesOf('SearchBar', module).add('basic usage', () => (
  <View style={{ flex: 1 }}>
    <SearchBar
      locateIcon={icons.locate}
      onFocus={action('SearchBar onFocus')}
      onSubmit={action('SearchBar onSubmit')}
      placeholder={text('placeholder', 'Search by City, State, or Zip')}
      searchIcon={icons.search}
      showCancel={boolean('showCancel', false)}
      showLocator={boolean('showLocator', true)}
      showSearchIcon={boolean('showSearchIcon', true)}
    />
  </View>
));

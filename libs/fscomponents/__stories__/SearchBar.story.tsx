import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { SearchBar } from '../src/components/SearchBar';

import search from './assets/images/search.png';
import locate from './assets/images/locate.png';

const icons = {
  search,
  locate,
};

storiesOf('SearchBar', module).add('basic usage', () => (
  <View style={{ flex: 1 }}>
    <SearchBar
      placeholder={text('placeholder', 'Search by City, State, or Zip')}
      showLocator={boolean('showLocator', true)}
      locateIcon={icons.locate}
      showCancel={boolean('showCancel', false)}
      showSearchIcon={boolean('showSearchIcon', true)}
      searchIcon={icons.search}
      onSubmit={action('SearchBar onSubmit')}
      onFocus={action('SearchBar onFocus')}
    />
  </View>
));

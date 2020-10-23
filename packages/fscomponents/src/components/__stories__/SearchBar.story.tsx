import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  boolean,
  text
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';
import { SearchBar } from '../SearchBar';

const icons = {
  search: require('./assets/images/search.png'),
  locate: require('./assets/images/locate.png')
};

storiesOf('SearchBar', module)
  .add('basic usage', () => (
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

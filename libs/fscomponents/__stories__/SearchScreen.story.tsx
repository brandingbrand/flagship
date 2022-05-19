import React from 'react';

import { Text, View } from 'react-native';

import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { SearchScreen } from '../src/components/SearchScreen';

const onClose = () => {
  console.log('CLOSE');
};

const renderContentUnderSearchBar = () => (
  <View>
    <Text>{text('title', 'This is Content Under SearchBar')}</Text>
  </View>
);

const searchBarProps = {
  inputTextStyle: {
    color: 'red',
  },
  containerStyle: {
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 20,
  },
};

const renderCategoryLine = (): JSX.Element => <SearchScreen onClose={onClose} />;

const renderCustomCategoryLine = (): JSX.Element => (
  <SearchScreen
    onClose={onClose}
    renderContentUnderSearchBar={renderContentUnderSearchBar}
    searchBarProps={searchBarProps}
  />
);

storiesOf('SearchScreen', module)
  .add('basic usage', renderCategoryLine)
  .add('custom usage', renderCustomCategoryLine);

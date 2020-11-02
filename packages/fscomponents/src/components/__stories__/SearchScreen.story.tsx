import React from 'react';

import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies

import { SearchScreen } from '../SearchScreen';
import { Text, View } from 'react-native';
import { text } from '@storybook/addon-knobs'; // tslint:disable-line:no-implicit-dependencies


const onClose = () => {
  console.log('CLOSE');
};

const renderContentUnderSearchBar = () => {
  return (
    <View>
      <Text>{text('title', 'This is Content Under SearchBar')}</Text>
    </View>
  );
};

const searchBarProps = {
  inputTextStyle: {
    color: 'red'
  },
  containerStyle: {
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 20
  }
};

const renderCategoryLine = (): JSX.Element => {
  return (
    <SearchScreen onClose={onClose}/>
  );
};

const renderCustomCategoryLine = (): JSX.Element => {
  return (
    <SearchScreen
      onClose={onClose}
      searchBarProps={searchBarProps}
      renderContentUnderSearchBar={renderContentUnderSearchBar}
    />
  );
};

storiesOf('SearchScreen', module).
add('basic usage', renderCategoryLine).
add('custom usage', renderCustomCategoryLine);

// We don't need to worry about translating the element
// strings in this file since this is mainly a demo

import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { TabbedContainer } from '../src/components/TabbedContainer';

const styles = StyleSheet.create({
  activeTab: {
    borderBottomColor: 'coral',
  },
  activeTabText: {
    fontWeight: 'bold',
  },
  content: {
    paddingTop: 10,
  },
  tab: {
    borderBottomColor: 'rgba(0,0,0,0)',
    borderBottomWidth: 5,
    padding: 3,
  },
  tabText: {
    textAlign: 'center',
  },
});

storiesOf('TabbedContainer', module).add('basic usage', () => {
  const displaySwitchedTab = (index: number) => {
    console.log(index);
  };

  const tabs = [...new Array(number('itemsCount', 2))].map((x, i) => ({
    tab: (
      <View style={styles.tab}>
        <Text style={styles.tabText}>{`Tab ${i + 1}`}</Text>
      </View>
    ),
    activeTab: (
      <View style={[styles.tab, styles.activeTab]}>
        <Text style={[styles.tabText, styles.activeTabText]}>{`Tab ${i + 1}`}</Text>
      </View>
    ),
    renderContent: () => (
      <View style={styles.content}>
        <Text>{`Tab ${i + 1} Content`}</Text>
      </View>
    ),
  }));
  return <TabbedContainer onTabSwitch={displaySwitchedTab} tabs={tabs} />;
});

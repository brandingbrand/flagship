/* tslint:disable:jsx-use-translation-function */
// We don't need to worry about translating the element
// strings in this file since this is mainly a demo

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { TabbedContainer } from '../TabbedContainer';

const styles = StyleSheet.create({
  tab: {
    padding: 3,
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(0,0,0,0)'
  },
  activeTab: {
    borderBottomColor: 'coral'
  },
  tabText: {
    textAlign: 'center'
  },
  activeTabText: {
    fontWeight: 'bold'
  },
  content: {
    paddingTop: 10
  }
});

const tabs = [
  {
    tab: (
      <View style={styles.tab}>
        <Text style={styles.tabText}>Tab 1</Text>
      </View>
    ),
    activeTab: (
      <View style={[styles.tab, styles.activeTab]}>
        <Text style={[styles.tabText, styles.activeTabText]}>Tab 1</Text>
      </View>
    ),
    renderContent: () => {
      return (
        <View style={styles.content}>
          <Text>Tab 1 Content</Text>
        </View>
      );
    }
  }, {
    tab: (
      <View style={styles.tab}>
        <Text style={styles.tabText}>Tab 2</Text>
      </View>
    ),
    activeTab: (
      <View style={[styles.tab, styles.activeTab]}>
        <Text style={[styles.tabText, styles.activeTabText]}>Tab 2</Text>
      </View>
    ),
    renderContent: () => {
      return (
        <View style={styles.content}>
          <Text>Tab 2 Content</Text>
        </View>
      );
    }
  }
];

storiesOf('TabbedContainer', module)
  .add('basic usage', () => (
    <TabbedContainer
      tabs={tabs}
    />
  ));

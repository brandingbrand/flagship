import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {env} from '@brandingbrand/fsapp';

import {makeScreen, makeTab} from '../../../shared';

export default makeTab(
  makeScreen(
    function ProfileRoute({componentId}) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Roboto</Text>
          <Text style={styles.paragraph}>Welcome to the Profile tab!</Text>
          <Text style={styles.paragraph}>Route: {componentId}</Text>
          <Text style={styles.paragraph}>{JSON.stringify(env.app)}</Text>
        </View>
      );
    },
    {topBarStyle: {visible: false}, path: 'profile', exact: true},
    {},
  ),
  {
    tab: {
      id: 'PROFILE_TAB',
      text: 'Profile',
    },
  },
);

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 36,
    marginVertical: 20,
    textAlign: 'center',
  },
  paragraph: {
    paddingHorizontal: 12,
    fontFamily: 'Roboto-Light',
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
    color: 'grey',
  },
});

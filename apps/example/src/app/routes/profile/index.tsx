import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {makeScreen, makeTab} from '../../../shared';

export default makeTab(
  makeScreen(
    function ProfileRoute({componentId}) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.paragraph}>Welcome to the Profile tab!</Text>
          <Text style={styles.paragraph}>Route: {componentId}</Text>
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
    fontSize: 36,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    fontWeight: '300',
    marginVertical: 10,
    textAlign: 'center',
    color: 'grey',
  },
});

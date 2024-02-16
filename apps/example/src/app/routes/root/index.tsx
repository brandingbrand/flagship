import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {env} from '@brandingbrand/fsapp';

import {makeScreen, makeTab} from '../../../shared';
import {RequestCameraButton} from '../../../features/root/requestCamera';

export default makeTab(
  makeScreen(
    function RootRoute({componentId}) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Roboto</Text>
          <Text style={styles.paragraph}>Welcome to the Root tab!</Text>
          <Text style={styles.paragraph}>Route: {componentId}</Text>
          <Text style={styles.paragraph}>{JSON.stringify(env.app)}</Text>
          <RequestCameraButton />
        </View>
      );
    },
    {topBarStyle: {visible: false}, path: 'root', exact: true},
    {},
  ),
  {
    tab: {
      id: 'ROOT_TAB',
      text: 'Root',
    },
  },
);

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12},
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

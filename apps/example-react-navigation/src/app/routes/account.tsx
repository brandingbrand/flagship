import React from 'react';
import {Text, View, StyleSheet, Button} from 'react-native';
import {useLinkTo} from '@react-navigation/native';

export function Account() {
  const linkTo = useLinkTo();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>/account</Text>
      <Button title="Settings" onPress={() => linkTo('/account/settings')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});

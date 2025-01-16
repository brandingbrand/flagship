import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

export function Shop() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>/shop</Text>
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

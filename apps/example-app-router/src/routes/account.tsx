import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

function Account() {
  return (
    <View style={styles.container}>
      <Text>/account</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Account;

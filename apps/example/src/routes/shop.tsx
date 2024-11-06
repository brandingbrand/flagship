import {useNavigator} from '@brandingbrand/code-app-router';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

function Account() {
  const navigator = useNavigator();

  function onPress() {
    navigator.open('/account/settings');
  }

  return (
    <View style={styles.container}>
      <Text>/shop</Text>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.text}>Account Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },
  button: {
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  text: {
    color: 'white',
  },
});

export default Account;

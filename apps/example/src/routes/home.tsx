import {useLinking, useNavigator} from '@brandingbrand/code-app-router';
import React from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import HelloWorldModal from '../components/HelloWorldModal';

function Home() {
  useLinking();
  const {showModal} = useNavigator();

  async function onPress() {
    try {
      const res = await showModal<{}, string>(HelloWorldModal, {});

      Alert.alert('Result', res);
    } catch (e) {}
  }

  return (
    <View style={styles.container}>
      <Text>/home</Text>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.text}>Show Modal</Text>
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

export default Home;

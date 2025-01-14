import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {useModal} from '@brandingbrand/code-app-router';

const HelloWorldModal = () => {
  const {resolve} = useModal();

  async function onPress() {
    resolve('blah');
  }

  return (
    <View style={styles.container}>
      <Text>HelloWorldModal</Text>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.text}>Close Modal</Text>
      </TouchableOpacity>
    </View>
  );
};

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

HelloWorldModal.options = {
  topBar: {
    visible: false,
  },
};

export default HelloWorldModal;

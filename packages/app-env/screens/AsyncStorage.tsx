import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import storage from '@react-native-async-storage/async-storage';

export function AsyncStorage() {
  const [content, setContent] = useState({});

  async function fetchContent() {
    const keys = await storage.getAllKeys();
    const data = await storage.multiGet(keys);

    setContent(data);
  }

  useEffect(() => {
    fetchContent();
  }, []);

  async function onPress() {
    const keys = await storage.getAllKeys();
    await storage.multiRemove(keys);
    await fetchContent();
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.contentText}>
          {JSON.stringify(content, null, 2)}
        </Text>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onPress} style={styles.button}>
          <Text style={styles.text}>Clear AsyncStorage</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
  },
  contentText: {
    fontSize: 10,
  },
  buttonContainer: {
    borderTopColor: 'lightgrey',
    borderTopWidth: 1,
    height: 72,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: 12,
    backgroundColor: 'black',
    height: 48,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 12,
  },
});

AsyncStorage.displayName = 'AsyncStorage';

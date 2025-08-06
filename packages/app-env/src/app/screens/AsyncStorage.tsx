import storage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {Button, CodeBlock} from '../components/ui';
import {defineDevMenuScreen} from '../lib/define-screen';

export const AsyncStorage = defineDevMenuScreen(
  'AsyncStorage',
  function AsyncStorage() {
    const [content, setContent] = useState('Loading...');

    async function fetchContent() {
      const keys = await storage.getAllKeys();
      const data = await storage.multiGet(keys);
      setContent(JSON.stringify(data, null, 2));
    }

    useEffect(() => {
      fetchContent();
    }, []);

    async function handleClear() {
      const keys = await storage.getAllKeys();
      await storage.multiRemove(keys);
      await fetchContent();
    }

    return (
      <View style={styles.container}>
        <CodeBlock>{content}</CodeBlock>
        <View style={styles.buttonContainer}>
          <Button onPress={handleClear}>Clear AsyncStorage</Button>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

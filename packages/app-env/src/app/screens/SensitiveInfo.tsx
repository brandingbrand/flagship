import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  RNSensitiveInfoOptions,
  SensitiveInfoEntry,
  deleteItem,
  getAllItems,
} from 'react-native-sensitive-info';

import {Button, CodeBlock} from '../components/ui';
import {defineDevMenuScreen} from '../lib/define-screen';

export function createSensitiveInfoDevScreen(
  options: RNSensitiveInfoOptions = {},
) {
  return defineDevMenuScreen('SensitiveInfo', function SensitiveInfo() {
    const [content, setContent] = useState<SensitiveInfoEntry[]>([]);

    const contentStr = useMemo(
      () => JSON.stringify(content, null, 2),
      [content],
    );

    async function fetchContent() {
      const data = await getAllItems(options);
      setContent(data as unknown as SensitiveInfoEntry[]);
    }

    useEffect(() => {
      fetchContent();
    }, []);

    async function handleClearInfo() {
      if (!content.length) return;

      for (const item of content) {
        await deleteItem(item.key, options);
      }

      await fetchContent();
    }

    return (
      <View style={styles.container}>
        <CodeBlock>{contentStr}</CodeBlock>
        <View style={styles.buttonContainer}>
          <Button onPress={handleClearInfo}>Clear SensitiveInfo</Button>
        </View>
      </View>
    );
  });
}

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

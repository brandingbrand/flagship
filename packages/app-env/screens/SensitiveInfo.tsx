import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  deleteItem,
  getAllItems,
  RNSensitiveInfoOptions,
  SensitiveInfoEntry,
} from 'react-native-sensitive-info';

export namespace SensitiveInfo {
  export type Props = {
    options?: RNSensitiveInfoOptions;
  };
}

export function SensitiveInfo({options = {}}: SensitiveInfo.Props) {
  const [content, setContent] = useState<SensitiveInfoEntry[] | null>();

  async function fetchContent() {
    const data = await getAllItems(options);
    setContent(data as unknown as SensitiveInfoEntry[]);
  }

  useEffect(() => {
    fetchContent();
  }, []);

  async function onPress() {
    if (!content) return;

    for (const item of content) {
      await deleteItem(item.key, options);
    }

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
          <Text style={styles.text}>Clear SensitiveInfo</Text>
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

SensitiveInfo.displayName = 'SensitiveInfo';

import storage from '@react-native-async-storage/async-storage';
import {KeyValuePair} from '@react-native-async-storage/async-storage/lib/typescript/types';
import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {DataView} from '../components/ui';
import {defineDevMenuScreen} from '../lib/define-screen';

interface AsyncStorageDevScreenProps {
  /**
   * If true, AsyncStorage values that are detected as
   * JSON strings will be parsed and formatted for display.
   *
   * @default true
   */
  parseValues?: boolean;
}

function AsyncStorageDevScreenImpl({parseValues = true}: AsyncStorageDevScreenProps) {
  const [content, setContent] = useState<string | readonly KeyValuePair[]>(
    'Loading...',
  );

  const fetchContent = useCallback(async () => {
    const keys = await storage.getAllKeys();
    const data = await storage.multiGet(keys);
    setContent(data);
  }, []);

  const deleteAll = useCallback(async () => {
    const keys = await storage.getAllKeys();
    await storage.multiRemove(keys);
    await fetchContent();
  }, [fetchContent]);

  useEffect(() => {
    fetchContent();
  }, []);

  const actions = useMemo(
    () => [
      {
        label: 'Clear AsyncStorage',
        onPress: deleteAll,
      },
    ],
    [],
  );

  return <DataView deepParse={parseValues} content={content} actions={actions} />;
}

export const AsyncStorageDevScreen =
  defineDevMenuScreen<AsyncStorageDevScreenProps>(
    'AsyncStorage',
    AsyncStorageDevScreenImpl,
  );

export const createAsyncStorageDevScreen = (
  props: AsyncStorageDevScreenProps,
) =>
  defineDevMenuScreen(
    `AsyncStorage`,
    function ConfiguredAsyncStorageDevScreen() {
      return <AsyncStorageDevScreenImpl {...props} />;
    },
  );

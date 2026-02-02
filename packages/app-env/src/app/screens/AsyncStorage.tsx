import storage from '@react-native-async-storage/async-storage';
import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {DataView} from '../components/ui';
import {defineDevMenuScreen} from '../lib/define-screen';

export const AsyncStorageDevScreen = defineDevMenuScreen(
  'AsyncStorage',
  function AsyncStorageDevScreen() {
    const [content, setContent] = useState('Loading...');

    const fetchContent = useCallback(async () => {
      const keys = await storage.getAllKeys();
      const data = await storage.multiGet(keys);
      setContent(JSON.stringify(data, null, 2));
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

    return <DataView content={content} actions={actions} />;
  },
);

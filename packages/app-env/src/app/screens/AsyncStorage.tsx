import storage from '@react-native-async-storage/async-storage';
import {KeyValuePair} from '@react-native-async-storage/async-storage/lib/typescript/types';
import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {DataView} from '../components/ui';
import {defineDevMenuScreen} from '../lib/define-screen';

export type AsyncStorageKeyFilterPredicate = (key: string) => boolean;

export interface AsyncStorageDevScreenProps {
  /**
   * If true, AsyncStorage values that are detected as
   * JSON strings will be parsed and formatted for display.
   *
   * @default true
   */
  parseValues?: boolean;

  /**
   * A filter predicate function that determines whether the given AsyncStorage
   * key should be displayed in the AsyncStorage dev screen.
   *
   * If `undefined`, all AsyncStorage keys will be displayed in the dev screen.
   *
   * This filter **does not** affect which keys are removed when the "Clear AsyncStorage"
   * action is invoked. It only controls which keys are displayed in the dev screen.
   */
  displayKeyFilter?: AsyncStorageKeyFilterPredicate;

  /**
   * A filter predicate function that determines whether the given AsyncStorage
   * key should be removed when the "Clear AsyncStorage" action is invoked.
   *
   * if `undefined`, all keys will be removed when the "Clear AsyncStorage" action
   * is invoked, even if the keys are hidden by the `displayKeyFilter`.
   */
  clearKeyFilter?: AsyncStorageKeyFilterPredicate;
}

function AsyncStorageDevScreenImpl({
  parseValues = true,
  displayKeyFilter,
  clearKeyFilter,
}: AsyncStorageDevScreenProps) {
  const [content, setContent] = useState<string | readonly KeyValuePair[]>(
    'Loading...',
  );

  const fetchContent = useCallback(async () => {
    let keys = await storage.getAllKeys();
    if (displayKeyFilter) {
      keys = keys.filter(displayKeyFilter);
    }

    const data = await storage.multiGet(keys);
    setContent(data);
  }, [displayKeyFilter]);

  const clearContent = useCallback(async () => {
    let keys = await storage.getAllKeys();
    if (clearKeyFilter) {
      keys = keys.filter(clearKeyFilter);
    }

    await storage.multiRemove(keys);
    await fetchContent();
  }, [fetchContent, clearKeyFilter]);

  useEffect(() => {
    fetchContent();
  }, []);

  const actions = useMemo(
    () => [
      {
        label: 'Clear AsyncStorage',
        onPress: clearContent,
      },
    ],
    [clearContent],
  );

  return (
    <DataView deepParse={parseValues} content={content} actions={actions} />
  );
}

export const AsyncStorageDevScreen =
  defineDevMenuScreen<AsyncStorageDevScreenProps>(
    'AsyncStorage',
    AsyncStorageDevScreenImpl,
  );

export const createAsyncStorageDevScreen = (
  props: AsyncStorageDevScreenProps & {
    /**
     * The title to display within the Dev Menu.
     *
     * @default 'AsyncStorage'
     */
    title?: string;
  },
) =>
  defineDevMenuScreen(
    props.title ?? 'AsyncStorage',
    function ConfiguredAsyncStorageDevScreen() {
      return <AsyncStorageDevScreenImpl {...props} />;
    },
  );

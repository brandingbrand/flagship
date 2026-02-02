import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {deleteItem, getAllItems} from 'react-native-sensitive-info';

import {DataView} from '../components/ui';
import {defineDevMenuScreen} from '../lib/define-screen';

export interface SensitiveInfoDevScreenProps {
  keychainService?: string;
}

function SensitiveInfo({keychainService}: SensitiveInfoDevScreenProps) {
  const [content, setContent] = useState<string | string[]>('loading...');

  const fetchContent = useCallback(async () => {
    const keys = await getAllItems({keychainService});
    setContent(keys);
  }, [keychainService]);

  const deleteAll = useCallback(async () => {
    const keys = await getAllItems({keychainService});
    await Promise.all(
      keys.map(async key => deleteItem(key, {keychainService})),
    );
    fetchContent();
  }, [fetchContent, keychainService]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const actions = useMemo(
    () => [
      {
        label: `Clear SensitiveInfo${keychainService ? ` (${keychainService})` : ''}`,
        onPress: deleteAll,
      },
    ],
    [deleteAll, keychainService],
  );

  return (
    <DataView
      title={`Known Keys${keychainService ? ` (${keychainService})` : ''}`}
      content={content}
      actions={actions}
    />
  );
}

export const SensitiveInfoDevScreen =
  defineDevMenuScreen<SensitiveInfoDevScreenProps>(
    'SensitiveInfo',
    SensitiveInfo,
  );

export const createSensitiveInfoDevScreen = (
  props: SensitiveInfoDevScreenProps,
) =>
  defineDevMenuScreen(
    `SensitiveInfo${props.keychainService ? ` (${props.keychainService})` : ''}`,
    function ConfiguredSensitiveInfoDevScreen() {
      return <SensitiveInfo {...props} />;
    },
  );

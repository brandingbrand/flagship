import React from 'react';
import {FlatList, ListRenderItem, StyleSheet, View} from 'react-native';

import {useEnvSwitcher} from '../../lib/context';
import {palette} from '../../lib/theme';
import {Button, Text} from '../ui';

export interface EnvSwitcherListProps {
  environments: string[];
}

export function EnvSwitcherList({environments}: EnvSwitcherListProps) {
  return (
    <View style={styles.container}>
      <Text type="titleSm" style={styles.title}>
        Environments
      </Text>
      <FlatList
        horizontal
        data={environments}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
}
EnvSwitcherList.displayName = 'EnvSwitcherList';

const renderItem: ListRenderItem<string> = ({item}) => (
  <EnvSwitcherListItem name={item} />
);

function EnvSwitcherListItem({name}: {name: string}) {
  const [env, setEnv] = useEnvSwitcher();

  function onPress() {
    setEnv(name);
  }

  const isSelected = env === name;
  return (
    <Button
      type={isSelected ? 'primary' : 'secondary'}
      size="small"
      onPress={onPress}>
      {name}
    </Button>
  );
}
EnvSwitcherListItem.displayName = 'EnvSwitcherListItem';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    width: '100%',
    borderBottomWidth: 1,
    flexGrow: 0,
    borderBottomColor: palette.neutralBorder,
    gap: 8,
  },
  contentContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  title: {
    paddingHorizontal: 16,
  },
});

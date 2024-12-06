import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ListRenderItemInfo,
} from 'react-native';
import React from 'react';

import {useDevMenu} from '../lib/hooks';
import {useScreen} from '../lib/context';

import {EnvSwitcher} from './EnvSwitcher';

export function DevMenuList() {
  const {screens = []} = useDevMenu();
  const [Screen, setScreen] = useScreen();

  function onItemPress(Component: React.ComponentType<any> | null) {
    return () => {
      if (Component == null) {
        return setScreen(null);
      }

      const RenderedComponent = <Component />;

      setScreen(RenderedComponent);
    };
  }

  function renderItem({item}: ListRenderItemInfo<React.ComponentType>) {
    return (
      <TouchableOpacity
        style={styles.rowContainer}
        key={item.name}
        onPress={onItemPress(item)}>
        <Text>{item.displayName}</Text>
        <Text>{`>`}</Text>
      </TouchableOpacity>
    );
  }

  if (Screen) return null;

  return (
    <FlatList
      renderItem={renderItem}
      style={styles.container}
      data={[EnvSwitcher, ...screens]}
      ItemSeparatorComponent={DevMenuListItemSeparatorComponent}
      ListFooterComponent={DevMenuListItemSeparatorComponent}
    />
  );
}

function DevMenuListItemSeparatorComponent() {
  return (
    <View
      style={{
        width: '100%',
        height: 1,
        backgroundColor: 'lightgrey',
      }}
    />
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  rowContainer: {
    height: 64,
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 36,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

import React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {useScreen} from '../../lib/context';
import {useDevMenu} from '../../lib/hooks';
import {palette} from '../../lib/theme';
import {Text, TextIcon} from '../ui';

export function DevMenuList() {
  const {screens} = useDevMenu();
  const [activeScreen] = useScreen();

  if (activeScreen) return null;

  return (
    <FlatList
      renderItem={renderItem}
      style={styles.container}
      data={screens}
      ItemSeparatorComponent={DevMenuListItemSeparatorComponent}
      ListFooterComponent={DevMenuListItemSeparatorComponent}
    />
  );
}

function renderItem({item}: ListRenderItemInfo<React.ComponentType>) {
  return <DevMenuListItem item={item} />;
}
function DevMenuListItem({item}: {item: React.ComponentType}) {
  const [, setScreen] = useScreen();

  function onItemPress() {
    return setScreen({Component: item});
  }

  return (
    <TouchableOpacity style={styles.rowContainer} onPress={onItemPress}>
      <Text>{item.displayName}</Text>
      <TextIcon type="arrowRight" size={28} />
    </TouchableOpacity>
  );
}

function DevMenuListItemSeparatorComponent() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  rowContainer: {
    padding: 16,
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: palette.neutralBorder,
  },
});

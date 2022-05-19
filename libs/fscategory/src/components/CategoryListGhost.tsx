import React from 'react';

import type { FlatListProps, ListRenderItemInfo, StyleProp, ViewStyle } from 'react-native';
import { FlatList, StyleSheet, View } from 'react-native';

import ContentLoader, { Rect } from '../lib/RNContentLoader';

const defaultStyle = StyleSheet.create({
  itemContainer: {
    alignItems: 'center',
    borderBottomColor: '#DBDBDB',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 27,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
});

export interface SerializableCategoryListGhostProps {
  itemContainerStyle?: ViewStyle;
  count?: number;
  height?: number;
}

const keyExtractor = (item: unknown, index: number) => index.toString();

const renderItem =
  (itemProps: CategoryListGhostProps) =>
  ({ index }: ListRenderItemInfo<unknown>) => {
    const width = index % 2 ? 142 : 207;
    const height = itemProps.height || 24;
    return (
      <View style={[defaultStyle.itemContainer, itemProps.itemContainerStyle]}>
        <ContentLoader
          backgroundColor="#EFEFEF"
          foregroundColor="#F9F9F9"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          width={width}
        >
          <Rect height={height} rx="4" ry="4" width={width} x="0" y="0" />
        </ContentLoader>
        {itemProps.renderAccessory?.()}
      </View>
    );
  };

export interface CategoryListGhostProps
  extends Partial<FlatListProps<unknown>>,
    Omit<SerializableCategoryListGhostProps, 'count' | 'height' | 'itemContainerStyle'> {
  count?: number;

  /**
   * An optional custom render function to render the item image to apply to the right side the item
   */
  renderAccessory?: () => React.ReactNode;

  itemContainerStyle?: StyleProp<ViewStyle>;

  height?: number;
}

export const CategoryListGhost: React.FC<CategoryListGhostProps> = React.memo((props) => {
  const { count = 6, ...flatListProps } = props;
  const data = new Array(count).fill(null);

  return (
    <FlatList
      {...flatListProps}
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem(flatListProps)}
    />
  );
});

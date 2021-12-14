import React from 'react';
import {
  FlatList,
  FlatListProps,
  ListRenderItemInfo,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native';
import ContentLoader, { Rect } from '../lib/RNContentLoader';

const defaultStyle = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 27,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DBDBDB'
  }
});

export interface SerializableCategoryListGhostProps {
  itemContainerStyle?: ViewStyle;
  count?: number;
  height?: number;
}

const keyExtractor = (item: any, index: number) => index.toString();

const renderItem = (itemProps: CategoryListGhostProps) => (
  { index }: ListRenderItemInfo<any>
) => {
  const width = index % 2 ? 142 : 207;
  const height = itemProps.height || 24;
  return (
    <View style={[defaultStyle.itemContainer, itemProps.itemContainerStyle]}>
      <ContentLoader
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        backgroundColor={'#EFEFEF'}
        foregroundColor={'#F9F9F9'}
      >
        <Rect x='0' y='0' rx='4' ry='4' width={width} height={height} />
      </ContentLoader>
      {itemProps.renderAccessory?.()}
    </View>
  );
};

export interface CategoryListGhostProps extends Partial<FlatListProps<any>>, Omit<
  SerializableCategoryListGhostProps,
  'itemContainerStyle' |
  'count' |
  'height'
  > {
  count?: number;

  /**
   * An optional custom render function to render the item image to apply to the right side the item
   */
  renderAccessory?: () => React.ReactNode;

  itemContainerStyle?: StyleProp<ViewStyle>;

  height?: number;
}

export const CategoryListGhost: React.FC<CategoryListGhostProps> = React.memo(props => {
  const { count = 6, ...flatListProps } = props;
  const data = Array(count).fill(null);

  return (
    <FlatList
      {...flatListProps}
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem(flatListProps)}
    />
  );
});

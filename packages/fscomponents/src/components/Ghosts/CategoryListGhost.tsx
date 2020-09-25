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
import ContentLoader, { Rect } from '../../lib/RNContentLoader';

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

export interface SerializableCartItemProps {
  itemContainerStyle?: StyleProp<ViewStyle>;
  count?: number;
  height?: number;
}

export interface ItemProps extends SerializableCartItemProps {
  renderAccessory?: () => React.ReactNode;
}

const keyExtractor = (item: any, index: number) => index.toString();

const renderItem = (itemProps: ItemProps) => (
  { index }: ListRenderItemInfo<any>
) => {
  const width = index % 2 ? 142 : 207;
  return (
    <View style={[defaultStyle.itemContainer, itemProps.itemContainerStyle]}>
      <ContentLoader
        width={width}
        height={itemProps.height}
        viewBox={`0 0 ${width} ${itemProps.height}`}
        backgroundColor={'#EFEFEF'}
        foregroundColor={'#F9F9F9'}
      >
        <Rect x='0' y='0' rx='4' ry='4' width={width} height={itemProps.height} />
      </ContentLoader>
      {itemProps.renderAccessory?.()}
    </View>
  );
};

export interface CategoryListGhostProps extends Partial<FlatListProps<any>>, Omit<
  SerializableCartItemProps,
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
  const { count = 6, height = 24, renderAccessory, itemContainerStyle, ...flatListProps } = props;
  const data = Array(count).fill(null);

  return (
    <FlatList
      {...flatListProps}
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem({height, renderAccessory, itemContainerStyle})}
    />
  );
});

import { CategoryLine } from '@brandingbrand/fscomponents';
import React from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { CommerceTypes, WithCommerceDataProps } from '@brandingbrand/fscommerce';

import { style as S } from '../styles/Category';
import { UnwrappedCategoryProps } from './Category';

const CategoryList: React.SFC<UnwrappedCategoryProps
& WithCommerceDataProps<CommerceTypes.Category>> = props => {
  const { listStyle, commerceData } = props;

  const renderItem = ({ item }: ListRenderItemInfo<CommerceTypes.Category>) => {
    const { categoryItemProps, onNavigate, renderCategoryItem } = props;

    if (renderCategoryItem) {
      return renderCategoryItem(item);
    }

    return (
      <CategoryLine
        onPress={onNavigate}
        {...item}
        {...categoryItemProps}
      />
    );
  };

  const keyExtractor = (item: CommerceTypes.Category, index: number): string => {
    if (props.listViewProps && props.listViewProps.keyExtractor) {
      return props.listViewProps.keyExtractor(item, index);
    }

    return item.id;
  };

  if (commerceData && commerceData.categories) {
    return (
      <FlatList
        style={[S.list, listStyle]}
        data={commerceData.categories}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        {...props.listViewProps}
      />
    );
  }

  return null;
};

export default CategoryList;

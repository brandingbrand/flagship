import { CategoryBox, Grid } from '@brandingbrand/fscomponents';
import React, { SFC } from 'react';
import { ListRenderItemInfo } from 'react-native';
import { UnwrappedCategoryProps } from './Category';
import { CommerceTypes, WithCommerceDataProps } from '@brandingbrand/fscommerce';

const CategoryGrid: SFC<UnwrappedCategoryProps & WithCommerceDataProps<CommerceTypes.Category>
> = props => {

  const renderItem = ({ item }: ListRenderItemInfo<CommerceTypes.Category>) => {
    const { categoryItemProps, onNavigate, renderCategoryItem } = props;

    if (renderCategoryItem) {
      return renderCategoryItem(item);
    }

    return (
      <CategoryBox
        onPress={onNavigate}
        {...item}
        {...categoryItemProps}
      />
    );
  };

  const {
    commerceData,
    columns,
    categoryGridProps
  } = props;

  if (commerceData && commerceData.categories) {
    return (
      <Grid
        data={commerceData.categories}
        columns={columns}
        renderItem={renderItem}
        {...categoryGridProps}
      />
    );
  }

  return null;

};

export default CategoryGrid;


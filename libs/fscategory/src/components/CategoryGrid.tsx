import React, { Component } from 'react';

import type { ListRenderItemInfo } from 'react-native';

import type { CommerceTypes, WithCommerceDataProps } from '@brandingbrand/fscommerce';
import { CategoryBox, Grid } from '@brandingbrand/fscomponents';

import type { UnwrappedCategoryProps } from './Category';

export default class CategoryGrid extends Component<
  UnwrappedCategoryProps & WithCommerceDataProps<CommerceTypes.Category>
> {
  private readonly renderItem = ({ item }: ListRenderItemInfo<CommerceTypes.Category>) => {
    const { categoryItemProps, onNavigate, renderCategoryItem } = this.props;

    if (renderCategoryItem) {
      return renderCategoryItem(item);
    }

    return <CategoryBox onPress={onNavigate} {...item} {...categoryItemProps} />;
  };

  public render(): React.ReactNode {
    const { categoryGridProps, columns, commerceData } = this.props;

    if (commerceData && commerceData.categories) {
      return (
        <Grid
          columns={columns}
          data={commerceData.categories}
          renderItem={this.renderItem}
          {...categoryGridProps}
        />
      );
    }

    return null;
  }
}

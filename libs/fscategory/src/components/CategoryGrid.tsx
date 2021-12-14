import { CategoryBox, Grid } from '@brandingbrand/fscomponents';
import React, { Component } from 'react';
import { ListRenderItemInfo } from 'react-native';
import { UnwrappedCategoryProps } from './Category';
import { CommerceTypes, WithCommerceDataProps } from '@brandingbrand/fscommerce';

export default class CategoryGrid extends Component<
  UnwrappedCategoryProps & WithCommerceDataProps<CommerceTypes.Category>
> {
  renderItem = ({ item }: ListRenderItemInfo<CommerceTypes.Category>) => {
    const { categoryItemProps, onNavigate, renderCategoryItem } = this.props;

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
  }

  render(): React.ReactNode {
    const {
      commerceData,
      columns,
      categoryGridProps
    } = this.props;

    if (commerceData && commerceData.categories) {
      return (
        <Grid
          data={commerceData.categories}
          columns={columns}
          renderItem={this.renderItem}
          {...categoryGridProps}
        />
      );
    }

    return null;
  }
}

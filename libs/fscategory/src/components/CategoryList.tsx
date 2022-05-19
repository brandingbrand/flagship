import React, { Component } from 'react';

import type { ListRenderItemInfo } from 'react-native';
import { FlatList } from 'react-native';

import type { CommerceTypes, WithCommerceDataProps } from '@brandingbrand/fscommerce';
import { CategoryLine } from '@brandingbrand/fscomponents';

import { style as S } from '../styles/Category';

import type { UnwrappedCategoryProps } from './Category';

export default class CategoryList extends Component<
  UnwrappedCategoryProps & WithCommerceDataProps<CommerceTypes.Category>
> {
  private readonly renderItem = ({ item }: ListRenderItemInfo<CommerceTypes.Category>) => {
    const { categoryItemProps, onNavigate, renderCategoryItem } = this.props;

    if (renderCategoryItem) {
      return renderCategoryItem(item);
    }

    return <CategoryLine onPress={onNavigate} {...item} {...categoryItemProps} />;
  };

  private readonly keyExtractor = (item: CommerceTypes.Category, index: number): string => {
    if (this.props.listViewProps && this.props.listViewProps.keyExtractor) {
      return this.props.listViewProps.keyExtractor(item, index);
    }

    return item.id;
  };

  public render(): React.ReactNode {
    const { commerceData, listStyle } = this.props;

    if (commerceData && commerceData.categories) {
      return (
        <FlatList
          data={commerceData.categories}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          style={[S.list, listStyle]}
          {...this.props.listViewProps}
        />
      );
    }

    return null;
  }
}

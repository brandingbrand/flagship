import { CategoryLine } from '@brandingbrand/fscomponents';
import React, { Component } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { CommerceTypes, WithCommerceDataProps } from '@brandingbrand/fscommerce';

import { style as S } from '../styles/Category';
import { UnwrappedCategoryProps } from './Category';

export default class CategoryList extends Component<
  UnwrappedCategoryProps & WithCommerceDataProps<CommerceTypes.Category>
> {
  render(): React.ReactNode {
    const { listStyle, commerceData } = this.props;

    if (commerceData && commerceData.categories) {
      return (
        <FlatList
          style={[S.list, listStyle]}
          data={commerceData.categories}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          {...this.props.listViewProps}
        />
      );
    }

    return null;
  }

  private renderItem = ({ item }: ListRenderItemInfo<CommerceTypes.Category>) => {
    const { categoryItemProps, onNavigate, renderCategoryItem } = this.props;

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
  }

  private keyExtractor = (item: CommerceTypes.Category, index: number): string => {
    if (this.props.listViewProps && this.props.listViewProps.keyExtractor) {
      return this.props.listViewProps.keyExtractor(item, index);
    }

    return item.id;
  }
}

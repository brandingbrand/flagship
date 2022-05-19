import React, { Component } from 'react';

import type { FlatListProps, StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';

import type {
  CommerceDataSource,
  CommerceTypes,
  WithCommerceProps,
  WithCommerceProviderProps,
} from '@brandingbrand/fscommerce';
import { withCommerceData } from '@brandingbrand/fscommerce';
import type { CategoryBoxProps, GridProps } from '@brandingbrand/fscomponents';
import { Loading } from '@brandingbrand/fscomponents';

import { style as S } from '../styles/Category';

import CategoryGrid from './CategoryGrid';
import CategoryList from './CategoryList';

export interface UnwrappedCategoryProps {
  categoryId?: string;
  format?: 'grid' | 'list';
  columns?: number;
  onNavigate?: (data: CommerceTypes.Category) => void;
  categoryGridProps?: Partial<GridProps<CommerceTypes.Category>>;
  listViewProps?: Partial<FlatListProps<CommerceTypes.Category>>;
  categoryItemProps?: Partial<CategoryBoxProps>;
  renderCategoryItem?: (data: CommerceTypes.Category) => JSX.Element;
  style?: StyleProp<ViewStyle>;
  loadingStyle?: StyleProp<ViewStyle>;
  listStyle?: StyleProp<ViewStyle>;
}

export type CategoryProps = UnwrappedCategoryProps &
  WithCommerceProviderProps<CommerceTypes.Category>;

export class Category extends Component<
  UnwrappedCategoryProps & WithCommerceProps<CommerceTypes.Category>
> {
  public componentDidUpdate(
    prevProps: UnwrappedCategoryProps & WithCommerceProps<CommerceTypes.Category>
  ): void {
    if (prevProps.categoryId !== this.props.categoryId && this.props.commerceLoadData) {
      this.props.commerceLoadData();
    }
  }

  public render(): JSX.Element {
    const { commerceData, format, loadingStyle, style } = this.props;

    let content = null;
    let hasImages = false;

    if (commerceData) {
      if (format !== 'list' && commerceData.categories) {
        const { categories } = commerceData;

        for (const category of categories) {
          if (category.image) {
            hasImages = true;
            break;
          }
        }
      }

      content = hasImages ? <CategoryGrid {...this.props} /> : <CategoryList {...this.props} />;
    } else {
      content = <Loading style={[S.loading, loadingStyle]} />;
    }

    return <View style={[S.container, style]}>{content}</View>;
  }
}

export default withCommerceData<UnwrappedCategoryProps, CommerceTypes.Category>(
  async (dataSource: CommerceDataSource, props: UnwrappedCategoryProps) =>
    dataSource.fetchCategory(props.categoryId)
)(Category);

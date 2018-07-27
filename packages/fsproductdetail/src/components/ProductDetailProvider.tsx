import React, { Component, ComponentClass } from 'react';
import { compose } from 'redux';
import { cloneDeep, isEqual, set } from 'lodash-es';

import {
  CommerceTypes,
  FetchDataFunction,
  ReviewDataSource,
  ReviewTypes,
  withCommerceData,
  WithCommerceProps,
  WithCommerceProviderProps
} from '@brandingbrand/fscommerce';

// TODO: This should move into fscommerce
export type CommerceToReviewMapFunction<
  T extends CommerceTypes.Product = CommerceTypes.Product
> = (product: T) => string;

/**
 * Additional props that are consumed by the high order component.
 *
 * @template T The type of product data that will be provided. Defaults to `Product`
 */
export interface WithProductDetailProviderProps<
  T extends CommerceTypes.Product = CommerceTypes.Product
> extends WithCommerceProviderProps<T> {
  commerceToReviewMap: keyof T | CommerceToReviewMapFunction<T>;
  reviewDataSource?: ReviewDataSource;
}

/**
 * Additional props that will be provided to the wrapped component.
 *
 * @template T The type of product data that will be provided. Defaults to `Product`
 */
export type WithProductDetailProps<
  T extends CommerceTypes.Product = CommerceTypes.Product
> = WithCommerceProps<T> & { reviewsData?: ReviewTypes.ReviewDetails[] };

/**
 * The state of the ProductDetailProvider component which is passed to the wrapped component as a
 * prop.
 *
 * @template T The type of product data that will be provided. Defaults to `Product`
 */
export type WithProductDetailState<
  T extends CommerceTypes.Product = CommerceTypes.Product
> = Pick<WithCommerceProps<T>, 'commerceData'> & { reviewsData?: ReviewTypes.ReviewDetails[] };

/**
 * A function that wraps a a component and returns a new high order component. The wrapped
 * component will be given product detail data as props.
 *
 * @template T The type of product data that will be provided. Defaults to `Product`
 *
 * @param {ComponentClass<P & WithProductDetailProps>} WrappedComponent A component to wrap and
 * provide product detail data to as props.
 * @returns {ComponentClass<P & WithProductDetailProviderProps>} A high order component.
 */
export type ProductDetailWrapper<P, T extends CommerceTypes.Product = CommerceTypes.Product> = (
  WrappedComponent: ComponentClass<P & WithProductDetailProps<T>>
) => ComponentClass<P & WithProductDetailProviderProps<T>>;

/**
 * Returns a function that wraps a component and returns a new high order component. The wrapped
 * component will be given product detail data as props.
 *
 * @template P The original props of the wrapped component. They'll be passed through unmodified.
 * @template T The type of product data that will be provided. Defaults to `Product`
 *
 * @param {FetchDataFunction<P, T>} fetchProduct A function that will return product data.
 * @returns {ProductDetailWrapper<P>} A function that wraps a component and returns a new high order
 * component.
 */
export default function withProductDetailData<
  P,
  T extends CommerceTypes.Product = CommerceTypes.Product
>(fetchProduct: FetchDataFunction<P, T>): ProductDetailWrapper<P, T> {
  type ResultProps = P &
    WithProductDetailProviderProps<T> &
    WithCommerceProps<T>;

  /**
   * A function that wraps a a component and returns a new high order component. The wrapped
   * component will be given product detail data as props.
   *
   * @param {ComponentClass<P & WithProductDetailProps>} WrappedComponent A component to wrap and
   * provide product detail data to as props.
   * @returns {ComponentClass<P & WithProductDetailProviderProps>} A high order component.
   */
  return (WrappedComponent: ComponentClass<P & WithProductDetailProps<T>>) => {
    class ProductDetailProvider extends Component<ResultProps, WithProductDetailState<T>> {
      async componentDidUpdate(prevProps: ResultProps): Promise<void> {
        const { commerceToReviewMap, reviewDataSource } = this.props;

        // ts isn't detecting the commerceData type correctly, so we have to assert it
        const commerceData = this.props.commerceData as T | undefined;

        if (commerceData === undefined || reviewDataSource === undefined) {
          return;
        }

        if (!isEqual(prevProps.commerceData, commerceData)) {
          // CommerceData has changed, update review data

          const ids = reviewDataSource.productIdMapper<T>(
            [commerceData],
            commerceToReviewMap
          );

          const reviewsData = await reviewDataSource.fetchReviewDetails({ ids });

          // Merge commerce and reviews data
          const newCommerceData = cloneDeep(commerceData);
          set(newCommerceData, 'review', reviewsData[0]);
          this.setState({
            commerceData: newCommerceData,
            reviewsData
          });
        }
      }

      render(): JSX.Element {
        const {
          commerceToReviewMap,
          ...props
        } = this.props as any; // TypeScript does not support rest parameters for generics :(

        return (
          <WrappedComponent
            {...props}
            commerceData={(this.state && this.state.commerceData) || this.props.commerceData}
            reviewsData={(this.state && this.state.reviewsData)}
          />
        );
      }
    }

    return compose<ComponentClass<P & WithProductDetailProviderProps<T>>>(
      withCommerceData<P, T>(fetchProduct)
    )(ProductDetailProvider);
  };
}

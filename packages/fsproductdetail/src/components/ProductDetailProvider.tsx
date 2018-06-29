import React, { Component, ComponentClass } from 'react';
import { compose } from 'redux';
import { cloneDeep, get, isEqual, isFunction, set } from 'lodash-es';

import {
  CommerceTypes,
  FetchDataFunction,
  withCommerceData,
  WithCommerceProps,
  WithCommerceProviderProps,
  withReviewData,
  WithReviewProps,
  WithReviewState
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
> extends WithCommerceProviderProps<T>, WithReviewProps {
  commerceToReviewMap: string | CommerceToReviewMapFunction<T>;
}

/**
 * Additional props that will be provided to the wrapped component.
 *
 * @template T The type of product data that will be provided. Defaults to `Product`
 */
export type WithProductDetailProps<
  T extends CommerceTypes.Product = CommerceTypes.Product
> = WithCommerceProps<T> & WithReviewState;

/**
 * The state of the ProductDetailProvider component which is passed to the wrapped component as a
 * prop.
 *
 * @template T The type of product data that will be provided. Defaults to `Product`
 */
export type WithProductDetailState<
  T extends CommerceTypes.Product = CommerceTypes.Product
> = Pick<WithCommerceProps<T>, 'commerceData'>;

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
 * @param {Function} fetchReview A function that will return review data.
 * @returns {ProductDetailWrapper<P>} A function that wraps a component and returns a new high order
 * component.
 */
export default function withProductDetailData<
  P,
  T extends CommerceTypes.Product = CommerceTypes.Product
>(fetchProduct: FetchDataFunction<P, T>, fetchReview: Function): ProductDetailWrapper<P, T> {
  type ResultProps = P &
    WithProductDetailProviderProps<T> &
    WithCommerceProps<T> &
    WithReviewState;

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
      // TODO: This should be replaced with getDerivedStateFromProps
      componentWillReceiveProps(nextProps: ResultProps): void {
        const { commerceData, commerceToReviewMap, reviewProviderDoUpdate } = this.props;

        const getReviewId = (product: T) => {
          if (isFunction(commerceToReviewMap)) {
            return commerceToReviewMap(product);
          } else if ('string' === typeof commerceToReviewMap) {
            return get(product, commerceToReviewMap);
          }

          // Default to the product id
          return product.id;
        };

        if (nextProps.commerceData) {
          if (!isEqual(commerceData, nextProps.commerceData) && reviewProviderDoUpdate) {
            // CommerceData has changed, update review data
            const ids = getReviewId(nextProps.commerceData);
            reviewProviderDoUpdate({ ids });
          } else if (nextProps.reviewsData && nextProps.reviewsData.length) {
            // Merge commerce and reviews data
            const newCommerceData = cloneDeep(nextProps.commerceData);
            set(newCommerceData, 'review', nextProps.reviewsData[0]);
            this.setState({ commerceData: newCommerceData });
          }
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
          />
        );
      }
    }

    return compose<ComponentClass<P & WithProductDetailProviderProps<T>>>(
      withCommerceData<P, T>(fetchProduct),
      withReviewData(fetchReview)
    )(ProductDetailProvider);
  };
}

import React, { Component, ComponentClass } from 'react';
import { compose } from 'redux';
import {
  cloneDeep,
  isEqual,
  set
} from 'lodash-es';
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
  ProductType extends CommerceTypes.Product = CommerceTypes.Product
  > = (product: ProductType) => keyof ProductType;

/**
 * Additional props that are consumed by the high order component.
 *
 * @template ProductType The type of product contained within the product index. Defaults to
 * `Product`
 * @template IdxType The type of product index data that will be provided. Defaults to
 * `ProductIndex`
 */
export interface WithProductIndexProviderProps<
  ProductType extends CommerceTypes.Product = CommerceTypes.Product,
  IdxType extends CommerceTypes.ProductIndex<ProductType> = CommerceTypes.ProductIndex<ProductType>
> extends WithCommerceProviderProps<IdxType> {
  reviewDataSource?: ReviewDataSource;
  commerceToReviewMap?: keyof ProductType | CommerceToReviewMapFunction<ProductType>;
  onReceiveCommerceData?: (data: IdxType) => void;
  disableReviews?: boolean;
}

/**
 * Additional props that will be provided to the wrapped component.
 *
 * @template ProductType The type of product contained within the product index. Defaults to
 * `Product`
 * @template IdxType The type of product index data that will be provided. Defaults to
 * `ProductIndex`
 */
export type WithProductIndexProps<
  ProductType extends CommerceTypes.Product = CommerceTypes.Product,
  IdxType extends CommerceTypes.ProductIndex<ProductType> = CommerceTypes.ProductIndex<ProductType>
> = WithCommerceProps<IdxType> & { reviewsData?: ReviewTypes.ReviewSummary[] };

/**
 * The state of the ProductIndexProvider component which is passed to the wrapped component as a
 * prop.
 *
 * @template ProductType The type of product contained within the product index. Defaults to
 * `Product`
 * @template IdxType The type of product index data that will be provided. Defaults to
 * `ProductIndex`
 */
export interface WithProductIndexState<
  ProductType extends CommerceTypes.Product = CommerceTypes.Product,
  IdxType extends CommerceTypes.ProductIndex<ProductType> = CommerceTypes.ProductIndex<ProductType>,
> extends Pick<WithCommerceProps<IdxType>, 'commerceData'> {
  /**
   * Indicates that we've received new commerce data but have not yet requested and merged reviews
   * for that data
   */
  reviewsData?: ReviewTypes.ReviewSummary[];
}

/**
 * A function that wraps a a component and returns a new high order component. The wrapped
 * component will be given product index data as props.
 *
 * @template P The original props of the wrapped component. They'll be passed through unmodified.
 * @template ProductType The type of product contained within the product index. Defaults to
 * `Product`
 * @template IdxType The type of product index data that will be provided. Defaults to
 * `ProductIndex`
 *
 * @param {ComponentClass<P & WithProductIndexProps<IdxType, ProductType>>} WrappedComponent A
 * component to wrap and provide product index data to as props.
 * @returns {ComponentClass<P & WithProductIndexProviderProps<IdxType, ProductType>>} A high order
 * component.
 */
export type ProductIndexWrapper<
  P,
  ProductType extends CommerceTypes.Product = CommerceTypes.Product,
  IdxType extends CommerceTypes.ProductIndex<ProductType> = CommerceTypes.ProductIndex<ProductType>
> = (
  WrappedComponent: ComponentClass<P & WithProductIndexProps<ProductType, IdxType>>
) => ComponentClass<P & WithProductIndexProviderProps<ProductType, IdxType>>;

/**
 * Returns a function that wraps a component and returns a new high order component. The wrapped
 * component will be given product index data as props.
 *
 * @template P The original props of the wrapped component. They'll be passed through unmodified.
 * @template ProductType The type of product contained within the product index. Defaults to
 * `Product`
 * @template IdxType The type of product index data that will be provided. Defaults to
 * `ProductIndex`
 *
 * @param {FetchDataFunction<P, IdxType>} fetchProducts A function that will return product index
 * data.
 * @returns {ProductDetailWrapper<P>} A function that wraps a component and returns a new high order
 * component.
 */
function withProductIndexData<
  P,
  ProductType extends CommerceTypes.Product = CommerceTypes.Product,
  IdxType extends CommerceTypes.ProductIndex<ProductType> = CommerceTypes.ProductIndex<ProductType>
>(
  fetchProducts: FetchDataFunction<P, IdxType>
): ProductIndexWrapper<P, ProductType, IdxType> {
  /**
   * A function that wraps a a component and returns a new high order component. The wrapped
   * component will be given product index data as props.
   *
   * @param {ComponentClass<P & WithProductIndexProps>} WrappedComponent A component to wrap and
   * provide product index data to as props.
   * @returns {ComponentClass<P & WithProductIndexProviderProps>} A high order component.
   */
  return (WrappedComponent: ComponentClass<P & WithProductIndexProps<ProductType, IdxType>>) => {
    type ResultProps = P &
      WithProductIndexProviderProps<ProductType, IdxType> &
      WithCommerceProps<IdxType>;
    type ResultState = WithProductIndexState<ProductType, IdxType>;

    class ProductIndexProvider extends Component<ResultProps, ResultState> {
      /**
       * Request new reviews if commerce data has changed
       * @param {ResultProps} prevProps - Previously set Props
       */
      componentDidUpdate(prevProps: ResultProps): void {
        if (!isEqual(this.props.commerceData, prevProps.commerceData)) {
          if (!this.props.disableReviews) {
            this.requestReviews().catch(err => console.warn('Could not get reviews', err));
          }

          if (this.props.onReceiveCommerceData && this.state.commerceData) {
            this.props.onReceiveCommerceData(this.state.commerceData);
          }
        }
      }

      render(): JSX.Element {
        const {
          commerceToReviewMap,
          onReceiveCommerceData,
          disableReviews,
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

      /**
       * Request reviews from the ReviewsDataSource for products without reviews
       */
      private requestReviews = async (): Promise<void> => {
        const {
          commerceData,
          commerceToReviewMap = 'id',
          reviewDataSource
        } = this.props as ResultProps;

        if (
          !reviewDataSource ||
          !commerceData ||
          !Array.isArray(commerceData.products) ||
          commerceData.products.length === 0
        ) {
          return;
        }

        const productsWithoutReviews = commerceData.products.filter(product => !product.review);
        const ids = reviewDataSource.productIdMapper<ProductType>(
          productsWithoutReviews,
          commerceToReviewMap as keyof ProductType
        );

        const summaries = await reviewDataSource.fetchReviewSummary({ ids });

        const updatedCommerceData: IdxType = {
          ...commerceData as any,
          products: commerceData.products.map(product => {
            const [id] = reviewDataSource.productIdMapper<ProductType>(
              [product],
              commerceToReviewMap as keyof ProductType
            );

            const summary = summaries.find(summary => summary.id === id);
            if (summary) {
              return set(cloneDeep(product), 'review.summary', summary);
            }

            return product;
          })
        };

        this.setState({
          reviewsData: summaries,
          commerceData: updatedCommerceData
        });
      }
    }

    return compose<ComponentClass<P & WithProductIndexProviderProps<ProductType, IdxType>>>(
      withCommerceData<P, IdxType>(fetchProducts)
    )(ProductIndexProvider);
  };
}

export default withProductIndexData;

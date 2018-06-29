import React, { Component, ComponentClass } from 'react';
import { compose } from 'redux';
import {
  cloneDeep,
  find,
  get,
  isEqual,
  isFunction,
  partialRight,
  pullAll,
  set
} from 'lodash-es';
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
  ProductType extends CommerceTypes.Product = CommerceTypes.Product
  > = (product: ProductType) => string;

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
> extends WithCommerceProviderProps<IdxType>, WithReviewProps {
  commerceToReviewMap: string | CommerceToReviewMapFunction<ProductType>;
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
> = WithCommerceProps<IdxType> & WithReviewState;

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
> extends Pick<WithCommerceProps<IdxType>, 'commerceData'>, Pick<WithReviewState, 'reviewsData'> {
  /**
   * Indicates that we've received new commerce data but have not yet requested and merged reviews
   * for that data
   */
  commerceDataDirty: boolean;
}

/**
 * Create a function to return the review id based on the commerceToReviewMap
 *
 * @template ProductType The type of product contained within the product index. Defaults to
 * `Product`
 *
 * @param {string | CommerceToReviewMapFunction} commerceToReviewMap a function to map between
 * a product and a review id or a string defining a keypath within the product from which to
 * extract a review id.
 * @returns {CommerceToReviewMapFunction} a function to map from a product to a review id
 */
function getReviewIdMapper<ProductType extends CommerceTypes.Product = CommerceTypes.Product>(
  commerceToReviewMap: string | CommerceToReviewMapFunction<ProductType>
): CommerceToReviewMapFunction {
  if (isFunction(commerceToReviewMap)) {
    return commerceToReviewMap;
  } else {
    return partialRight(get, commerceToReviewMap);
  }
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
 * @param {Function} fetchReviews A function that will return reviews data.
 * @returns {ProductDetailWrapper<P>} A function that wraps a component and returns a new high order
 * component.
 */
function withProductIndexData<
  P,
  ProductType extends CommerceTypes.Product = CommerceTypes.Product,
  IdxType extends CommerceTypes.ProductIndex<ProductType> = CommerceTypes.ProductIndex<ProductType>
>(
  fetchProducts: FetchDataFunction<P, IdxType>,
  fetchReviews: Function
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
      WithCommerceProps<IdxType> &
      WithReviewState;
    type ResultState = WithProductIndexState<ProductType, IdxType>;

    class ProductIndexProvider extends Component<ResultProps, ResultState> {
      static getDerivedStateFromProps(
        nextProps: ResultProps,
        prevState: ResultState
      ): Partial<ResultState> | null {
        if (!isEqual(nextProps.commerceData, prevState.commerceData)) {
          // commerceData has changed, initiate reviews update
          return {
            commerceData: nextProps.commerceData,
            commerceDataDirty: true
          };
        } else if (!isEqual(nextProps.reviewsData, prevState.reviewsData)) {
          const { commerceData } = nextProps;

          if (!commerceData) {
            return {
              reviewsData: nextProps.reviewsData,
              commerceDataDirty: false
            };
          }

          // reviewsData has changed, merge commerceData and reviewsData
          const reviewIdMap = getReviewIdMapper(nextProps.commerceToReviewMap);

          return {
            reviewsData: nextProps.reviewsData,
            commerceDataDirty: false,
            commerceData: {
              ...commerceData as any, // TypeScript doesn't support spread operators for generics :(
              products: commerceData.products.map(product => {
                const id = reviewIdMap(product);
                let review = find(nextProps.reviewsData, { id });

                // Check if we already merged this product and have an existing review
                if (!review && prevState.commerceData) {
                  const existingProduct = prevState.commerceData.products.find(({ id }) => {
                    return id === product.id;
                  });

                  if (existingProduct) {
                    review = get(existingProduct, 'review.summary');
                  }
                }

                if (review) {
                  return set(cloneDeep(product), 'review.summary', review);
                }

                return product;
              })
            }
          };
        }

        return null;
      }

      /**
       * Keeps track of which review ids we've requested
       */
      private requestedReviewsIds: string[] = [];

      constructor(props: ResultProps) {
        super(props);

        this.state = {
          commerceDataDirty: true
        };
      }

      /**
       * Request new reviews if commerce data is dirty
       */
      componentDidUpdate(): void {
        if (!this.props.disableReviews && this.state.commerceDataDirty) {
          this.requestReviews();

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
            commerceData={this.state.commerceData || this.props.commerceData}
          />
        );
      }

      /**
       * Request reviews from the ReviewsProvider for products without reviews
       */
      private requestReviews = (): void => {
        const { commerceToReviewMap, reviewProviderDoUpdate } = this.props;
        const { commerceData } = this.state;

        if (commerceData && commerceData.products && commerceData.products.length) {
          const ids = commerceData.products
            .filter(product => !product.review)
            .map(getReviewIdMapper<ProductType>(commerceToReviewMap));

          // Prevent duplicate requests to the same review id
          pullAll(ids, this.requestedReviewsIds);
          this.requestedReviewsIds.push(...ids);

          if (reviewProviderDoUpdate) {
            reviewProviderDoUpdate({ ids });
          }
        }
      }
    }

    return compose<ComponentClass<P & WithProductIndexProviderProps<ProductType, IdxType>>>(
      withCommerceData<P, IdxType>(fetchProducts),
      withReviewData(fetchReviews)
    )(ProductIndexProvider);
  };
}

export default withProductIndexData;

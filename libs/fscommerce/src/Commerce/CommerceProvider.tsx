import React, { Component, ComponentClass } from 'react';
import { ProductQuery } from './types/ProductQuery';
import CommerceDataSource from './CommerceDataSource';

/**
 * Additional props that are used both by the high order component and passed to the wrapped
 * component.
 *
 * @typeparam Source The type of datasource. Defaults to `CommerceDataSource`.
 */
export interface WithCommerceSharedProps<Source = CommerceDataSource> {
  /**
   * Instance of the provided or constructed Data Source which is provided as a property
   * to the wrapped component.
   */
  commerceDataSource: Source;
}

/**
 * Additional props that are consumed by the high order component.
 *
 * @typeparam Data The type of data provided to the wrapped component.
 * @typeparam Source The type of datasource. Defaults to `CommerceDataSource`.
 */
export interface WithCommerceProviderProps<Data, Source = CommerceDataSource>
  extends WithCommerceSharedProps<Source> {
  /**
   * Called when new data has been loaded.
   */
  onDataLoaded?: (data: Data) => void;

  /**
   * Called when an error occurs while attempting to load new data.
   */
  onDataError?: (error: Error) => void;
}

/**
 * Props to provide the commerce data.
 *
 * @typeparam Data The type of data provided to the wrapped component.
 */
export interface WithCommerceDataProps<Data> {
  /**
   * Loaded commerce data.
   */
  commerceData?: Readonly<Data>;
  /*
   * Whether commerce data is currently being loaded
   */
  isLoading?: boolean;
}

/**
 * Additional props that will be provided to the wrapped component.
 *
 * @typeparam Data The type of data provided to the wrapped component.
 * @typeparam Source The type of datasource. Defaults to `CommerceDataSource`.
 */
export interface WithCommerceProps<Data, Source = CommerceDataSource>
  extends WithCommerceSharedProps<Source>,
    WithCommerceDataProps<Data> {
  /**
   * A function that loads and updates commerceData. Arbitrary data to load can be provided as
   * an optional argument.
   */
  commerceLoadData: (data?: Data) => void;

  /**
   * A function that loads and appends new products to the existing list of products in
   * commerceData.
   */
  commerceProviderLoadMore: (productQuery: ProductQuery) => Promise<Data>;
}

/**
 * The state of the CommerceProvider component which is passed to the wrapped component as a prop.
 *
 * @typeparam Data The type of data provided to the wrapped component.
 */
export type WithCommerceState<Data> = WithCommerceDataProps<Data>;

/**
 * A function that fetches data using the given datasource for a given query.
 *
 * @typeparam P The original props of the wrapped component.
 * @typeparam Data The type of data provided to the wrapped component.
 * @typeparam Source The type of datasource. Defaults to `CommerceDataSource`.
 * @param {Readonly<Source>} datasource The datasource with which to fetch the data.
 * @param {Readonly<P>} props The props passed to the wrapped component.
 * @param {ProductQuery} query Deprecated. Additional query parameters to restrict the data further.
 */
export type FetchDataFunction<P, Data, Source = CommerceDataSource> = (
  datasource: Readonly<Source>,
  props: Readonly<P>,
  query?: ProductQuery
) => Promise<Data>;

/**
 * A function that fetches data using the given datasource for a given query.
 *
 * @typeparam P The original props of the wrapped component.
 * @typeparam Data The type of data provided to the wrapped component.
 * @param {Readonly<P>} props The props passed to the wrapped component.
 */
export type InitialDataFunction<P, Data> = (props: Readonly<P>) => Data | undefined;

/**
 * A function that wraps a a component and returns a new high order component. The wrapped
 * component will be given commerce data as props.
 *
 * @typeparm P The original props of the wrapped component.
 * @typeparam Data The type of product data that will be provided.
 * @typeparam Source The type of datasource providing the data. Defaults to `CommerceDataSource`.
 *
 * @param {ComponentClass<P & WithCommerceProps<Data, Source>>} WrappedComponent A component to wrap
 * and provide commerce data to as props.
 * @returns {ComponentClass<P & WithCommerceProviderProps<Data, Source>>} A high order component.
 */
export type CommerceWrapper<P, Data, Source = CommerceDataSource> = (
  WrappedComponent: ComponentClass<P & WithCommerceProps<Data, Source>>
) => ComponentClass<P & WithCommerceProviderProps<Data, Source>>;

/**
 * Function that wraps a specified component with additional properties and state allowing
 * it to interact with a Commerce Data Source.
 *
 * @typeparm P The original props of the wrapped component.
 * @typeparam Data The type of product data that will be provided.
 * @typeparam Source The type of datasource providing the data. Defaults to `CommerceDataSource`.
 * @param {FetchDataFunction<P, Data, Source>} fetchData Function to retrieve commerce data
 * @param {InitialDataFunction<P, Data>} initialData Function to determine initial data to be
 * loaded into the provider
 * @returns {CommerceWrapper<P, Data, Source>} A function that wraps a a component and returns a new
 * high order component. The wrapped component will be given commerce data as props.
 */
function withCommerceData<P, Data extends {}, Source = CommerceDataSource>(
  fetchData: FetchDataFunction<P, Data, Source>,
  initialData?: InitialDataFunction<P, Data>
): CommerceWrapper<P, Data, Source> {
  // Return a function that accepts a component and returns a wrapped component with the commerce
  // data methods applied.
  return (
    WrappedComponent: ComponentClass<P & WithCommerceProps<Data, Source>>
  ): ComponentClass<P & WithCommerceProviderProps<Data, Source>> => {
    return class CommerceProvider extends Component<
      P & WithCommerceProviderProps<Data, Source>,
      WithCommerceState<Data>
    > {
      constructor(props: any) {
        super(props);
        const commerceData = initialData ? initialData(props) : undefined;
        this.state = {
          commerceData,
          isLoading: false,
        };
      }
      componentDidMount(): void {
        if (this.state.commerceData) {
          if (this.props.onDataLoaded) {
            this.props.onDataLoaded(this.state.commerceData);
          }
        } else {
          this.loadData();
        }
      }

      render(): JSX.Element {
        const { onDataLoaded, onDataError, ...props } = this.props as any; // TypeScript does not support rest parameters for generics :(

        return (
          <WrappedComponent
            {...props}
            commerceData={this.state && this.state.commerceData}
            isLoading={this.state && this.state.isLoading}
            commerceLoadData={this.loadData}
            commerceProviderLoadMore={this.loadMore}
          />
        );
      }

      /**
       * Handle errors received while attempting to load new data. Log said errors
       * and pass them into the optional onDataError callback to be further processed.
       */
      private handleLoadingError = (error: Error) => {
        this.setState({
          isLoading: false,
        });
        // TODO: better error handling
        if (this.props.onDataError) {
          this.props.onDataError(error);
        }

        console.error('CommerceProvider Error: ', error);
      };

      /**
       * Updates the component state with the new data and invokes the onDataLoaded callback
       *
       * @param data - New data to repalce state with
       */
      private setData = (data?: Data) => {
        this.setState(
          {
            commerceData: data,
            isLoading: false,
          },
          () => {
            if (this.props.onDataLoaded && data) {
              this.props.onDataLoaded(data);
            }
          }
        );
      };

      /**
       * Trigger the loading of the specified commerce data by invoking the
       * fetchData function passed to withCommerceData.
       *
       * @param data - Optional data to initialize the commerceData in state
       */
      private loadData = (data?: Data) => {
        if (data) {
          return this.setData(data);
        }

        this.setState({
          isLoading: true,
        });
        fetchData(this.props.commerceDataSource, this.props)
          .then(this.setData)
          .catch(this.handleLoadingError);
      };

      /**
       * Query for additional data and append to the current commerce data if an additional
       * page of data is found.
       */
      private loadMore = async (productQuery: ProductQuery): Promise<Data> => {
        const request = fetchData(this.props.commerceDataSource, {
          ...(this.props as any), // TypeScript does not support rest parameters for generics :(
          productQuery,
        });

        this.setState({
          isLoading: true,
        });
        request
          .then((data) => {
            const { commerceData } = this.state;

            if (data && commerceData) {
              if ((commerceData as any).minPage === undefined) {
                (commerceData as any).minPage = (commerceData as any).page;
              }
              (data as any).minPage = (commerceData as any).minPage;
              // TODO: Since the data isn't guarneteed to be Pagable we have to cast to any to check.
              // Figure out a way to not include this function for non-pagable Data types
              if ((data as any).page > (commerceData as any).page) {
                (data as any).products = [
                  ...(commerceData as any).products,
                  ...(data as any).products,
                ];
                this.setData(data);
              } else if ((data as any).page < (commerceData as any).minPage) {
                (data as any).products = [
                  ...(data as any).products,
                  ...(commerceData as any).products,
                ];
                (data as any).minPage = (data as any).page;
                (data as any).page = (commerceData as any).page;
                this.setData(data);
              }
            }
          })
          .catch(this.handleLoadingError);

        // Returning the original request promise here instead of the .then chain so
        // that components downstream can react immediately to the original data
        return request;
      };
    };
  };
}

export default withCommerceData;

import React, { Component, ComponentClass } from 'react';
import { each, find } from 'lodash-es';

import * as ReviewTypes from './ReviewTypes';
import ReviewDataSource from './ReviewDataSource';

export interface WithReviewProps {
  reviewQuery?: ReviewTypes.ReviewQuery;
  reviewProvider?: string;
  reviewProviderConfig?: any;
  reviewProviderDataSource?: ReviewDataSource;
  reviewProviderDoUpdate?(reviewQuery: ReviewTypes.ReviewQuery): void;
  reviewProviderLoadMore?(reviewQuery: ReviewTypes.ReviewQuery): void;
}

export interface WithReviewState {
  reviewsData?: any;
}

const withReviewData = (fetchData: Function) => <P extends {}>(
  WrappedComponent: ComponentClass<P & WithReviewProps>
): ComponentClass<P & WithReviewProps> => {
  type ResultProps = P & WithReviewProps;
  return class ReviewProvider extends Component<ResultProps, WithReviewState> {
    dataSource?: ReviewDataSource;

    constructor(props: ResultProps) {
      super(props);

      const {
        reviewProvider,
        reviewProviderConfig,
        reviewProviderDataSource
      } = props;

      if (reviewProviderDataSource) {
        this.dataSource = reviewProviderDataSource;
      } else if (reviewProvider && reviewProviderConfig) {
        this.dataSource = {
          fetchReviewDetails: async () => Promise.reject('no'),
          fetchReviewStatistics: async () => Promise.reject('no'),
          fetchReviewSummary: async () => Promise.reject('no')
        };
      }
    }

    reviewProviderDoUpdate = (reviewQuery?: ReviewTypes.ReviewQuery) => {
      return fetchData(this.dataSource, reviewQuery)
        .then((data: any) => {
          this.setState({ reviewsData: data });
        })
        .catch((err: any) => {
          // TODO: better error handling
          console.log('Cannot get reviews data', err);
        });
    }

    reviewProviderLoadMore = (reviewQuery: ReviewTypes.ReviewQuery) => {
      return fetchData(this.dataSource, reviewQuery)
        .then((data: any) => {
          // Merge additional reviews and update state
          const { reviewsData } = this.state;
          each(data, (review: any) => {
            const oldReview: any = find(reviewsData, { id: review.id });
            review.reviews = [...oldReview.reviews, ...review.reviews];
          });
          this.setState({ reviewsData: data });
        })
        .catch((err: any) => {
          console.log('Cannot get reviews data', err);
        });
    }

    componentDidMount(): void {
      const { reviewQuery } = this.props;

      // if we have a reviewQuery fetch reviews
      // else reviewProviderDoUpdate will need to be called by a child component
      if (reviewQuery) {
        this.reviewProviderDoUpdate(reviewQuery);
      }
    }

    render(): JSX.Element {
      return (
        <WrappedComponent
          reviewProviderDoUpdate={this.reviewProviderDoUpdate}
          reviewProviderLoadMore={this.reviewProviderLoadMore}
          {...this.props}
          {...this.state}
        />
      );
    }
  };
};

export default withReviewData;

import {
  ReviewDetails,
  ReviewQuery,
  ReviewQuestion,
  ReviewStatistics,
  ReviewSummary
} from './ReviewTypes';

import { Product } from '../Commerce/CommerceTypes';
type ProductReviewIdMapper<T = Product> = (product: T) => string;
type ProductReviewIdKey<T = Product> = keyof T;

// Interface allows for optional methods
export interface ReviewDataSource {
  fetchQuestions?(query: ReviewQuery): Promise<ReviewQuestion[]>;
  fetchReviewDetails(query: ReviewQuery): Promise<ReviewDetails[]>;
  fetchReviewSummary(query: ReviewQuery): Promise<ReviewSummary[]>;
  fetchReviewStatistics(query: ReviewQuery): Promise<ReviewStatistics[]>;
  mergeReviewDetails(...detailsArray: ReviewDetails[][]): ReviewDetails[];
  productIdMapper<T = Product>(
    products: T[],
    idMap: ProductReviewIdKey<T> | ProductReviewIdMapper<T>
  ): string[];
}

export abstract class AbstractReviewDataSource implements ReviewDataSource {
  abstract fetchReviewDetails(query: ReviewQuery): Promise<ReviewDetails[]>;
  abstract fetchReviewSummary(query: ReviewQuery): Promise<ReviewSummary[]>;
  abstract fetchReviewStatistics(query: ReviewQuery): Promise<ReviewStatistics[]>;

  mergeReviewDetails(...detailsArray: ReviewDetails[][]): ReviewDetails[] {
    return detailsArray.reduce((merged, details) => {
      return details.map(detail => {
        const detailInMerged = merged.find(mergedDetail => mergedDetail.id === detail.id);
        if (detailInMerged) {
          detail.reviews = [...detailInMerged.reviews, ...detail.reviews];
        }

        return detail;
      });
    }, []);
  }

  productIdMapper<T = Product>(
    products: T[],
    idMap: ProductReviewIdKey<T> | ProductReviewIdMapper<T>
  ): string[] {
    if (typeof idMap === 'string' || typeof idMap === 'number' || typeof idMap === 'symbol') {
      return products.reduce((ids, product) => {
        const newIds = [...ids];
        const keyValue = product[idMap];
        if (typeof keyValue === 'string') {
          newIds.push(keyValue);
        }

        return newIds;
      }, [] as string[]);
    } else if (typeof idMap === 'function') {
      return products.map(idMap);
    }

    throw new Error('Unable to map products to review ids.');
  }
}

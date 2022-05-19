import type { Product } from '../Commerce/CommerceTypes';

import type {
  ReviewDetails,
  ReviewQuery,
  ReviewQuestion,
  ReviewStatistics,
  ReviewSummary,
  WriteReviewCommand,
  WriteReviewSubmission,
} from './ReviewTypes';

type ProductReviewIdMapper<T = Product> = (product: T) => string;
type ProductReviewIdKey<T = Product> = keyof T;

// Interface allows for optional methods
export interface ReviewDataSource {
  fetchQuestions?: (query: ReviewQuery) => Promise<ReviewQuestion[]>;
  fetchReviewDetails: (query: ReviewQuery) => Promise<ReviewDetails[]>;
  fetchReviewSummary: (query: ReviewQuery) => Promise<ReviewSummary[]>;
  fetchReviewStatistics: (query: ReviewQuery) => Promise<ReviewStatistics[]>;
  mergeReviewDetails: (...detailsArray: ReviewDetails[][]) => ReviewDetails[];
  productIdMapper: <T = Product>(
    products: T[],
    idMap: ProductReviewIdKey<T> | ProductReviewIdMapper<T>
  ) => string[];
}

export interface WriteReviewDataSource {
  writeReview: (command: WriteReviewCommand) => Promise<WriteReviewSubmission>;
}

export abstract class AbstractReviewDataSource implements ReviewDataSource, WriteReviewDataSource {
  public abstract fetchReviewDetails(query: ReviewQuery): Promise<ReviewDetails[]>;
  public abstract fetchReviewSummary(query: ReviewQuery): Promise<ReviewSummary[]>;
  public abstract fetchReviewStatistics(query: ReviewQuery): Promise<ReviewStatistics[]>;

  public abstract writeReview(command: WriteReviewCommand): Promise<WriteReviewSubmission>;

  public mergeReviewDetails(...detailsArray: ReviewDetails[][]): ReviewDetails[] {
    return detailsArray.reduce(
      (merged, details) =>
        details.map((detail) => {
          const detailInMerged = merged.find((mergedDetail) => mergedDetail.id === detail.id);
          if (detailInMerged) {
            detail.reviews = [...detailInMerged.reviews, ...detail.reviews];
          }

          return detail;
        }),
      []
    );
  }

  public productIdMapper<T = Product>(
    products: T[],
    idMap: ProductReviewIdKey<T> | ProductReviewIdMapper<T>
  ): string[] {
    if (typeof idMap === 'string' || typeof idMap === 'number' || typeof idMap === 'symbol') {
      return products.reduce<string[]>((ids, product) => {
        const newIds = [...ids];
        const keyValue = product[idMap];
        if (typeof keyValue === 'string') {
          newIds.push(keyValue);
        }

        return newIds;
      }, []);
    } else if (typeof idMap === 'function') {
      return products.map(idMap);
    }

    throw new Error('Unable to map products to review ids.');
  }
}

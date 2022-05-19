import type { ReviewTypes } from '@brandingbrand/fscommerce';

import { Products } from './Products';
import { boolean, city, name, number, paragraphs, sentence, state } from './RandomValues';

type ReviewUser = ReviewTypes.ReviewUser;
type ReviewQuestion = ReviewTypes.ReviewQuestion;
type Review = ReviewTypes.Review;
type ReviewsMap = Record<string, Review[]>;
type ReviewQuestionsMap = Record<string, ReviewQuestion[]>;

const generateReviewUser = (): ReviewUser => ({
  isStaffReviewer: boolean(),
  isVerifiedBuyer: boolean(),
  isVerifiedReviewer: boolean(),
  location: `${city()}, ${state()}`,
  name: name(),
});

const generateReview = (): Review => {
  const rating = number(1, 6);

  return {
    title: sentence(3, 10, ''),
    text: paragraphs(),
    rating,
    isRecommended: rating > 3,
    user: generateReviewUser(),
  };
};

const generateQuestion = (): ReviewQuestion => ({
  text: sentence(5, 20, '?'),
  answers: new Array(number()).fill(null).map(() => ({
    text: boolean() ? sentence() : paragraphs(),
  })),
});

const Reviews: ReviewsMap = Products.reduce<ReviewsMap>((reviews, { id }) => {
  if (!Array.isArray(reviews[id])) {
    reviews[id] = [];
  }

  const fakedReviews = new Array(number()).fill(null).map(generateReview);
  reviews[id] = [...(reviews[id] ?? []), ...fakedReviews];
  return reviews;
}, {});

const Questions: ReviewQuestionsMap = Products.reduce<ReviewQuestionsMap>((questions, { id }) => {
  if (!Array.isArray(questions[id])) {
    questions[id] = [];
  }

  const fakedQuestions = new Array(number()).fill(null).map(generateQuestion);
  questions[id] = [...(questions[id] ?? []), ...fakedQuestions];
  return questions;
}, {});

export { Reviews, Questions };

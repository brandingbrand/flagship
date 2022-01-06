import { Products } from './Products';
import { boolean, city, name, number, paragraphs, sentence, state } from './RandomValues';

type ReviewUser = import('@brandingbrand/fscommerce').ReviewTypes.ReviewUser;
type ReviewQuestion = import('@brandingbrand/fscommerce').ReviewTypes.ReviewQuestion;
type Review = import('@brandingbrand/fscommerce').ReviewTypes.Review;
type ReviewsMap = import('@brandingbrand/fsfoundation').Dictionary<Review[]>;
type ReviewQuestionsMap = import('@brandingbrand/fsfoundation').Dictionary<ReviewQuestion[]>;

function generateReviewUser(): ReviewUser {
  return {
    isStaffReviewer: boolean(),
    isVerifiedBuyer: boolean(),
    isVerifiedReviewer: boolean(),
    location: `${city()}, ${state()}`,
    name: name(),
  };
}

function generateReview(): Review {
  const rating = number(1, 6);

  return {
    title: sentence(3, 10, ''),
    text: paragraphs(),
    rating,
    isRecommended: rating > 3,
    user: generateReviewUser(),
  };
}

function generateQuestion(): ReviewQuestion {
  return {
    text: sentence(5, 20, '?'),
    answers: Array(number())
      .fill(null)
      .map(() => ({
        text: boolean() ? sentence() : paragraphs(),
      })),
  };
}

const Reviews: ReviewsMap = Products.reduce<ReviewsMap>((reviews, { id }) => {
  if (!Array.isArray(reviews[id])) {
    reviews[id] = [];
  }

  const fakedReviews = Array(number()).fill(null).map(generateReview);
  reviews[id] = [...reviews[id], ...fakedReviews];
  return reviews;
}, {});

const Questions: ReviewQuestionsMap = Products.reduce<ReviewQuestionsMap>((questions, { id }) => {
  if (!Array.isArray(questions[id])) {
    questions[id] = [];
  }

  const fakedQuestions = Array(number()).fill(null).map(generateQuestion);
  questions[id] = [...questions[id], ...fakedQuestions];
  return questions;
}, {});

export { Reviews, Questions };

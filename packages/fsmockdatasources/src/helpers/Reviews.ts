import faker from 'faker';
import { Products } from './Products';

type ReviewUser = import ('@brandingbrand/fscommerce').ReviewTypes.ReviewUser;
type ReviewQuestion = import ('@brandingbrand/fscommerce').ReviewTypes.ReviewQuestion;
type Review = import ('@brandingbrand/fscommerce').ReviewTypes.Review;
type ReviewsMap = import ('@brandingbrand/fsfoundation').Dictionary<Review[]>;
type ReviewQuestionsMap = import ('@brandingbrand/fsfoundation').Dictionary<ReviewQuestion[]>;

function generateReviewUser(): ReviewUser {
  return {
    isStaffReviewer: faker.random.boolean(),
    isVerifiedBuyer: faker.random.boolean(),
    isVerifiedReviewer: faker.random.boolean(),
    location: `${faker.address.city()}, ${faker.address.stateAbbr()}`,
    name: faker.name.findName()
  };
}

function generateReview(): Review {
  const rating = faker.random.number({ min: 1, max: 5 });
  return {
    title: faker.lorem.sentence(),
    text: faker.lorem.paragraphs(),
    rating,
    isRecommended: rating > 3,
    user: generateReviewUser()
  };
}

function generateQuestion(): ReviewQuestion {
  return {
    text: faker.lorem.sentence().replace('.', '?'),
    answers: Array(faker.random.number(10)).fill(null).map(() => ({
      text: faker.random.boolean() ? faker.lorem.sentence() : faker.lorem.paragraphs()
    }))
  };
}

const Reviews: ReviewsMap = Products.reduce<ReviewsMap>((reviews, { id }) => {
  if (!Array.isArray(reviews[id])) {
    reviews[id] = [];
  }

  const fakedReviews = Array(faker.random.number(10)).fill(null).map(generateReview);
  reviews[id] = [...reviews[id], ...fakedReviews];
  return reviews;
}, {});

const Questions: ReviewQuestionsMap = Products.reduce<ReviewQuestionsMap>((questions, { id }) => {
  if (!Array.isArray(questions[id])) {
    questions[id] = [];
  }

  const fakedQuestions = Array(faker.random.number(10)).fill(null).map(generateQuestion);
  questions[id] = [...questions[id], ...fakedQuestions];
  return questions;
}, {});

export { Reviews, Questions };

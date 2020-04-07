import {
  ReviewTypes
} from '@brandingbrand/fscommerce';
import { BazaarvoiceWriteReviewRequest } from './BazaarvoiceWriteReviewRequest';

interface StringDictionary { [key: string]: string; }

export function writeReviewParams(
  command: ReviewTypes.WriteReviewCommand
): BazaarvoiceWriteReviewRequest {
  return {
    Action: command.actionType,
    ProductId: command.productId,
    Rating: command.rating,
    ReviewText: command.reviewText,
    AgreedToTermsAndConditions: command.agreedToTermsAndConditions,
    CampaignId: command.campaignId,
    IsRecommended: command.isRecommended,
    Title: command.title,
    User: command.user,
    UserEmail: command.userEmail,
    UserId: command.userId,
    UserLocation: command.userLocation,
    UserNickname: command.userNickname
  };
}

export function mapAdditionalFields(
  propPrefix: string,
  objectToMap?: StringDictionary
): StringDictionary {
  if (!objectToMap) {
    return {};
  }

  // tslint:disable-next-line:no-inferred-empty-object-type
  return Object.keys(objectToMap)
    .reduce((additionalFields: StringDictionary, key: string): StringDictionary => {
      return {
        ...additionalFields,
        [`${propPrefix}_${key}`]: objectToMap[key]
      };
    }, {});
}

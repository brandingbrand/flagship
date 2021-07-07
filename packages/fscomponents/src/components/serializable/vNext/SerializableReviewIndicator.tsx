import { FC } from 'react';
import { ViewStyle } from 'react-native';
import { ReviewIndicator, ReviewIndicatorProps } from '../../ReviewIndicator';

type SerializableProps = Omit<ReviewIndicatorProps,
  | 'style'
  | 'renderFullStar'
  | 'renderHalfStar'
  | 'renderEmptyStar'
>;

export interface SerializableReviewIndicatorProps extends SerializableProps {
  style?: ViewStyle;
}

export const SerializableReviewIndicator: FC<SerializableReviewIndicatorProps> =
  ReviewIndicator as FC<SerializableReviewIndicatorProps>;

/* tslint:disable:cyclomatic-complexity */

import React, { Component } from 'react';
import {
  Image,
  ImageStyle,
  ImageURISource,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';

import { ReviewTypes } from '@brandingbrand/fscommerce';
import { ReviewIndicator, ReviewIndicatorProps } from './ReviewIndicator';
import { MoreText, MoreTextProps } from './MoreText';
import { Button } from './Button';
import { style as S } from '../styles/ReviewItem';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
const componentTranslationKeys = translationKeys.flagship.reviews;

export interface ReviewItemProps extends ReviewTypes.Review {
  recommendedImage?: ImageURISource;
  verifiedImage?: ImageURISource;

  // style
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  userStyle?: StyleProp<TextStyle>;
  rowStyle?: StyleProp<ViewStyle>;
  verifiedStyle?: StyleProp<TextStyle>;
  verifiedImageStyle?: StyleProp<ImageStyle>;
  verifiedRowStyle?: StyleProp<ViewStyle>;
  helpfulStyle?: StyleProp<TextStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  moreTextStyle?: StyleProp<TextStyle>;
  recommendedStyle?: StyleProp<ViewStyle>;
  recommendedImageStyle?: StyleProp<ImageStyle>;
  recommendedImageBoxStyle?: StyleProp<ViewStyle>;
  recommendedRowStyle?: StyleProp<ViewStyle>;

  // children
  reviewIndicatorProps?: ReviewIndicatorProps;
  moreTextProps?: MoreTextProps;

  // buttons
  onHelpful?: (props: ReviewItemProps) => void;
  onNotHelpful?: (props: ReviewItemProps) => void;
}

export class ReviewItem extends Component<ReviewItemProps> {
  onHelpful = () => {
    const { onHelpful } = this.props;
    if (onHelpful) {
      onHelpful(this.props);
    }
  }

  onNotHelpful = () => {
    const { onNotHelpful } = this.props;
    if (onNotHelpful) {
      onNotHelpful(this.props);
    }
  }

  render(): JSX.Element {
    const {
      rating,
      title,
      text = '',
      user,
      created,
      verifiedImage,
      feedback,
      reviewIndicatorProps = {},
      moreTextProps = {},
      style,
      titleStyle,
      userStyle,
      verifiedStyle,
      verifiedImageStyle,
      verifiedRowStyle,
      helpfulStyle,
      buttonStyle,
      rowStyle,
      onHelpful,
      onNotHelpful,
      moreTextStyle,
      recommendedImage,
      recommendedStyle,
      recommendedImageStyle,
      recommendedImageBoxStyle,
      recommendedRowStyle,
      isRecommended
    } = this.props;

    return (
      <View style={[S.container, style]}>
        <View style={[S.row, rowStyle]}>
          <ReviewIndicator
            value={rating}
            style={S.indicator}
            {...reviewIndicatorProps}
          />
          {title && (
            <Text style={[S.title, titleStyle]}>{title}</Text>
          )}
        </View>
        {(user || created) && (
        <View style={[S.row, rowStyle]}>
          <Text style={[S.user, userStyle]}>
            {user && user.name && 'By ' + user.name}
            {(created ? ' on ' + (new Date(created)).toLocaleDateString() : '')}
          </Text>
        </View>
        )}
        {user && user.isVerifiedBuyer && (
          <View style={[S.row, { paddingBottom: 3 }, rowStyle, verifiedRowStyle]}>
            {verifiedImage && (
              <Image style={verifiedImageStyle} source={verifiedImage} />
            )}
            <Text style={[S.verified, verifiedStyle]}>
              {FSI18n.string(componentTranslationKeys.verified)}
            </Text>
          </View>
        )}
        {!!text && (
          <MoreText
            text={text}
            textMoreLessStyle={moreTextStyle}
            containerStyle={S.row}
            numberOfCharacters={325}
            {...moreTextProps}
          />
        )}
        {isRecommended !== undefined && (
          <View style={[S.row, rowStyle, recommendedRowStyle]}>
            {recommendedImage && (
              <View style={recommendedImageBoxStyle}>
                <Image style={recommendedImageStyle} source={recommendedImage} />
              </View>
            )}
            <Text style={[S.recommended, recommendedStyle]}>
              {isRecommended ?
                FSI18n.string(componentTranslationKeys.recommended) :
                FSI18n.string(componentTranslationKeys.notRecommended)}
            </Text>
          </View>
        )}
        {feedback && feedback.positive && (
        <View style={[S.row, rowStyle]}>
          <Text style={[S.helpful, helpfulStyle]}>
            {FSI18n.string(componentTranslationKeys.helpfulCount, {
              count: feedback.positive
            })}
          </Text>
        </View>
        )}
        {onHelpful && onNotHelpful && (
        <View style={[S.row, { flexDirection: 'row' }, rowStyle]}>
          <Button
            title={FSI18n.string(componentTranslationKeys.helpful)}
            light
            onPress={this.onHelpful}
            style={[S.button, buttonStyle]}
          />
          <Button
            title={FSI18n.string(componentTranslationKeys.notHelpful)}
            light
            onPress={this.onNotHelpful}
            style={[S.button, buttonStyle]}
          />
        </View>
        )}
      </View>
    );
  }
}

import React, { Component } from 'react';

import type { ImageStyle, ImageURISource, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Image, Text, View } from 'react-native';

import type { ReviewTypes } from '@brandingbrand/fscommerce';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

import { style as S } from '../styles/ReviewItem';

import { Button } from './Button';
import type { MoreTextProps } from './MoreText';
import { MoreText } from './MoreText';
import type { ReviewIndicatorProps } from './ReviewIndicator';
import { ReviewIndicator } from './ReviewIndicator';
import { SyndicationIndicator } from './SyndicationIndicator';

const componentTranslationKeys = translationKeys.flagship.reviews;

export enum RecommendationDisplayTypes {
  Never,
  Always,
  PositiveOnly,
  NegativeOnly,
}

export interface ReviewItemProps extends ReviewTypes.Review {
  recommendedImage?: ImageURISource;
  verifiedImage?: ImageURISource;
  showRecommendations?: RecommendationDisplayTypes;
  indicateSyndicated?: boolean;
  renderSyndicatedIndicator?: (syndicationSource: ReviewTypes.SyndicationSource) => JSX.Element;

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
  reviewIndicatorProps?: Partial<ReviewIndicatorProps>;
  moreTextProps?: MoreTextProps;

  // buttons
  onHelpful?: (props: ReviewItemProps) => void;
  onNotHelpful?: (props: ReviewItemProps) => void;
}

export interface ReviewItemState {
  syndicatedImageHeight?: number;
  syndicatedImageWidth?: number;
}

export class ReviewItem extends Component<ReviewItemProps, ReviewItemState> {
  constructor(props: ReviewItemProps) {
    super(props);

    this.state = {
      syndicatedImageHeight: 0,
      syndicatedImageWidth: 0,
    };
  }

  private readonly onHelpful = () => {
    const { onHelpful } = this.props;
    if (onHelpful) {
      onHelpful(this.props);
    }
  };

  private readonly onNotHelpful = () => {
    const { onNotHelpful } = this.props;
    if (onNotHelpful) {
      onNotHelpful(this.props);
    }
  };

  private readonly renderSyndicatedIndicator = (): JSX.Element | undefined => {
    if (this.props.syndicationSource && this.props.syndicationSource.LogoImageUrl) {
      if (this.props.renderSyndicatedIndicator) {
        return this.props.renderSyndicatedIndicator(this.props.syndicationSource);
      }
      return (
        <SyndicationIndicator
          rowStyle={this.props.rowStyle}
          syndicationSource={this.props.syndicationSource}
        />
      );
    }

    return undefined;
  };

  /**
   * Display whether an item is recommended or not recommended for the user. This will only be
   * displayed if isRecommended is a boolean, as null or undefined indicate that the feature isn't
   * configured in the review API.
   *
   * In addition, whether and how the recommendations are displayed is controlled by the
   * showRecommendations prop:
   *   - Always (default): recommendations are displayed whether recommended or not
   *   - PositiveOnly: recommendations are only displayed if the product is recommended
   *   - NegativeOnly: recommendations are only displayed if the product is not recommended
   *   - Never: recommendations are never displayed
   */
  private readonly renderRecommendation = (): React.ReactNode => {
    const {
      isRecommended,
      recommendedImage,
      recommendedImageBoxStyle,
      recommendedImageStyle,
      recommendedRowStyle,
      recommendedStyle,
      rowStyle,
      showRecommendations,
    } = this.props;

    const shouldDisplay =
      (isRecommended === false || isRecommended === true) &&
      (showRecommendations === undefined || // Backwards compatibility: always display if not set
        showRecommendations === RecommendationDisplayTypes.Always ||
        (isRecommended && showRecommendations === RecommendationDisplayTypes.PositiveOnly) ||
        (!isRecommended && showRecommendations === RecommendationDisplayTypes.NegativeOnly));

    if (shouldDisplay) {
      return (
        <View style={[S.row, rowStyle, recommendedRowStyle]}>
          {recommendedImage ? (
            <View style={recommendedImageBoxStyle}>
              <Image source={recommendedImage} style={recommendedImageStyle} />
            </View>
          ) : null}
          <Text style={[S.recommended, recommendedStyle]}>
            {isRecommended
              ? FSI18n.string(componentTranslationKeys.recommended)
              : FSI18n.string(componentTranslationKeys.notRecommended)}
          </Text>
        </View>
      );
    }

    return null;
  };

  public render(): JSX.Element {
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
      isSyndicated,
      indicateSyndicated,
      syndicationSource,
    } = this.props;

    return (
      <View style={[S.container, style]}>
        <View style={[S.row, rowStyle]}>
          <ReviewIndicator style={S.indicator} value={rating} {...reviewIndicatorProps} />
          {title ? <Text style={[S.title, titleStyle]}>{title}</Text> : null}
        </View>
        {user || created ? (
          <View style={[S.row, rowStyle]}>
            <Text style={[S.user, userStyle]}>
              {user && user.name ? `By ${user.name}` : null}
              {created ? ` on ${new Date(created).toLocaleDateString()}` : ''}
            </Text>
          </View>
        ) : null}
        {user && user.isVerifiedBuyer ? (
          <View style={[S.row, { paddingBottom: 3 }, rowStyle, verifiedRowStyle]}>
            {verifiedImage ? <Image source={verifiedImage} style={verifiedImageStyle} /> : null}
            <Text style={[S.verified, verifiedStyle]}>
              {FSI18n.string(componentTranslationKeys.verified)}
            </Text>
          </View>
        ) : null}
        {Boolean(text) && (
          <MoreText
            containerStyle={S.row}
            numberOfCharacters={325}
            text={text}
            textMoreLessStyle={moreTextStyle}
            {...moreTextProps}
          />
        )}
        {this.renderRecommendation()}
        {feedback && feedback.positive ? (
          <View style={[S.row, rowStyle]}>
            <Text style={[S.helpful, helpfulStyle]}>
              {FSI18n.string(componentTranslationKeys.helpfulCount, {
                count: feedback.positive,
              })}
            </Text>
          </View>
        ) : null}
        {indicateSyndicated && isSyndicated && syndicationSource
          ? this.renderSyndicatedIndicator()
          : null}
        {onHelpful && onNotHelpful ? (
          <View style={[S.row, { flexDirection: 'row' }, rowStyle]}>
            <Button
              light
              onPress={this.onHelpful}
              style={[S.button, buttonStyle]}
              title={FSI18n.string(componentTranslationKeys.helpful)}
            />
            <Button
              light
              onPress={this.onNotHelpful}
              style={[S.button, buttonStyle]}
              title={FSI18n.string(componentTranslationKeys.notHelpful)}
            />
          </View>
        ) : null}
      </View>
    );
  }
}

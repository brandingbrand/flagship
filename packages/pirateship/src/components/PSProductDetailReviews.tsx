import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import {
  Loading,
  ReviewsList,
  ReviewsSummary
} from '@brandingbrand/fscomponents';

import {
  ReviewDataSource,
  ReviewTypes
} from '@brandingbrand/fscommerce';

import * as variables from '../styles/variables';
import translate, { translationKeys } from '../lib/translations';

const kFlexStart = 'flex-start';

const icons = {
  verified: require('../../assets/images/verified-purchaser.png'),
  checkmark: require('../../assets/images/white-checkmark.png')
};

const styles = StyleSheet.create({
  reviews: {
    paddingHorizontal: variables.padding.base
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadMore: {
    height: 40,
    marginTop: 15,
    marginBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: variables.border.color,
    borderWidth: variables.border.width,
    backgroundColor: 'white'
  },
  loadingMore: {
    height: 40,
    marginTop: 15,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export interface ProductDetailReviewsProps {
  reviewQuery: ReviewTypes.ReviewQuery;
  reviewDataSource: ReviewDataSource;
}

export interface ProductDetailReviewState {
  hasMore: boolean;
  loadingMore: boolean;
  reviewsData?: ReviewTypes.ReviewDetails[];
}

export default class PSProductDetailReviews extends
Component<ProductDetailReviewsProps, ProductDetailReviewState> {
  constructor(props: ProductDetailReviewsProps) {
    super(props);

    this.state = {
      hasMore: false,
      loadingMore: false
    };
  }

  async componentDidMount(): Promise<void> {
    const { reviewDataSource, reviewQuery } = this.props;

    const reviewsData = await reviewDataSource.fetchReviewDetails(reviewQuery);
    const { page, limit, total } = reviewsData[0];
    const hasMore = page && limit && total ? (page * limit) < total : false;

    this.setState({
      reviewsData,
      hasMore,
      loadingMore: false
    });
  }

  loadMoreReviews = async () => {
    const { reviewDataSource, reviewQuery } = this.props;
    const { reviewsData } = this.state;

    if (!Array.isArray(reviewsData) || !reviewsData[0] || reviewsData[0].page === undefined) {
      return;
    }

    this.setState({ loadingMore: true });

    const newReviewsData = await reviewDataSource.fetchReviewDetails({
      ...reviewQuery,
      page: reviewsData[0].page as number + 1
    });

    this.setState({
      loadingMore: false,
      reviewsData: reviewDataSource.mergeReviewDetails(reviewsData, newReviewsData)
    });
  }

  renderLoadMore = () => {
    const { hasMore, loadingMore } = this.state;
    if (!hasMore) {
      return undefined;
    }

    if (loadingMore) {
      return <Loading style={styles.loadingMore} />;
    } else {
      return (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.loadMore}
            onPress={this.loadMoreReviews}
          >
            <Text>{translate.string(translationKeys.screens.productDetail.loadMore)}</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  render(): JSX.Element {
    const { reviewsData } = this.state;

    if (!reviewsData) {
      return <Loading style={{ marginTop: 80 }} />;
    }

    const { reviews, statistics } = reviewsData[0];

    return (
      <View style={styles.reviews}>
        {statistics && (
          <ReviewsSummary
            value={statistics.averageRating}
            count={statistics.reviewCount}
            style={{
              padding: 0,
              paddingTop: 10,
              paddingBottom: 10,
              borderBottomWidth: variables.border.width,
              borderBottomColor: variables.border.color
            }}
            hideReviewIndicatorSubtitle={true}
            reviewIndicatorTitleText={'Overall'}
            reviewIndicatorTitleTextStyle={{
              flex: 1,
              fontWeight: 'bold',
              fontSize: 15
            }}
            reviewIndicatorRowStyle={{ borderBottomColor: variables.border.color }}
          />
        )}
        <ReviewsList
          reviews={reviews}
          recommendedImage={icons.checkmark}
          verifiedImage={icons.verified}
          reviewStyle={{
            style: {
              padding: 0,
              paddingTop: 10,
              paddingBottom: 10,
              borderBottomWidth: variables.border.width,
              borderBottomColor: variables.border.color
            },
            titleStyle: {
              paddingLeft: 0,
              paddingTop: 10
            },
            rowStyle: {
              paddingTop: 10
            },
            verifiedStyle: {
              fontSize: 11,
              paddingBottom: 10,
              paddingLeft: 10
            },
            recommendedStyle: {
              fontSize: 11
            },
            recommendedRowStyle: {
              flex: 1,
              flexDirection: 'row',
              alignItems: kFlexStart,
              alignContent: kFlexStart
            },
            recommendedImageStyle: {
              height: 10,
              width: 10,
              overflow: 'visible',
              borderRadius: 5
            },
            recommendedImageBoxStyle: {
              backgroundColor: variables.color.black,
              overflow: 'visible',
              height: 16,
              width: 16,
              borderRadius: 8,
              flex: 0,
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
              marginRight: 10
            },
            verifiedRowStyle: {
              flex: 1,
              justifyContent: kFlexStart,
              flexDirection: 'row'
            },
            moreTextStyle: {
              color: variables.palette.secondary
            }
          }}
        />
        {this.renderLoadMore()}
      </View>
    );
  }
}

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
  ReviewTypes,
  withReviewData,
  WithReviewProps,
  WithReviewState
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

export interface ProductDetailReviewsProps extends
WithReviewProps,
WithReviewState {

}

export interface ProductDetailReviewState {
  hasMore: boolean;
  loadingMore: boolean;
}

class PSProductDetailReviewsComponent extends
Component<ProductDetailReviewsProps, ProductDetailReviewState> {
  constructor(props: ProductDetailReviewsProps) {
    super(props);

    this.state = {
      hasMore: false,
      loadingMore: false
    };
  }

  componentWillReceiveProps(nextProps: ProductDetailReviewsProps): void {
    const { reviewsData } = nextProps;
    if (reviewsData && reviewsData[0]) {
      const { page, limit, total } = reviewsData[0];
      const hasMore = page && limit && total ? (page * limit) < total : false;
      this.setState({
        hasMore,
        loadingMore: false
      });
    }
  }

  loadMoreReviews = () => {
    const { reviewProviderLoadMore, reviewsData } = this.props;
    if (!reviewProviderLoadMore || !reviewsData || typeof reviewsData[0].page === 'undefined') {
      return;
    }

    this.setState({ loadingMore: true });

    reviewProviderLoadMore({
      ids: reviewsData[0].id,
      page: reviewsData[0].page as number + 1
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
    const { reviewsData } = this.props;

    if (!reviewsData) {
      return <Loading style={{ marginTop: 80 }} />;
    }

    // TODO: Update this when reviewsData has a proper type
    /* tslint:disable-next-line:no-unnecessary-type-assertion */
    const { reviews = [], statistics } = reviewsData[0] as ReviewTypes.ReviewDetails;
    const _reviews = reviews.map(r => {
      const recommendText = r.isRecommended ?
                            'Yes, I recommend this product.' :
                            'No, I do not reccommend this product.';
      const recommendedImage = r.isRecommended ? icons.checkmark : null;
      // TODO: Update this to use the proper ReviewBadge[] type
      /* tslint:disable-next-line:no-unnecessary-type-assertion */
      const badges = r.badges as any;
      const verified = badges && badges.verifiedPurchaser;
      const verifiedImage = verified ? icons.verified : null;

      return {
        ...r,
        text: r.text || '',
        title: r.title || null,
        recommendedText: recommendText,
        recommendedImage,
        verified,
        verifiedImage
      };
    });

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
          reviews={_reviews}
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

const PSProductDetailReviews = withReviewData(
  async (DataSource: ReviewDataSource, reviewQuery: ReviewTypes.ReviewQuery) =>
    DataSource.fetchReviewDetails(reviewQuery)
)(PSProductDetailReviewsComponent);

export default PSProductDetailReviews;

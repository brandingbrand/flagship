import React, { Component } from 'react';
import { Options } from 'react-native-navigation';

import PSScreenWrapper from '../components/PSScreenWrapper';
import PSProductDetailReviews from '../components/PSProductDetailReviews';
import { ScreenProps } from '../lib/commonTypes';
import { backButton } from '../lib/navStyles';
import { navBarNoTabs, titleDefault } from '../styles/Navigation';
import translate, { translationKeys } from '../lib/translations';
import { reviewDataSource } from '../lib/datasource';

export interface ProductDetailReviewsProps extends ScreenProps {
  reviewQuery: import ('@brandingbrand/fscommerce').ReviewTypes.ReviewQuery;
}

export default class ProductDetailReviews extends Component<ProductDetailReviewsProps> {
  static options: Options = {
    ...navBarNoTabs,
    topBar: {
      ...navBarNoTabs.topBar,
      title: {
        ...titleDefault,
        text: translate.string(translationKeys.screens.productDetail.reviewsTitle)
      },
      leftButtons: [backButton.button]
    }
  }

  render(): JSX.Element {

    return (
      <PSScreenWrapper
        hideGlobalBanner={true}
      >
        <PSProductDetailReviews
          reviewQuery={this.props.reviewQuery}
          reviewDataSource={reviewDataSource}
        />
      </PSScreenWrapper>
    );
  }
}

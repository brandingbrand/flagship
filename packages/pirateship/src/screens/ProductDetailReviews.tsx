import React, { Component } from 'react';

import PSScreenWrapper from '../components/PSScreenWrapper';
import PSProductDetailReviews from '../components/PSProductDetailReviews';
import { NavButton, NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import { backButton } from '../lib/navStyles';
import { navBarNoTabs } from '../styles/Navigation';
import translate, { translationKeys } from '../lib/translations';
import { reviewDataSource } from '../lib/datasource';

export interface ProductDetailReviewsProps extends ScreenProps {
  reviewQuery: import ('@brandingbrand/fscommerce').ReviewTypes.ReviewQuery;
}

export default class ProductDetailReviews extends Component<ProductDetailReviewsProps> {
  static navigatorStyle: NavigatorStyle = navBarNoTabs;
  static leftButtons: NavButton[] = [backButton];

  constructor(props: ProductDetailReviewsProps) {
    super(props);
    props.navigator.setTitle({
      title: translate.string(translationKeys.screens.productDetail.reviewsTitle)
    });
  }

  render(): JSX.Element {
    const { navigator } = this.props;

    return (
      <PSScreenWrapper
        hideGlobalBanner={true}
        navigator={navigator}
      >
        <PSProductDetailReviews
          reviewQuery={this.props.reviewQuery}
          reviewDataSource={reviewDataSource}
        />
      </PSScreenWrapper>
    );
  }
}

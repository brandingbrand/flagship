import React, { Component } from 'react';

import PSScreenWrapper from '../components/PSScreenWrapper';
import PSProductDetailReviews from '../components/PSProductDetailReviews';
import { NavButton, NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import { backButton } from '../lib/navStyles';
import { navBarNoTabs } from '../styles/Navigation';
import translate, { translationKeys } from '../lib/translations';

export interface ProductDetailReviewsProps extends ScreenProps {
  reviewQuery: any;
  reviewProviderDataSource: any;
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

    return (
      <PSScreenWrapper hideGlobalBanner={true}>
        <PSProductDetailReviews
          reviewQuery={this.props.reviewQuery}
          reviewProviderDataSource={this.props.reviewProviderDataSource}
        />
      </PSScreenWrapper>
    );
  }
}

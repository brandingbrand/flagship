import React, { Component } from 'react';

import { Platform } from 'react-native';
import { dataSource, reviewDataSource } from '../lib/datasource';
import { NavButton, NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import { backButton } from '../lib/navStyles';
import { navBarDefault, navBarProductDetail } from '../styles/Navigation';
import PSScreenWrapper from '../components/PSScreenWrapper';
import { PSProductDetail } from '../components/PSProductDetail';
import PSRecentlyViewedCarousel from '../components/PSRecentlyViewedCarousel';

import withAccount, { AccountProps } from '../providers/accountProvider';
import withRecentlyViewed, {
  RecentlyViewedProps
} from '../providers/recentlyViewedProvider';

// Seeing an Android issue in which if the user clicks on one of the PDP tabs and then goes
// back, the back buttons are invisible. Until we can investigate deeper we'll just make
// the PDP have a dark header. -BW
const NAVIGATOR_STYLE = Platform.OS === 'android' ? navBarDefault : navBarProductDetail;

export interface ProductDetailProps
  extends ScreenProps,
    AccountProps,
    RecentlyViewedProps {
  productId: string; // passed by Navigator
}

class ProductDetail extends Component<ProductDetailProps> {
  static navigatorStyle: NavigatorStyle = NAVIGATOR_STYLE;
  static leftButtons: NavButton[] = [backButton];

  onOpenHTMLView = (html: string, title?: string) => {
    this.props.navigator.push({
      screen: 'DesktopPassthrough',
      title,
      passProps: {
        html
      }
    });
  }

  render(): JSX.Element {
    const { navigator, productId } = this.props;

    return (
      <PSScreenWrapper
        needInSafeArea={true}
        hideGlobalBanner={true}
        navigator={navigator}
      >
        <PSProductDetail
          id={productId}
          commerceDataSource={dataSource}
          reviewDataSource={reviewDataSource}
          commerceToReviewMap={'id'}
          navigator={navigator}
          onOpenHTMLView={this.onOpenHTMLView}
          addToRecentlyViewed={this.props.addToRecentlyViewed}
          recentlyViewed={this.props.recentlyViewed}
          loadRecentlyViewed={this.props.loadRecentlyViewed}
        />
        {this.renderRecentlyViewed()}
      </PSScreenWrapper>
    );
  }

  doesProductExist = (items: any[], productId: string) => {
    return items && items.findIndex(product => product.id === productId) > -1;
  }

  goBack = () => {
    this.props.navigator.pop();
  }

  renderRecentlyViewed = () => {
    const recentItems = (this.props.recentlyViewed.items || []).filter(
      item => item.id !== this.props.productId
    );
    if (!recentItems.length) {
      return;
    }

    return (
      <PSRecentlyViewedCarousel
        items={recentItems}
        navigator={this.props.navigator}
      />
    );
  }
}

export default withAccount(withRecentlyViewed(ProductDetail));

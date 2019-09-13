import React, { Component } from 'react';
import { Navigation, Options } from 'react-native-navigation';
import { dataSource, reviewDataSource } from '../lib/datasource';
import { NavButton, ScreenProps } from '../lib/commonTypes';
import { backButton } from '../lib/navStyles';
import { navBarProductDetail } from '../styles/Navigation';
import PSScreenWrapper from '../components/PSScreenWrapper';
import { PSProductDetail } from '../components/PSProductDetail';
import PSRecentlyViewedCarousel from '../components/PSRecentlyViewedCarousel';

import withAccount, { AccountProps } from '../providers/accountProvider';
import withRecentlyViewed, {
  RecentlyViewedProps
} from '../providers/recentlyViewedProvider';

export interface ProductDetailProps
  extends ScreenProps,
    AccountProps,
    RecentlyViewedProps {
  productId: string; // passed by Navigator
  renderShareIcon?: () => React.ReactNode;
}

class ProductDetail extends Component<ProductDetailProps> {
  static options: Options = navBarProductDetail;
  static leftButtons: NavButton[] = [backButton];
  onOpenHTMLView = (html: string, title?: string) => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'DesktopPassthrough',
        options: {
          topBar: {
            title: {
              text: title
            }
          }
        },
        passProps: {
          html
        }
      }
    }).catch(e => console.warn('DesktopPassthrough PUSH error: ', e));
  }

  render(): JSX.Element {
    const { componentId, productId } = this.props;

    return (
      <PSScreenWrapper
        needInSafeArea={true}
        hideGlobalBanner={true}
      >
        <PSProductDetail
          id={productId}
          commerceDataSource={dataSource}
          reviewDataSource={reviewDataSource}
          commerceToReviewMap={'id'}
          componentId={componentId}
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
    Navigation.pop(this.props.componentId)
    .catch(e => console.warn('POP error: ', e));
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
        componentId={this.props.componentId}
      />
    );
  }
}

export default withAccount(withRecentlyViewed(ProductDetail));

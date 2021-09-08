import React, { Component } from 'react';

import {
  Image,
  Keyboard,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Options } from 'react-native-navigation';
import { fromPairs } from 'lodash-es';

import { Grid, GridRenderItem, makeGridItem, SearchBar } from '@brandingbrand/fscomponents';
import { env as projectEnv } from '@brandingbrand/fsapp';

import PSScreenWrapper from '../components/PSScreenWrapper';
import PSWelcome from '../components/PSWelcome';
import PSHeroCarousel, {
  PSHeroCarouselItem
} from '../components/PSHeroCarousel';
import PSButton from '../components/PSButton';
import PSShopLandingCategories from '../components/PSShopLandingCategories';

import { openSignInModal } from '../lib/shortcuts';
import { handleDeeplink } from '../lib/deeplinkHandler';
import GlobalStyle from '../styles/Global';
import { border, color, fontSize, palette } from '../styles/variables';
import { navBarFullBleed } from '../styles/Navigation';
import { ScreenProps } from '../lib/commonTypes';
import { CombinedStore } from '../reducers';
import { dataSourceConfig } from '../lib/datasource';
import translate, { translationKeys } from '../lib/translations';
import { connect } from 'react-redux';
import { AccountActionProps, signOut } from '../providers/accountProvider';
import PSProductCarousel from '../components/PSProductCarousel';
import { CMSSlot } from '../lib/cms';

const arrow = require('../../assets/images/arrow.png');
const logo = require('../../assets/images/pirateship-120.png');
const searchIcon = require('../../assets/images/search.png');

const ShopStyle = StyleSheet.create({
  arrow: {
    maxWidth: 15,
    maxHeight: 15,
    marginHorizontal: 10,
    transform: [{ rotate: '180deg' }]
  },
  wrapper: {
    backgroundColor: palette.primary
  },
  container: {
    flex: 1
  },
  heroCarousel: {},
  welcome: {
    padding: 15
  },
  productCarousel: {
    marginBottom: 20
  },
  scrollView: {
    backgroundColor: palette.background
  },
  shopButtonsContainer: {
    marginBottom: 15,
    marginHorizontal: 15
  },
  shopCategoryButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0
  },
  searchBarContainer: {
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  sectionTitle: {
    marginHorizontal: 15,
    marginTop: 0,
    paddingTop: 15,
    paddingBottom: 15,
    justifyContent: 'center',
    color: palette.secondary
  },
  shopLandingCategories: {
    borderTopWidth: 1,
    borderTopColor: border.color,
    marginBottom: 20
  },
  buttonCategoryLeft: {
    flex: 1
  },
  buttonCategoryRight: {
    flex: 1,
    marginLeft: 5
  },
  topCategoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 5
  },
  viewAllArrow: {
    maxWidth: 15,
    maxHeight: 15,
    marginHorizontal: 10,
    transform: [{ rotate: '180deg' }]
  },
  viewAllButtonTitle: {
    fontSize: fontSize.large,
    color: color.black
  },
  viewAllButton: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  viewAllContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

const mockProducts = Array.from({ length: 100 }, (_, i) => `Product ${i}`);
const specialProducts = mockProducts.map((_, i) => i).filter(i => i !== 0 && i % 7 === 0);
const mockWidthTable = fromPairs(specialProducts.map(i => [i, 'fill' as const]));

const mockAds = Array.from({ length: 5 }, (_, i) => makeGridItem(`Ad ${i}`, 2));

export interface ShopProps
  extends ScreenProps,
  Pick<CombinedStore, 'account' | 'topCategory' | 'promoProducts'>,
  Pick<AccountActionProps, 'signOut'> { }

export class UnwrappedShop extends Component<ShopProps> {
  static options: Options = navBarFullBleed;

  constructor(props: ShopProps) {
    super(props);

    if (Platform.OS !== 'web') {
      Linking.getInitialURL()
        .then(url => {
          if (url) {
            handleDeeplink(url, props.navigator);
          }
        })
        .catch(err => {
          console.warn('Deeplinking error', err);
        });

      Linking.addEventListener('url', event => {
        handleDeeplink(event.url, props.navigator);
      });
    }

    // Add Keyboard listeners to hide tab bar on Android while the keyboard is open.
    // This is global and doesn't need to be added to the other tabs/screens.
    if (Platform.OS !== 'ios') {
      // Not sure we still need this in rnn v2
      Keyboard.addListener('keyboardDidShow', () => {
        this.props.navigator.mergeOptions({
          bottomTabs: {
            visible: false,
            animate: false
          }
        });
      });

      Keyboard.addListener('keyboardDidHide', () => {
        this.props.navigator.mergeOptions({
          bottomTabs: {
            visible: true,
            animate: false
          }
        });
      });
    }
  }

  handleCategoryItemPress = (item: any) => {
    // Shopify doesn't have the concept of subcategories so always direct users to product index
    const screen =
      dataSourceConfig.type === 'shopify' ? 'ProductIndex' : 'Category';

    this.props.navigator.push({
      component: {
        name: screen,
        options: {
          topBar: {
            title: {
              text: item.title
            }
          }
        },
        passProps: {
          categoryId: item.id,
          format: dataSourceConfig.categoryFormat
        }
      }
    }).catch(e => console.warn(`${screen} PUSH error: `, e));
  }

  renderGridItem: GridRenderItem<string> = ({ item, columns, totalColumns }) => {
    const fill = columns === totalColumns;
    return (
      <View
        style={[
          { backgroundColor: 'lightgrey' },
          { justifyContent: 'center', alignItems: 'center' },
          { margin: 10 },
          { height: 175 },
          fill && { height: 175 * 2 }
        ]}
      >
        <Text>{item}</Text>
      </View>
    );
  }

  render(): JSX.Element {
    const { account, topCategory } = this.props;
    return (
      <PSScreenWrapper
        navigator={this.props.navigator}
        needInSafeArea={true}
        style={ShopStyle.wrapper}
        scrollViewProps={{ style: ShopStyle.scrollView }}
      >
        <View style={ShopStyle.container}>
          <PSWelcome
            logo={logo}
            userName={
              account &&
              account.store &&
              account.store.firstName
            }
            isLoggedIn={account && account.isLoggedIn}
            style={ShopStyle.welcome}
            onSignInPress={openSignInModal(this.props.navigator)}
            onSignOutPress={this.handleSignOut}
          />
          <PSHeroCarousel
            style={ShopStyle.heroCarousel}
            cmsGroup='Shop'
            cmsSlot='Hero-Carousel'
            onItemPress={this.handleHeroCarouselPress}
          />
          <View style={ShopStyle.searchBarContainer}>
            <SearchBar
              containerStyle={GlobalStyle.searchBarInner}
              inputTextStyle={GlobalStyle.searchBarInputTextStyle}
              searchIcon={searchIcon}
              placeholder={translate.string(translationKeys.search.placeholder)}
            />
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              onPress={this.showSearchScreen}
            >
              <View />
            </TouchableOpacity>
          </View>

          {this.renderShopButtons()}
          {this.renderPromoProducts()}

          <View style={ShopStyle.topCategoriesContainer}>
            <Text style={[GlobalStyle.h2, ShopStyle.sectionTitle]}>
              {translate.string(translationKeys.screens.shop.shopAllBtn)}
            </Text>
            <TouchableOpacity onPress={this.goToAllCategories}>
              <View style={ShopStyle.viewAllContainer}>
                <Text style={ShopStyle.viewAllButtonTitle}>
                  {translate.string(translationKeys.screens.shop.viewAllBtn)}
                </Text>
                <Image style={ShopStyle.arrow} source={arrow} />
              </View>
            </TouchableOpacity>
          </View>

          <PSShopLandingCategories
            categories={topCategory && topCategory.categories}
            style={ShopStyle.shopLandingCategories}
            onItemPress={this.handleCategoryItemPress}
          />
          <Grid
            data={mockProducts}
            insertEveryValues={mockAds}
            insertEveryFrequency={3}
            columnWidthTable={mockWidthTable}
            renderItem={this.renderGridItem}
          />
        </View>
      </PSScreenWrapper>
    );
  }

  renderShopButtons = () => {
    return (
      <View style={ShopStyle.shopButtonsContainer}>
        <View style={ShopStyle.shopCategoryButtonsContainer}>
          <PSButton
            style={ShopStyle.buttonCategoryLeft}
            title={translate.string(
              translationKeys.screens.shop.shopByCategoryBtn
            )}
            onPress={this.goToAllCategories}
          />
        </View>
      </View>
    );
  }

  handleHeroCarouselPress = (item: CMSSlot | PSHeroCarouselItem) => {
    if ('Link' in item) {
      handleDeeplink(item.Link, this.props.navigator);
    }
  }

  handleSignOut = () => {
    this.props.signOut().catch(e => console.warn(e));
  }

  goToAllCategories = () => {
    this.props.navigator.push({
      component: {
        name: 'Category',
        options: {
          topBar: {
            title: {
              text: translate.string(translationKeys.screens.allCategories.title)
            }
          }
        },
        passProps: {
          categoryId: '',
          format: 'list'
        }
      }
    }).catch(e => console.warn('Category PUSH error: ', e));
  }

  showSearchScreen = () => {
    this.props.navigator.push({
      component: {
        name: 'Search',
        passProps: {
          onCancel: () => {
            this.props.navigator.pop({
              animations: {
                pop: {
                  enabled: false
                }
              }
            }).catch(e => console.warn('Search POP error: ', e));
          }
        },
        options: {
          animations: {
            push: {
              enabled: false
            }
          }
        }
      }
    }).catch(e => console.warn('Search PUSH error: ', e));
  }

  private handlePromotedProductPress = (productId: string) => () => {
    this.props.navigator.push({
      component: {
        name: 'ProductDetail',
        passProps: {
          productId
        }
      }
    }).catch(e => console.warn('ProductDetail PUSH error: ', e));
  }

  private renderPromoProducts = (): React.ReactNode => {
    if (
      !(
        this.props.promoProducts &&
        this.props.promoProducts.products &&
        projectEnv.dataSource &&
        projectEnv.dataSource.promoProducts
      )
    ) {
      return null;
    }

    return (
      <View>
        <Text style={[GlobalStyle.h2, ShopStyle.sectionTitle]}>
          {projectEnv.dataSource.promoProducts.title}
        </Text>
        <View style={ShopStyle.shopButtonsContainer}>
          <PSProductCarousel
            items={this.props.promoProducts.products.map(prod => ({
              ...prod,
              image: (prod.images || []).find(img => !!img.uri),
              onPress: this.handlePromotedProductPress(prod.id),
              key: prod.id
            }))}
          />
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    signOut: signOut(dispatch)
  };
};

const mapStateToProps = (combinedStore: CombinedStore, ownProps: any) => {
  return {
    account: combinedStore.account,
    promoProducts: combinedStore.promoProducts,
    topCategory: combinedStore.topCategory
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UnwrappedShop);

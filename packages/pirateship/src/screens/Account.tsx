import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {
  EventSubscription,
  Navigation,
  NavigationButtonPressedEvent,
  Options } from 'react-native-navigation';
import PSScreenWrapper from '../components/PSScreenWrapper';
import SignIn from '../screens/SignIn';

import {
  GridItem,
  NavButton,
  ScreenProps
} from '../lib/commonTypes';
import { signOutButton } from '../lib/navStyles';
import { navBarHide, navBarTabLanding } from '../styles/Navigation';
import withAccount, { AccountProps } from '../providers/accountProvider';
import { border, palette } from '../styles/variables';
import { Grid } from '@brandingbrand/fscomponents';
import translate, { translationKeys } from '../lib/translations';

export interface AccountScreenProps extends ScreenProps, AccountProps {}
export interface AccountScreenState {
  gridItemWidth?: number;
}

const GRID_ITEMS: GridItem[] = [
  {
    title: translate.string(translationKeys.screens.editPersonal.title),
    image: require('../../assets/images/account-green.png'),
    path: 'EditPersonal'
  },
  {
    title: translate.string(translationKeys.screens.editAddresses.title),
    image: require('../../assets/images/addressBook.png'),
    path: 'AddressBook'
  },
  {
    title: translate.string(translationKeys.screens.viewOrders.title),
    image: require('../../assets/images/orders.png'),
    path: 'OrderHistoryList'
  },
  {
    title: translate.string(translationKeys.screens.editSavedPayments.title),
    image: require('../../assets/images/creditCards.png'),
    path: 'SavedPayments'
  }
];

const styles = StyleSheet.create({
  grid: {
    flex: 1
  },
  gridItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1
  },
  gridImageContainer: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  gridText: {
    marginTop: 15,
    color: palette.secondary,
    fontWeight: 'bold'
  },
  gridLine: {
    backgroundColor: border.color
  }
});

const accountNavStyle: Options = {
  ...navBarTabLanding,
  topBar: {
    leftButtonColor: palette.secondary,
    rightButtonColor: palette.secondary
  }
};

class Account extends Component<AccountScreenProps, AccountScreenState> {
  static rightButtons: NavButton[] = [signOutButton];
  static options: Options = accountNavStyle;
  private navigationEventListener: EventSubscription | null = null;

  constructor(props: AccountScreenProps) {
    super(props);
    Navigation.mergeOptions(props.componentId, {
      topBar: {
        title: {
          text: translate.string(translationKeys.screens.account.title)
        }
      }
    });

    // The grid items should be equal height and width. The width is dependent on the width
    // of the user's screen, so we'll derive the height from the screen width.
    this.state = {
      gridItemWidth: Math.floor(Dimensions.get('screen').width / 2)
    };

    if (!props.account.isLoggedIn) {
      Navigation.mergeOptions(props.componentId, navBarHide);
    }
  }

  componentWillReceiveProps(nextProps: AccountScreenProps): void {
    if (this.props.account.isLoggedIn && !nextProps.account.isLoggedIn) {
      Navigation.mergeOptions(this.props.componentId, navBarHide);
    } else if (!this.props.account.isLoggedIn && nextProps.account.isLoggedIn) {
      Navigation.mergeOptions(this.props.componentId, accountNavStyle);
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          rightButtons: [signOutButton.button]
        }
      });
    }
  }

  componentDidMount(): void {
    Dimensions.addEventListener('change', this.handleDimensionChange);
  }

  componentWillUnmount(): void {
    if (this.navigationEventListener) {
      this.navigationEventListener.remove();
    }
    Dimensions.removeEventListener('change', this.handleDimensionChange);
  }

  navigationButtonPressed(event: NavigationButtonPressedEvent): void {
    if (event.buttonId === 'signOut') {
      this.props.signOut().catch(e => {
        console.warn('Error signing out', e);
      });
    }
  }

  handleDimensionChange = (event: any) => {
    this.setState({
      gridItemWidth: Math.floor(event.screen.width / 2)
    });
  }

  render(): JSX.Element {
    if (!this.props.account.isLoggedIn) {
      return (
        <SignIn
          onSignInSuccess={this.onSignInSuccess}
          componentId={this.props.componentId}
        />
      );
    } else {
      this.navigationEventListener = Navigation.events().bindComponent(this);
    }

    return (
      <PSScreenWrapper
        hideGlobalBanner={true}
      >
        <Grid
          style={styles.grid}
          columns={2}
          data={GRID_ITEMS}
          renderItem={this.renderGridItem}
          showColumnSeparators={true}
          showRowSeparators={true}
          columnSeparatorStyle={styles.gridLine}
          rowSeparatorStyle={styles.gridLine}
        />
      </PSScreenWrapper>
    );
  }

  renderGridItem = ({ item, index }: ListRenderItemInfo<GridItem>): JSX.Element => {
    const dimensionStyle = {
      height: this.state.gridItemWidth,
      width: this.state.gridItemWidth
    };

    return (
      <TouchableOpacity
        style={[styles.gridItem, dimensionStyle]}
        onPress={this.goTo(item)}
        key={index}
      >
        <View style={styles.gridImageContainer}>
          <Image source={item.image} />
        </View>
        <Text style={styles.gridText}>{item.title}</Text>
      </TouchableOpacity>
    );
  }

  goTo = (item: GridItem) => {
    const { title, path } = item;
    return () => {
      Navigation.push(this.props.componentId, {
        component: {
          name: path,
          options: {
            topBar: {
              title: {
                text: title
              }
            }
          }
        }
      }).catch(e => console.warn(`${path} PUSH error: `, e));
    };
  }

  onSignInSuccess = () => {
    Navigation.mergeOptions(this.props.componentId, {
      ...accountNavStyle,
      topBar: {
        ...accountNavStyle.topBar,
        rightButtons: [signOutButton.button]
      }
    });
  }
}

export default withAccount(Account);

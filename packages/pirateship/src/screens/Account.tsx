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
import PSScreenWrapper from '../components/PSScreenWrapper';
import SignIn from '../screens/SignIn';

import {
  GridItem,
  NavButton,
  NavigatorStyle,
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

const accountNavStyle = {
  ...navBarTabLanding,
  navBarButtonColor: palette.secondary
};

class Account extends Component<AccountScreenProps, AccountScreenState> {
  static navigatorStyle: NavigatorStyle = accountNavStyle;
  static rightButtons: NavButton[] = [signOutButton];

  constructor(props: AccountScreenProps) {
    super(props);
    props.navigator.setTitle({
      title: translate.string(translationKeys.screens.account.title)
    });

    // The grid items should be equal height and width. The width is dependent on the width
    // of the user's screen, so we'll derive the height from the screen width.
    this.state = {
      gridItemWidth: Math.floor(Dimensions.get('screen').width / 2)
    };

    if (!props.account.isLoggedIn) {
      props.navigator.setStyle(navBarHide);
    }
  }

  componentWillReceiveProps(nextProps: AccountScreenProps): void {
    if (this.props.account.isLoggedIn && !nextProps.account.isLoggedIn) {
      this.props.navigator.setStyle(navBarHide);
    } else if (!this.props.account.isLoggedIn && nextProps.account.isLoggedIn) {
      this.props.navigator.setStyle(accountNavStyle);
      this.props.navigator.setButtons({ rightButtons: [signOutButton.button] });
    }
  }

  onNavigatorEvent = (event: any) => {
    if (event.id === 'signOut') {
      this.props.signOut().catch(e => {
        console.warn('Error signing out', e);
      });
    }
  }

  componentWillMount(): void {
    Dimensions.addEventListener('change', this.handleDimensionChange);
  }

  componentWillUnmount(): void {
    Dimensions.removeEventListener('change', this.handleDimensionChange);
  }

  handleDimensionChange = (event: any) => {
    this.setState({
      gridItemWidth: Math.floor(event.screen.width / 2)
    });
  }

  render(): JSX.Element {
    const { navigator } = this.props;
    if (!this.props.account.isLoggedIn) {
      return (
        <SignIn
          navigator={navigator}
          onNav={this.props.onNav}
          onSignInSuccess={this.onSignInSuccess}
        />
      );
    } else {
      this.props.onNav(this.onNavigatorEvent);
    }

    return (
      <PSScreenWrapper
        hideGlobalBanner={true}
        navigator={navigator}
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
      this.props.navigator.push({
        title,
        screen: path
      });
    };
  }

  onSignInSuccess = () => {
    this.props.navigator.setStyle(accountNavStyle);
    this.props.navigator.setButtons({ rightButtons: [signOutButton.button] });
  }
}

export default withAccount(Account);

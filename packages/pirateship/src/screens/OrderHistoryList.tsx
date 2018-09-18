import React, { Component } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PSScreenWrapper from '../components/PSScreenWrapper';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import { Loading } from '@brandingbrand/fscomponents';

import { dataSource } from '../lib/datasource';
import { backButton } from '../lib/navStyles';
import { navBarDefault } from '../styles/Navigation';
import { NavButton, NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import withAccount, { AccountProps } from '../providers/accountProvider';
import PSRequireSignIn from '../components/PSRequireSignIn';
import { border, fontSize, padding, palette } from '../styles/variables';
import PSButton from '../components/PSButton';
import { handleAccountRequestError } from '../lib/shortcuts';
import translate, { translationKeys } from '../lib/translations';
const orderHistoryTranslations = translationKeys.account.orderHistory;

interface PropType extends ScreenProps, AccountProps {
  orders?: CommerceTypes.Order[];
}

interface OrderHistoryListState {
  isLoading: boolean;
  orders: CommerceTypes.Order[];
  errors: string[];
}

const arrowImg = require('../../assets/images/arrow.png');
const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.surface,
    flex: 1
  },
  orderDetailsContainer: {
    paddingTop: padding.base
  },
  orderDetailsRow: {
    borderTopColor: border.color,
    borderBottomWidth: border.width,
    borderBottomColor: border.color,
    backgroundColor: palette.background,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: padding.base,
    paddingBottom: padding.base
  },
  orderDetailsHeader: {
    fontSize: fontSize.base,
    fontWeight: 'bold',
    color: palette.onBackground,
    paddingTop: padding.narrow,
    paddingBottom: padding.narrow
  },
  orderDetailsText: {
    lineHeight: 18,
    color: palette.onBackground
  },
  orderDetailsTextHeader: {
    fontWeight: 'bold'
  },
  arrow: {
    margin: padding.base,
    transform: [{ rotate: '180deg' }]
  },
  errorContainer: {
    padding: padding.base
  },
  trackingNumberText: {
    color: palette.secondary
  },
  errorText: {
    fontSize: fontSize.large,
    fontWeight: 'bold'
  },
  emptyContainer: {
    marginTop: 10,
    marginHorizontal: 15
  },
  emptyText: {
    color: palette.accent
  },
  emptyTrackingContainer: {
    marginTop: 20
  },
  trackingText: {
    marginBottom: 5
  }
});

class OrderHistoryList extends Component<PropType, OrderHistoryListState> {
  static navigatorStyle: NavigatorStyle = navBarDefault;
  static leftButtons: NavButton[] = [backButton];

  constructor(props: PropType) {
    super(props);
    props.navigator.setTitle({ title: translate.string(translationKeys.screens.viewOrders.title) });

    const { orders } = this.props;
    if (Array.isArray(orders)) {
      this.state = {
        isLoading: false,
        orders,
        errors: []
      };
    } else {
      this.state = {
        isLoading: true,
        orders: [],
        errors: []
      };
    }
  }

  componentDidMount(): void {
    const { orders, account } = this.props;
    if (Array.isArray(orders) || !account.isLoggedIn) {
      return;
    }

    /* tslint:disable-next-line */
    this.fetchOrders();
  }

  fetchOrders = async () => {
    try {
      this.setState({
        isLoading: true,
        errors: []
      });
      const orders = await dataSource.fetchOrders();
      this.setState({
        isLoading: false,
        orders
      });
    } catch (error) {
      if (error && error.response && error.response.status === 401) {
        // user's session has expired. sign them out.
        handleAccountRequestError(error, this.props.navigator, this.props.signOut);
      } else {
        this.setState({
          errors: [
            translate.string(orderHistoryTranslations.errors.generic)
          ]
        });
        console.warn('Error requesting order history', error);
      }
    }
  }

  render(): JSX.Element {
    const { navigator } = this.props;
    const { isLoggedIn } = this.props.account;
    const { isLoading, orders, errors } = this.state;
    let body;

    if (Array.isArray(errors) && errors.length > 0) {
      body = this.renderErrors();

    } else if (!isLoggedIn && orders.length === 0) {
      body = this.renderSignIn();

    } else if (isLoading) {
      body = this.renderLoading();

    } else if (orders.length === 0) {
      body = this.renderEmpty();

    } else {
      body = this.renderOrderList();

    }

    return (
      <PSScreenWrapper
        style={styles.container}
        scroll={isLoggedIn}
        navigator={navigator}
      >
        {body}
      </PSScreenWrapper>
    );
  }

  renderSignIn = () => {
    return <PSRequireSignIn onSignInPress={this.signIn} />;
  }

  renderLoading = () => {
    return <Loading />;
  }

  renderOrderList = () => {
    const { orders } = this.state;
    return (
      <ScrollView style={styles.orderDetailsContainer}>
        {orders.map(this.renderOrder)}
      </ScrollView>
    );
  }

  renderOrder = (order: CommerceTypes.Order, index: number) => {
    return (
      <TouchableOpacity
        key={index}
        style={[styles.orderDetailsRow, {
          borderTopWidth: index === 0 ? 1 : 0
        }]}
        onPress={this.goToOrderHistoryDetail(order)}
      >
        <View>
          <Text style={styles.orderDetailsText}>
            <Text style={styles.orderDetailsTextHeader}>
              {translate.string(orderHistoryTranslations.order.date)}:{' '}
            </Text>
            {order.creationDate || 'N/A'}
          </Text>
          <Text style={styles.orderDetailsText}>
            <Text style={styles.orderDetailsTextHeader}>
              {translate.string(orderHistoryTranslations.order.status)}:{' '}
            </Text>
            {order.status || 'N/A'}
          </Text>
          <Text style={styles.orderDetailsText}>
            <Text style={styles.orderDetailsTextHeader}>
              {translate.string(orderHistoryTranslations.order.total)}:{' '}
            </Text>
            ${order.orderTotal || 'N/A'}
          </Text>
        </View>
        <Image
          source={arrowImg}
          style={styles.arrow}
          resizeMode='contain'
        />
      </TouchableOpacity>
    );
  }

  renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {translate.string(orderHistoryTranslations.noHistory)}
        </Text>
        <View style={styles.emptyTrackingContainer}>
          <Text style={styles.trackingText}>
            {translate.string(orderHistoryTranslations.actions.trackOrder.actionCallout)}
          </Text>
          <PSButton
            title={translate.string(orderHistoryTranslations.actions.trackOrder.actionBtn)}
            onPress={this.trackOrder}
          />
        </View>
      </View>
    );
  }

  trackOrder = () => {
    return this.props.navigator.push({
      screen: 'TrackOrderLanding',
      title: translate.string(translationKeys.screens.trackOrder.title)
    });
  }

  renderErrors = () => {
    const { errors } = this.state;
    if (!Array.isArray(errors)) {
      return null;
    }

    const errorMsgs = errors.map((error, index) => {
      return (
        <Text
          key={index}
          style={styles.errorText}
        >
          {error}
        </Text>
      );
    });

    return (
      <View style={styles.errorContainer}>
        {errorMsgs}
        <PSButton
          title={translate.string(orderHistoryTranslations.actions.reload.actionBtn)}
          onPress={this.fetchOrders}
          style={{
            marginTop: padding.base
          }}
        />
      </View>
    );
  }

  goToOrderHistoryDetail = (order: CommerceTypes.Order) => {
    return () => {
      alert('Not yet implemented');
    };
  }

  signIn = () => {
    return this.props.navigator.showModal({
      screen: 'SignIn',
      passProps: {
        dismissible: true,
        onDismiss: () => {
          this.props.navigator.dismissModal();
        },
        onSignInSuccess: async () => {
          this.props.navigator.dismissModal();
          await this.fetchOrders();
        }
      }
    });
  }
}

export default withAccount(OrderHistoryList);

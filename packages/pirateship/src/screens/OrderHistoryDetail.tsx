import React, { Component } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { Navigation, Options } from 'react-native-navigation';

import { Loading } from '@brandingbrand/fscomponents';
import { backButton } from '../lib/navStyles';
import { navBarDefault } from '../styles/Navigation';
import { NavButton, ScreenProps } from '../lib/commonTypes';
import PSScreenWrapper from '../components/PSScreenWrapper';
import PSButton from '../components/PSButton';
import PSTotals from '../components/PSTotals';
import PSLabeledValues from '../components/PSLabeledValues';
import { border, fontSize, padding, palette } from '../styles/variables';
import translate, { translationKeys } from '../lib/translations';

const env = require('../../env/env');

export interface OrderHistoryDetailState {
  isLoading: boolean;
  errors: string[];
  order?: any;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.surface,
    flex: 1
  },
  orderDetailContainer: {
    padding: padding.base,
    backgroundColor: palette.surface
  },
  shippingAddressContainer: {
    paddingBottom: padding.base,
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
  orderDetailsText: {
    lineHeight: fontSize.large,
    color: palette.onBackground
  },
  orderDetailsTextHeader: {
    lineHeight: fontSize.large,
    color: palette.onBackground,
    fontWeight: 'bold'
  },
  shipmentContainer: {
    backgroundColor: palette.background,
    borderTopColor: border.color,
    borderTopWidth: border.width,
    borderBottomColor: border.color,
    borderBottomWidth: border.width,
    padding: padding.base,
    marginBottom: padding.base
  },
  shipmentDetailsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  shipmentDetailsText: {
    fontSize: fontSize.small,
    lineHeight: 15,
    color: palette.onBackground
  },
  shipmentDetailsTextHeader: {
    fontSize: fontSize.small,
    lineHeight: 15,
    color: palette.onBackground,
    fontWeight: 'bold'
  },
  errorContainer: {
    padding: padding.base
  },
  errorText: {
    fontSize: fontSize.large,
    fontWeight: 'bold'
  },
  orderQuestionsText: {
    padding: padding.base,
    color: palette.onBackground,
    fontWeight: 'bold',
    fontSize: 17
  },
  buttonContainer: {
    padding: padding.base,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    width: 0,
    flexGrow: 1
  },
  rightButton: {
    marginLeft: padding.base
  },
  link: {
    color: palette.secondary
  },
  trackOrderButton: {
    maxWidth: 86,
    minWidth: 86
  },
  orderTotalsContainer: {
    borderBottomColor: border.color,
    borderBottomWidth: border.width,
    marginLeft: padding.base,
    marginRight: padding.base,
    padding: padding.base,
    paddingTop: 0
  },
  orderTotalsText: {
    fontSize: fontSize.small
  },
  orderTotalsTotalText: {
    fontSize: fontSize.base,
    color: palette.secondary,
    fontWeight: 'bold'
  },
  retryButton: {
    marginTop: padding.base
  },
  loading: {
    flexGrow: 1,
    justifyContent: 'center'
  }
});

export default class OrderHistoryDetail extends Component<ScreenProps, OrderHistoryDetailState> {
  static options: Options = navBarDefault;
  static leftButtons: NavButton[] = [backButton];
  constructor(props: ScreenProps) {
    super(props);

    this.state = {
      isLoading: true,
      errors: []
    };
  }

  componentDidMount(): void {
    /* tslint:disable-next-line */
    this.fetchOrder();
  }

  fetchOrder = async () => {
    throw new Error('fetchOrder not yet implemented');
  }

  render(): JSX.Element {
    const { isLoading, errors } = this.state;
    let body;

    if (Array.isArray(errors) && errors.length > 0) {
      body = this.renderErrors();

    } else if (isLoading) {
      body = this.renderLoading();

    } else {
      body = this.renderOrderHistoryDetails();

    }

    return (
      <PSScreenWrapper
        style={styles.container}
        scroll={!isLoading}
      >
        {body}
      </PSScreenWrapper>
    );
  }

  renderLoading = () => {
    return <Loading style={styles.loading}/>;
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
          title={translate.string(translationKeys.account.orderHistory.actions.reload.actionBtn)}
          onPress={this.fetchOrder}
          style={styles.retryButton}
        />
      </View>
    );
  }

  renderOrderHistoryDetails = () => {
    const { order } = this.state;
    const { orderDetails, shippingAddress, orderTotalDetails } = order;
    const orderTotals = orderTotalDetails.map((line: any) => {
      line.textStyle = styles.orderTotalsText;
      return line;
    });

    return (
      <View>
        <View style={styles.orderDetailContainer}>
          <PSLabeledValues
            items={orderDetails}
            labelStyle={styles.orderDetailsTextHeader}
            valueStyle={styles.orderDetailsText}
          />
          <View style={styles.shippingAddressContainer}>
            {this.renderShippingAddress(shippingAddress)}
          </View>
        </View>
        <PSTotals
          items={orderTotals}
          style={styles.orderTotalsContainer}
          lastItemTextStyle={styles.orderTotalsTotalText}
          lastItemViewStyle={{}}
        />
        <View>
          <Text style={[styles.orderQuestionsText]}>
            {translate.string(translationKeys.account.orderHistory.needHelp)}
          </Text>
          <View style={styles.buttonContainer}>
            <PSButton
              title={
                translate.string(translationKeys.account.orderHistory.actions.contact.actionBtn)
              }
              onPress={this.goToContactUs}
              light={true}
              style={styles.button}
            />
          </View>
        </View>
      </View>
    );
  }

  renderShippingAddress = (shippingAddress: string[]) => {
    const renderedAddress = shippingAddress.map((line, index) => (
      <Text key={index}>{line}</Text>
    ));

    return (
      <View>
        <Text style={styles.orderDetailsTextHeader}>
          {translate.string(translationKeys.account.orderHistory.order.shipTo)}:
        </Text>
        {renderedAddress}
      </View>
    );
  }

  signIn = async () => {
    return Navigation.showModal({
      component: {
        name: 'SignIn',
        passProps: {
          dismissible: true,
          onDismiss: () => {
            Navigation.dismissModal(this.props.componentId)
            .catch(e => console.warn('SignIn DISMISSMODAL error: ', e));
          },
          onSignInSuccess: async () => {
            Navigation.dismissModal(this.props.componentId)
            .catch(e => console.warn('SignIn DISMISSMODAL error: ', e));
            await this.fetchOrder();
          }
        }
      }
    }).catch(e => console.warn('SignIn PUSH error: ', e));
  }

  goToTrackingInfo = (link: string) => {
    return async () => {
      try {
        if (await Linking.canOpenURL(link)) {
          await Linking.openURL(link);
        }
      } catch (e) {
        console.warn(`Unable to open url ${link}`, e);
        alert(translate.string(translationKeys.account.orderHistory.errors.generic));
      }
    };
  }

  goToContactUs = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'DesktopPassthrough',
        options: {
          topBar: {
            title: {
              text: translate.string(translationKeys.screens.contactUs.title)
            }
          }
        },
        passProps: {
          url: `${env.desktopHost}/contactus`
        }
      }
    }).catch(e => console.warn('DesktopPassthrough PUSH error: ', e));
  }
}

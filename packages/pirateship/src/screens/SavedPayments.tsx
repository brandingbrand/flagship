import React, { Component } from 'react';
import { ActivityIndicator, Alert, ScrollView,
  StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { border, palette } from '../styles/variables';
import { NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import { navBarDefault } from '../styles/Navigation';
import { dataSource } from '../lib/datasource';
import withAccount, { AccountProps } from '../providers/accountProvider';
import { handleAccountRequestError } from '../lib/shortcuts';
import AccountStyle from '../styles/Account';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import translate, { translationKeys } from '../lib/translations';

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    fontSize: 15,
    color: palette.onBackground,
    fontWeight: 'bold'
  },
  container: {
    backgroundColor: palette.surface,
    paddingTop: 15
  },
  paymentContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderTopWidth: border.width,
    borderTopColor: border.color
  },
  addPaymentContainer: {
    borderTopWidth: border.width,
    borderTopColor: border.color,
    paddingTop: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 30
  },
  paymentTitleText: {
    fontWeight: 'bold',
    fontSize: 15
  },
  expiresText: {
    fontSize: 15
  },
  linkView: {
    height: 30
  },
  addPaymentText: {
    fontWeight: 'bold',
    color: palette.secondary,
    fontSize: 15
  },
  noPayments: {
    padding: 15,
    fontWeight: 'bold'
  }
});

const defaultMessage = 'Loading your payments...';

interface SavedPaymentsScreenProps extends ScreenProps, AccountProps {}

class SavedPayments extends Component<SavedPaymentsScreenProps> {
  static navigatorStyle: NavigatorStyle = navBarDefault;
  state: any;

  constructor(props: SavedPaymentsScreenProps) {
    super(props);
    props.navigator.setTitle({
      title: translate.string(translationKeys.screens.editSavedPayments.title)
    });

    this.state = {
      payments: [],
      loading: true,
      msg: defaultMessage
    };
  }

  componentWillMount(): void {
    this.fetchData();
  }

  fetchData = () => {
    this.setState({ loading: true });
    dataSource
      .fetchSavedPayments()
      .then(data => {
        const payments: CommerceTypes.PaymentMethod[] = data.map((item: any) =>
          ({ id: item.id, addressId: item.addressId, paymentCard: item.paymentCard }));
        this.setState({
          payments,
          loading: false,
          msg: defaultMessage });
      })
      .catch(e => {
        this.setState({ loading: false, msg: defaultMessage });
        handleAccountRequestError(e, this.props.navigator, this.props.signOut);
      });
  }

  render(): JSX.Element {
    const { loading, payments, msg } = this.state;

    if (loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size='large' />
          <Text style={styles.loadingText}>{msg}</Text>
        </View>
      );
    }

    let paymentsList;
    if (payments.length) {
      paymentsList = payments.map((payment: CommerceTypes.PaymentMethod) => {
        const { paymentCard } = payment;
        return (
          <View key={payment.id} style={styles.paymentContainer}>
            <Text style={styles.paymentTitleText}>
              {translate.string(translationKeys.payment.lastFour, {
                lastFour: paymentCard && paymentCard.numberLastDigits
              })}
            </Text>
            <Text style={styles.expiresText}>
              {translate.string(translationKeys.payment.expiration, {
                month: paymentCard && paymentCard.expirationMonth,
                year: paymentCard && paymentCard.expirationYear
              })}
            </Text>
            <View style={AccountStyle.actionsContainer}>
              <View style={styles.linkView}>
                <TouchableOpacity onPress={this.delete(payment)}>
                  <Text style={AccountStyle.deleteLinkText}>
                    {translate.string(translationKeys.payment.actions.delete.actionBtn)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      });
    }

    return (
      <ScrollView style={styles.container}>
        {payments.length ? paymentsList : (
          <Text style={styles.noPayments}>
            {translate.string(translationKeys.payment.noSavedPayments)}
          </Text>
        )}
      </ScrollView>
    );
  }

  onComplete = (updated: boolean) => {
    this.props.navigator.dismissModal();
    if (updated) {
      this.fetchData();
    }
  }

  delete = (payment: CommerceTypes.PaymentMethod) => {
    return () => {
      Alert.alert(
        translate.string(translationKeys.payment.actions.delete.confirmationHeader),
        translate.string(translationKeys.payment.actions.delete.confirmationText),
        [{
          text: translate.string(translationKeys.payment.actions.delete.cancelBtn),
          style: 'cancel'
        }, {
          text: translate.string(translationKeys.payment.actions.delete.confirmBtn),
          onPress: () => {
            this.setState({
              loading: true,
              msg: translate.string(translationKeys.payment.actions.delete.loading)
            });
            if (!payment.id) {
              throw new Error(translate.string(translationKeys.payment.actions.delete.error));
            }

            dataSource
              .deleteSavedPayment(payment.id)
              .then(r => {
                if (r) {
                  this.fetchData();
                } else {
                  throw new Error(translate.string(translationKeys.payment.actions.delete.error));
                }
              })
              // TODO: Add types for error response
              .catch((e: any) => {
                return handleAccountRequestError(e, this.props.navigator, this.props.signOut);
              });
          }
        }],
        { cancelable: false });
    };
  }
}

export default withAccount(SavedPayments);

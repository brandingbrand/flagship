import React, { Component } from 'react';
import { ActivityIndicator, Alert, ScrollView,
  StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { border, palette } from '../styles/variables';
import { NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import { navBarDefault } from '../styles/Navigation';
import { dataSource } from '../lib/datasource';
import { handleAccountRequestError } from '../lib/shortcuts';
import withAccount, { AccountProps } from '../providers/accountProvider';
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
    color: palette.onSurface,
    fontWeight: 'bold'
  },
  container: {
    backgroundColor: palette.surface,
    paddingTop: 15
  },
  addAddressContainer: {
    borderTopWidth: border.width,
    borderTopColor: border.color,
    paddingTop: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 30
  },
  linkView: {
    height: 30
  },
  defaultText: {
    color: palette.onBackground,
    fontSize: 15,
    paddingLeft: 20
  },
  setDefaultText: {
    fontWeight: 'bold',
    color: palette.secondary,
    fontSize: 15,
    paddingLeft: 20
  },
  addAddressText: {
    fontWeight: 'bold',
    color: palette.secondary,
    fontSize: 15
  }
});

const defaultMessage = translate.string(translationKeys.address.loading);

interface AddressBookScreenProps extends ScreenProps, AccountProps {}

class AddressBook extends Component<AddressBookScreenProps> {
  static navigatorStyle: NavigatorStyle = navBarDefault;
  state: any;

  constructor(props: AddressBookScreenProps) {
    super(props);
    props.navigator.setTitle({
      title: translate.string(translationKeys.screens.editAddresses.title)
    });

    this.state = {
      addresses: [],
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
      .fetchSavedAddresses()
      .then(addresses => {
        this.setState({ addresses, loading: false, msg: defaultMessage });
      })
      .catch(e => {
        this.setState({ loading: false, msg: defaultMessage });
        handleAccountRequestError(e, this.props.navigator, this.props.signOut);
      });
  }

  render(): JSX.Element {
    const { loading, addresses, msg } = this.state;

    if (loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size='large' />
          <Text style={styles.loadingText}>{msg}</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.container}>
        {addresses.map((address: CommerceTypes.CustomerAddress) => {
          return (
            <View key={address.id} style={AccountStyle.addressContainer}>
              <Text>{address.firstName} {address.lastName}</Text>
              <Text>{address.address1}</Text>
              {address.address2 ? (
                <Text>{address.address2}</Text>
              ) : null}
              <Text>{address.city}, {address.stateCode}
              {address.postalCode} {address.countryCode}</Text>

              <View style={AccountStyle.actionsContainer}>
                <View style={styles.linkView}>
                  <TouchableOpacity onPress={this.deleteAddress(address)}>
                    <Text style={AccountStyle.deleteLinkText}>
                      {translate.string(translationKeys.address.actions.delete.actionBtn)}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.linkView}>
                  <TouchableOpacity onPress={this.editAddress(address)}>
                    <Text style={AccountStyle.editLinkText}>
                      {translate.string(translationKeys.address.actions.edit.actionBtn)}
                    </Text>
                  </TouchableOpacity>
                </View>

                {address.preferred ? (
                  <View style={styles.linkView}>
                    <Text style={styles.defaultText}>
                      {translate.string(translationKeys.address.actions.setAsDefault.isDefault)}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.linkView}>
                    <TouchableOpacity onPress={this.setDefaultAddress(address)}>
                      <Text style={styles.setDefaultText}>
                        {translate.string(translationKeys.address.actions.setAsDefault.actionBtn)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          );
        })}

        <View style={styles.addAddressContainer}>
          <TouchableOpacity onPress={this.addNewAddress}>
            <Text style={styles.addAddressText}>
              + {translate.string(translationKeys.address.actions.add.actionBtn)}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  setDefaultAddress = (addr: any) => {
    return () => {
      this.setState({
        loading: true,
        msg: translate.string(translationKeys.address.actions.setAsDefault.loading)
      });

      dataSource
        .editSavedAddress({ ...addr, preferred: true })
        .then(r => {
          if (r) {
            this.componentWillMount();
          } else {
            throw new Error(translate.string(translationKeys.address.actions.setAsDefault.error));
          }
        })
        .catch(e => handleAccountRequestError(e, this.props.navigator, this.props.signOut));
    };
  }

  editAddress = (addr: CommerceTypes.CustomerAddress) => {
    return () => {
      return this.props.navigator.showModal({
        screen: 'EditAddress',
        title: translate.string(translationKeys.screens.editAddress.noId),
        passProps: {
          edit: true,
          address: addr,
          onComplete: this.onComplete
        }
      });
    };
  }

  onComplete = (saved: boolean) => {
    if (saved) {
      this.fetchData();
    }
  }

  deleteAddress = (addr: CommerceTypes.CustomerAddress) => {
    return () => {
      Alert.alert(
        translate.string(translationKeys.address.actions.delete.confirmationHeader),
        translate.string(translationKeys.address.actions.delete.confirmation),
        [
          {
            text: translate.string(translationKeys.address.actions.delete.cancelBtn),
            style: 'cancel'
          },
          {
            text: translate.string(translationKeys.address.actions.delete.confirmBtn),
            onPress: () => {
              this.setState({
                loading: true,
                msg: translate.string(translationKeys.address.actions.delete.loading)
              });

              if (!addr.id) {
                throw new Error(translate.string(translationKeys.address.actions.delete.error));
              }

              dataSource
                .deleteSavedAddress(addr.id)
                .then(r => {
                  if (r) {
                    this.fetchData();
                  } else {
                    throw new Error(translate.string(translationKeys.address.actions.delete.error));
                  }
                })
                .catch(e => handleAccountRequestError(e, this.props.navigator, this.props.signOut));
            }
          }
        ],
        { cancelable: false });
    };
  }

  addNewAddress = () => {
    return this.props.navigator.showModal({
      screen: 'EditAddress',
      title: translate.string(translationKeys.screens.newAddress.title),
      passProps: {
        edit: false,
        onComplete: this.onComplete
      }
    });
  }
}

export default withAccount(AddressBook);

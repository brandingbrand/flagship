// tslint:disable
import React, { Component } from 'react';
import {
  Button,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { demandware } from '../../lib/datasource';

const fakeAddress = {
  address1: '2313 East Carson Street',
  city: 'Pittsburgh',
  countryCode: 'US',
  firstName: 'Test',
  lastName: 'Order',
  postalCode: '15203',
  preferred: false,
  stateCode: 'PA'
};

const fakePayment = {
  paymentCard : {
    number: '411111111111111',
    securityCode: '112',
    holder: 'John Doe',
    cardType: 'Visa',
    expirationMonth: 2,
    expirationYear: 2022
  },
  paymentMethodId : 'CREDIT_CARD'
};

const styles = StyleSheet.create({
  buttonGroup: {
    marginTop: 30
  },
  container: {
    paddingBottom: 50,
    paddingTop: 50,
  },
  fieldLabel: {
    paddingLeft: 10,
    paddingRight: 10,
    fontWeight: 'bold'
  },
  inlineForm: {
    flexDirection: 'row'
  },
  inlineText: {
    borderWidth: 1,
    borderColor: 'black',
    width: 100
  },
  label: {
    fontWeight: 'bold',
    marginTop: 20
  },
  textInput: {
    borderWidth: 1,
      borderColor: 'black',
    padding: 5,
    marginLeft: 10,
    marginRight: 10
  }
});

/**
 * Example Component for testing Cart for DemandwareDataSource
 */

type EmptyProps = {};

interface DemandwareCartState {
  qty: string;
  orderType: string;
  responseData: string | null;
  sku: string;
  savedBillingId?: string;
  savedShippingId?: string;
  orderNumber?: string;
}

export default class DemandwareCart extends Component<EmptyProps, DemandwareCartState> {
  constructor(props: EmptyProps) {
    super(props);

    this.state = {
      qty: '0',
      responseData: null,
      sku: '',
      orderType: ''
    };
  }

  addToBasket = () => {
    let qty = 0;
    try{
      qty = parseInt(this.state.qty, 10);
    } catch(e) {
      qty = 0;
    }
    if (!qty || !this.state.sku) {
      alert('enter sku and quantity');
    }
    this.runDemandwareRequest(() => demandware.addToCart(this.state.sku, qty));
  }

  getPaymentMethods = () => {
     this.runDemandwareRequest(() => {
       return demandware.fetchCart()
         .then(cart => {
           if (cart && cart.id) {
             return demandware.fetchPaymentMethods(cart.id);
           }
           return;
         });
     });
  }

  getShipmentMethods = () => {
    this.runDemandwareRequest(() => {
      return demandware.fetchCart()
        .then(cart => {
          if(cart && cart.id && cart.shipments) {
            return demandware.fetchShippingMethods(cart.id, cart.shipments[0].id);
          }
          return;
        });
    });
  }

  render(): JSX.Element {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.inlineForm}>
          <Text style={styles.fieldLabel}>SKU</Text>
          <TextInput style={styles.inlineText} onChangeText={this.setSKU}/>
          <Text style={styles.fieldLabel}>QTY</Text>
          <TextInput style={styles.inlineText} onChangeText={this.setQTY} />
        </View>
        <Button onPress={this.addToBasket} title={'Add to Basket'} />
        <View style={styles.buttonGroup}>
          <Button onPress={this.setTestGiftOptions} title='Set Test Gift Options' />
        </View>
        <View style={styles.buttonGroup}>
          <Button onPress={this.getShipmentMethods} title='Get Test Shipment Methods' />
        </View>
        <View style={styles.buttonGroup}>
          <Button onPress={this.getPaymentMethods} title='Get Test Payment Methods' />
        </View>
        <View style={styles.buttonGroup}>
          <Button onPress={this.setBBTestMethod} title='Set Shipment Method' />
        </View>
        <View>
          <Text style={styles.label}>Billing Address</Text>
          <Button onPress={this.setBBTestBilling} title={'Set Test Billing Address'} />
          <Text style={styles.label}>Customer Info</Text>
          <Button onPress={this.setBBTestCustomerInfo} title={'Set Customer Info'} />
          <Text style={styles.label}>Saved Billing Address</Text>
          <View style={styles.inlineForm}>
            <Text style={styles.fieldLabel}>Address Id</Text>
            <TextInput style={styles.inlineText} onChangeText={this.setSavedBillingId}/>
          </View>
          <Button onPress={this.setSavedBillingTest} title='Set Saved Billing Address' />
        </View>
        <View>
          <Text style={styles.label}>Shipping Address</Text>
          <Button onPress={this.setBBTestShipping} title={'Set Test Shipping Address'} />
          <Text style={styles.label}>Saved Shipping Address</Text>
          <View style={styles.inlineForm}>
            <Text style={styles.fieldLabel}>Address Id</Text>
            <TextInput style={styles.inlineText} onChangeText={this.setSavedShippingId}/>
          </View>
          <Button onPress={this.setSavedShippingTest} title='Set Saved Shipping Address' />
        </View>
        <View style={styles.buttonGroup}>
          <Button onPress={this.setBBTestPayment} title='Set Test Payment' />
        </View>
        <View style={styles.buttonGroup}>
          <Button onPress={this.submitOrder} title='Create Order' />
        </View>
        <View style={styles.buttonGroup}>
          <View style={styles.inlineForm}>
            <Text style={styles.fieldLabel}>Order Number</Text>
            <TextInput style={styles.inlineText} onChangeText={this.setOrderNumber}/>
          </View>
          <View style={styles.inlineForm}>
            <Text style={styles.fieldLabel}>Order Type</Text>
            <TextInput style={styles.inlineText} onChangeText={this.setOrderType}/>
          </View>
          <Button onPress={this.updateOrder} title='Update Order' />
        </View>
        {this.state.responseData && (
          <View>
            <Text style={styles.label}>Response</Text>
            <Text>{this.state.responseData}</Text>
          </View>
        )}
      </ScrollView>
    );
  }
  runDemandwareRequest<T>(promiseThunk: () => Promise<T>) {
      promiseThunk()
        .then((c: any) => this.setState({responseData: JSON.stringify(c, null, 2)}))
        .catch((e: Error) => this.setState({responseData: `ERROR: ${e}`}))
  }
  setBBTestBilling = () => {
    this.runDemandwareRequest(() => {
      return demandware.fetchCart()
        .then(cart => {
          if (cart.id) {
            return demandware.setBillingAddress({address: fakeAddress, cartId: cart.id});
          }

          return cart;
        });
    });
  }
  setBBTestCustomerInfo = () => {
    this.runDemandwareRequest(() => {
      return demandware.fetchCart()
        .then(cart => {
          if(cart && cart.id){
            return demandware.setCustomerInfo({email: "qatest@brandingbrand.com", cartId: cart.id});
          }
          return;
        });
    });
  }
  setBBTestMethod = () => {
    this.runDemandwareRequest(() => {
      return demandware.fetchCart()
        .then(cart => {
          if (cart && cart.id) {
            return demandware.setShipmentMethod({
              cartId: cart.id,
              methodId: 'Ground-ContinentialUS',
              shipmentId: 'me'
            });
          }
          return;
        });
    });
  }
  setBBTestPayment = () => {
    this.runDemandwareRequest(() => {
      return demandware.fetchCart()
        .then(cart => {
          if (cart.payments && cart.payments[0].id && cart.id) {
            let updatePayment = {
              ...fakePayment,
              paymentCard: {
                ...fakePayment.paymentCard,
                holder: 'Jane Doe'
              }
            };
            return demandware.updatePayment(cart.id, cart.payments[0].id, updatePayment);
          } else {
            if (cart.id){
              return demandware.addPayment(cart.id, fakePayment);
            }
            return
          }
        });
    });
  }
  setBBTestShipping = () => {
    this.runDemandwareRequest(() => {
      return demandware.fetchCart()
        .then(cart => {
          if (cart.id) {
            return demandware.setShipmentAddress({
              address: fakeAddress,
              cartId: cart.id,
              shipmentId: 'me'
            });
          }

          return cart;
        });
    });
  }
  setTestGiftOptions = () => {
    this.runDemandwareRequest(() => {
      return demandware.fetchCart()
        .then(cart => {
          if(cart && cart.shipments && cart.shipments[0].id && cart.id){
            let updateGiftOptions = {
              cartId: cart.id,
              gift: true,
              giftMessage: 'Hello World',
              shipmentId: cart.shipments[0].id
            };
            return demandware.updateGiftOptions(updateGiftOptions);
          }
          return;
        });
    });
  }
  setQTY = (text: string) => this.setState({qty: text})
  setSKU = (text: string) => this.setState({sku: text})
  setSavedBillingId = (text: string) => this.setState({savedBillingId: text})
  setSavedBillingTest = () => {
    if (!this.state.savedBillingId) {
      alert('enter saved billing address id');
      return;
    }
    this.runDemandwareRequest(() => {
      return demandware.fetchCart()
        .then(cart => {
          if(cart && cart.id) {
            return demandware.setBillingAddress({
              addressId: this.state.savedBillingId,
              cartId: cart.id
            });
          }
          return;
        });
    });
  }
  setSavedShippingId = (text: string) => this.setState({savedShippingId: text})
  setSavedShippingTest = () => {
    if (!this.state.savedShippingId) {
      alert('enter saved shipping address id');
      return;
    }
    this.runDemandwareRequest(() => {
      return demandware.fetchCart()
        .then(cart => {
          if(cart && cart.id){
            return demandware.setShipmentAddress({
              addressId: this.state.savedShippingId,
              cartId: cart.id,
              shipmentId: 'me'
            });
          }
          return;
        });
    });
  }
  submitOrder = () => {
    this.runDemandwareRequest(() => {
      return demandware.fetchCart()
        .then(cart => {
          if(cart && cart.id) {
            return demandware.submitOrder(cart.id);
          }
          return;
        });
    });
  }

  setOrderNumber = (text: string) => {
    this.setState({ orderNumber: text });
  }

  setOrderType = (text: string) => {
    this.setState({ orderType: text });
  }

  updateOrder = () => {
    this.runDemandwareRequest(() => {
        return demandware.updateOrder({ orderId: this.state.orderNumber || '' });
    });
  }
}

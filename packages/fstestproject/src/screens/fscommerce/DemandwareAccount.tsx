// tslint:disable
import React, { Component } from "react";
import {
  Button,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { demandware } from '../../lib/datasource';
import translate from '../../lib/translations';

const styles = StyleSheet.create({
  section: {
    margin: 5,
    padding: 5,
    borderWidth: 1
  },
  label: {
    fontWeight: "bold",
    marginTop: 20
  },
  textInput: {
    borderWidth: 1,
    borderColor: "black",
    padding: 5,
    marginLeft: 10,
    marginRight: 10
  }
});

const parseError = (error: any) =>
  (error &&
    error.response &&
    error.response.data &&
    error.response.data.fault &&
    JSON.stringify(error.response.data.fault)) ||
  "Unknown error";

// Fill in these values to pre-populate the various form fields on this screen
const testData = {
  orderId: '',
  savedAddressToDelete: '',
  savedPaymentToDelete: '',
  existingAccount: {
    email: '',
    password: ''
  },
  newAccount: {
    email: '',
    firstName: '',
    lastName: '',
    password: ''
  },
  updateAccount: {
    firstName: '',
    lastName: ''
  },
  changePassword: {
    password: '',
    currentPassword: ''
  },
  newAddress: {
    id: '',
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    stateCode: '',
    postalCode: '',
    phone: '',
    email: ''
  },
  updateAddress: {
    id: '',
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    stateCode: '',
    postalCode: '',
    phone: ''
  },
  creditCard: {
    expirationYear: '2027',
    expirationMonth: '12',
    number: '4111111111111111'
  }
};

/**
 * Example Component for testing Account and Session for DemandwareDataSource
 */
export default class DemandwareAccount extends Component<any, any> {
  render(): JSX.Element {
    return (
      <ScrollView>
        <FetchAccount />
        <Logout />
        <Login />
        <LoginWithGuestBasket />
        <Register />
        <UpdateAccount />
        <UpdatePassword />
        <ForgotPassword />
        <FetchOrders />
        <FetchOrder />
        <FetchSavedAddresses />
        <AddSavedAddress />
        <EditSavedAddress />
        <DeleteSavedAddress />
        <FetchSavedPayments />
        <AddSavedPayment />
        <DeleteSavedPayment />
      </ScrollView>
    );
  }
}

class FetchAccount extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      account: null,
      lastUpdated: null
    };
  }

  render(): JSX.Element {
    const { account, lastUpdated } = this.state;
    return (
      <View style={styles.section}>
        <Text style={styles.label}>FetchAccount (Manual update)</Text>
        {lastUpdated && <Text>Last Response: {lastUpdated}</Text>}
        <Text>{account ? JSON.stringify(account) : "Guest Mode"}</Text>
        <Button
          title="Update"
          onPress={() => {
            demandware
              .fetchAccount()
              .then((account: any) =>
                this.setState({
                  account,
                  lastUpdated: new Date().toISOString()
                })
              )
              .catch((e: any) => {
                console.warn(e);
                this.setState({
                  account: null,
                  lastUpdated: new Date().toISOString()
                });
              });
          }}
        />
      </View>
    );
  }
}

class LoginWithGuestBasket extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      message: "",
      email: testData.existingAccount.email,
      password: testData.existingAccount.password,
      cart: null,
      lastUpdated: null
    };
  }

  render(): JSX.Element {
    const { message, email, password, lastUpdated, cart } = this.state;
    return (
      <View style={styles.section}>
        <Text style={styles.label}>Login with existing Guest Basket</Text>
        <Text style={styles.label}>
          1) Logout, 2) Click the button, do this repeatly and you should be
          able to see quantity of product '100701' is increased by 1 every time
        </Text>
        {lastUpdated && <Text>Last Response: {lastUpdated}</Text>}
        <Text>{message}</Text>
        {cart && <Text>Cart JSON: {JSON.stringify(cart)}</Text>}
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ email: text })}
          autoCorrect={false}
          value={email}
          style={styles.textInput}
          placeholder="email"
        />
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ password: text })}
          autoCorrect={false}
          value={password}
          style={styles.textInput}
          placeholder="password"
        />
        <Button
          title="Login with existing Guest Basket"
          onPress={() => {
            demandware
              .addToCart("100701", 1)
              .then(() => demandware.login(email, password))
              .then(() => demandware.fetchCart())
              .then((cart: any) =>
                this.setState({
                  message: "Login Successful",
                  lastUpdated: new Date().toISOString(),
                  cart
                })
              )
              .catch((e: any) => {
                console.warn(e);
                this.setState({
                  message: parseError(e),
                  lastUpdated: new Date().toISOString()
                });
              });
          }}
        />
      </View>
    );
  }
}

class Login extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      message: "",
      email: testData.existingAccount.email,
      password: testData.existingAccount.password,
      lastUpdated: null
    };
  }

  render(): JSX.Element {
    const { message, email, password, lastUpdated } = this.state;
    return (
      <View style={styles.section}>
        <Text style={styles.label}>Login</Text>
        {lastUpdated && <Text>Last Response: {lastUpdated}</Text>}
        <Text>{message}</Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ email: text })}
          autoCorrect={false}
          value={email}
          style={styles.textInput}
          placeholder="email"
        />
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ password: text })}
          autoCorrect={false}
          value={password}
          style={styles.textInput}
          placeholder="password"
        />
        <Button
          title="Login"
          onPress={() => {
            demandware
              .login(email, password)
              .then((token: any) =>
                this.setState({
                  message: "Login Successful",
                  lastUpdated: new Date().toISOString()
                })
              )
              .catch((e: any) => {
                console.warn(e);
                this.setState({
                  message: parseError(e),
                  lastUpdated: new Date().toISOString()
                });
              });
          }}
        />
      </View>
    );
  }
}

class Logout extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      message: "",
      lastUpdated: null
    };
  }

  render(): JSX.Element {
    const { message, lastUpdated } = this.state;
    return (
      <View style={styles.section}>
        <Text style={styles.label}>Logout</Text>
        {lastUpdated && <Text>Last Response: {lastUpdated}</Text>}
        <Text>{message}</Text>
        <Button
          title="Logout"
          onPress={() => {
            demandware
              .logout()
              .then((resp: any) =>
                this.setState({
                  message: "Logout Successful",
                  lastUpdated: new Date().toISOString()
                })
              )
              .catch((e: any) => {
                console.warn(e);
                this.setState({
                  message: "API failed (currently expected) but token cleared",
                  lastUpdated: new Date().toISOString()
                });
              });
          }}
        />
      </View>
    );
  }
}

class Register extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      lastUpdated: null,
      message: '',
      ...testData.newAccount
    };
  }

  render(): JSX.Element {
    const {
      message,
      email,
      password,
      firstName,
      lastName,
      lastUpdated
    } = this.state;
    return (
      <View style={styles.section}>
        <Text style={styles.label}>Register</Text>
        {lastUpdated && <Text>Last Response: {lastUpdated}</Text>}
        <Text>{message}</Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ firstName: text })}
          autoCorrect={false}
          value={firstName}
          style={styles.textInput}
          placeholder="firstName"
        />
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ lastName: text })}
          autoCorrect={false}
          value={lastName}
          style={styles.textInput}
          placeholder="lastName"
        />
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ email: text })}
          autoCorrect={false}
          value={email}
          style={styles.textInput}
          placeholder="email"
        />
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ password: text })}
          autoCorrect={false}
          value={password}
          style={styles.textInput}
          placeholder="password"
        />
        <Button
          title="Register"
          onPress={() => {
            demandware
              .register({ firstName, lastName, email } as any, password)
              .then((account: any) =>
                this.setState({
                  message: "Register Successful",
                  lastUpdated: new Date().toISOString()
                })
              )
              .catch((e: any) => {
                console.warn(e);
                this.setState({
                  message: parseError(e),
                  lastUpdated: new Date().toISOString()
                });
              });
          }}
        />
      </View>
    );
  }
}

class UpdateAccount extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      lastUpdated: null,
      message: "",
      ...testData.updateAccount
    };
  }

  render(): JSX.Element {
    const { message, firstName, lastName, lastUpdated } = this.state;
    return (
      <View style={styles.section}>
        <Text style={styles.label}>UpdateAccount</Text>
        {lastUpdated && <Text>Last Response: {lastUpdated}</Text>}
        <Text>{message}</Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ firstName: text })}
          autoCorrect={false}
          value={firstName}
          style={styles.textInput}
          placeholder="firstName"
        />
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ lastName: text })}
          autoCorrect={false}
          value={lastName}
          style={styles.textInput}
          placeholder="lastName"
        />
        <Button
          title="Update Account"
          onPress={() => {
            demandware
              .updateAccount({ firstName, lastName } as any)
              .then((account: any) =>
                this.setState({
                  message: "Update Account Successful",
                  lastUpdated: new Date().toISOString()
                })
              )
              .catch((e: any) => {
                console.warn(e);
                this.setState({
                  message: parseError(e),
                  lastUpdated: new Date().toISOString()
                });
              });
          }}
        />
      </View>
    );
  }
}

class UpdatePassword extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      lastUpdated: null,
      message: "",
      ...testData.changePassword
    };
  }

  render(): JSX.Element {
    const { message, currentPassword, password, lastUpdated } = this.state;
    return (
      <View style={styles.section}>
        <Text style={styles.label}>
          UpdatePassword (For test account remember to change it back)
        </Text>
        {lastUpdated && <Text>Last Response: {lastUpdated}</Text>}
        <Text>{message}</Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ currentPassword: text })}
          autoCorrect={false}
          value={currentPassword}
          style={styles.textInput}
          placeholder="current password"
        />
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ password: text })}
          autoCorrect={false}
          value={password}
          style={styles.textInput}
          placeholder="new password"
        />
        <Button
          title="Update Password"
          onPress={() => {
            demandware
              .updatePassword(currentPassword, password)
              .then((password: any) =>
                this.setState({
                  message: "Update Password Successful",
                  lastUpdated: new Date().toISOString()
                })
              )
              .catch((e: any) => {
                console.warn(e);
                this.setState({
                  message: parseError(e),
                  lastUpdated: new Date().toISOString()
                });
              });
          }}
        />
      </View>
    );
  }
}

class ForgotPassword extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      email: testData.existingAccount.email,
      lastUpdated: null,
      message: ""
    };
  }

  render(): JSX.Element {
    const { message, email, lastUpdated } = this.state;
    return (
      <View style={styles.section}>
        <Text style={styles.label}>ForgotPassword</Text>
        {lastUpdated && <Text>Last Response: {lastUpdated}</Text>}
        <Text>{message}</Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ email: text })}
          autoCorrect={false}
          value={email}
          style={styles.textInput}
          placeholder="Email address"
        />
        <Button
          title="Update Password"
          onPress={() => {
            demandware
              .forgotPassword(email)
              .then((password: any) =>
                this.setState({
                  message: "Forgot password request sent",
                  lastUpdated: new Date().toISOString()
                })
              )
              .catch((e: any) => {
                console.warn(e);
                this.setState({
                  message: parseError(e),
                  lastUpdated: new Date().toISOString()
                });
              });
          }}
        />
      </View>
    );
  }
}

class FetchOrders extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      lastUpdated: null,
      message: "",
      orders: null
    };
  }

  render(): JSX.Element {
    const { message, orders, lastUpdated } = this.state;
    return (
      <View style={styles.section}>
        <Text style={styles.label}>FetchOrders</Text>
        {lastUpdated && <Text>Last Response: {lastUpdated}</Text>}
        <Text>{message}</Text>
        {orders &&
          orders.map((order: any) => (
            <View
              key={order.orderId}
              style={{ backgroundColor: "#ccc", marginVertical: 5 }}
            >
              <Text>Order History</Text>
              <Text>#### Order Info ####</Text>
              <Text>Ship ID: {order.orderId}</Text>
              <Text>Date: {translate.date(order.creationDate)}</Text>
              <Text>Status: {order.status}</Text>

              <Text>#### Billing Info ####</Text>
              <Text>{order.billingAddress.fullName}</Text>
              <Text>{order.billingAddress.address1}</Text>
              {order.billingAddress.address2 && (
                <Text>{order.billingAddress.address2}</Text>
              )}
              <Text>
                {order.billingAddress.city} {order.billingAddress.stateCode}{" "}
                {order.billingAddress.postalCode}
              </Text>
              <Text>US</Text>
              <Text>{order.billingAddress.phone}</Text>

              <Text>#### Payment Method ####</Text>
              <Text>
                {order.payments[0].paymentCard.cardType}{" "}
                {order.payments[0].paymentCard.maskedNumber}
              </Text>

              <Text>#### Shipping Info ####</Text>
              {order.shipments &&
                order.shipments.map((shipment: any) => (
                  <View key={shipment.shipmentNumber}>
                    <Text>Shipment No. {shipment.shipmentNumber}</Text>
                    <Text>{shipment.address.fullName}</Text>
                    <Text>{shipment.address.address1}</Text>
                    {shipment.address.address2 && (
                      <Text>{shipment.address.address2}</Text>
                    )}
                    <Text>
                      {shipment.address.city} {shipment.address.stateCode}{" "}
                      {shipment.address.postalCode}
                    </Text>
                    <Text>US</Text>
                    <Text>{shipment.address.phone}</Text>
                    <Text>Shipping Method: {shipment.shippingMethod.name}</Text>
                  </View>
                ))}

              <Text>#### Product Info ####</Text>
              {order.productItems &&
                order.productItems.map((product: any) => (
                  <View key={product.productId}>
                    <Text>SKU: {product.productId}</Text>
                    <Text>Product: {product.title}</Text>
                    <Text>Qty: {product.quantity}</Text>
                    <Text>Total Price: {translate.currency(product.totalPrice)}</Text>
                  </View>
                ))}

              <Text>#### Footer ####</Text>
              {Array.isArray(order.shipments) && order.shipments
                .filter((shipment: any) => shipment.shippingMethod && shipment.shippingMethod.price)
                .map((shipment: any) => (
                  <Text>Shipping {translate.currency(shipment.shippingMethod.price)}</Text>
                )
              )}
              <Text>Tax {translate.currency(order.orderTax)}</Text>
              <Text>Total {translate.currency(order.orderTotal)}</Text>
            </View>
          ))}
        <Button
          title="Fetch Orders"
          onPress={() => {
            demandware
              .fetchOrders()
              .then((orders: any) =>
                this.setState({
                  orders,
                  message: "Fetch Orders Successful",
                  lastUpdated: new Date().toISOString()
                })
              )
              .catch((e: any) => {
                console.warn(e);
                this.setState({
                  message: parseError(e),
                  lastUpdated: new Date().toISOString()
                });
              });
          }}
        />
      </View>
    );
  }
}

class FetchOrder extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      lastUpdated: null,
      message: "",
      order: null,
      orderId: testData.orderId
    };
  }

  render(): JSX.Element {
    const { message, order, orderId, lastUpdated } = this.state;
    return (
      <View style={styles.section}>
        <Text style={styles.label}>FetchOrder {orderId}</Text>
        {lastUpdated && <Text>Last Response: {lastUpdated}</Text>}
        <Text>{message}</Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ orderId: text })}
          autoCorrect={false}
          value={orderId}
          style={styles.textInput}
          placeholder="Order Id"
        />
        {order && (
          <View key={order.orderId}>
            <Text>Order History</Text>
            <Text>#### Order Info ####</Text>
            <Text>Ship ID: {order.orderId}</Text>
            <Text>Date: {translate.date(order.creationDate)}</Text>
            <Text>Status: {order.status}</Text>

            <Text>#### Billing Info ####</Text>
            <Text>{order.billingAddress.fullName}</Text>
            <Text>{order.billingAddress.address1}</Text>
            {order.billingAddress.address2 && (
              <Text>{order.billingAddress.address2}</Text>
            )}
            <Text>
              {order.billingAddress.city} {order.billingAddress.stateCode}{" "}
              {order.billingAddress.postalCode}
            </Text>
            <Text>US</Text>
            <Text>{order.billingAddress.phone}</Text>

            <Text>#### Payment Method ####</Text>
            <Text>
              {order.payments[0].paymentCard.cardType}{" "}
              {order.payments[0].paymentCard.maskedNumber}
            </Text>

            <Text>#### Shipping Info ####</Text>
            {order.shipments &&
              order.shipments.map((shipment: any) => (
                <View key={shipment.shipmentNumber}>
                  <Text>Shipment No. {shipment.shipmentNumber}</Text>
                  <Text>{shipment.address.fullName}</Text>
                  <Text>{shipment.address.address1}</Text>
                  {shipment.address.address2 && (
                    <Text>{shipment.address.address2}</Text>
                  )}
                  <Text>
                    {shipment.address.city} {shipment.address.stateCode}{" "}
                    {shipment.address.postalCode}
                  </Text>
                  <Text>US</Text>
                  <Text>{shipment.address.phone}</Text>
                  <Text>Shipping Method: {shipment.shippingMethod.name}</Text>
                </View>
              ))}

            <Text>#### Product Info ####</Text>
            {order.productItems &&
              order.productItems.map((product: any) => (
                <View key={product.productId}>
                  <Text>SKU: {product.productId}</Text>
                  <Text>Product: {product.title}</Text>
                  <Text>Qty: {product.quantity}</Text>
                  <Text>Total Price: {translate.currency(product.totalPrice)}</Text>
                </View>
              ))}

            <Text>#### Footer ####</Text>
            {Array.isArray(order.shipments) && order.shipments.map((shipment: any) => (
              <Text>Shipping {translate.currency(shipment.shippingMethod.price)}</Text>
            ))}
            <Text>Tax {translate.currency(order.orderTax)}</Text>
            <Text>Total {translate.currency(order.orderTotal)}</Text>
          </View>
        )}
        <Button
          title="Fetch Order "
          onPress={() => {
            demandware
              .fetchOrder(orderId)
              .then((order) =>
                this.setState({
                  order,
                  message: "Fetch Order Successful",
                  lastUpdated: new Date().toISOString()
                })
              )
              .catch((e: any) => {
                console.warn(e);
                this.setState({
                  message: parseError(e),
                  lastUpdated: new Date().toISOString()
                });
              });
          }}
        />
      </View>
    );
  }
}

class FetchSavedAddresses extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      lastUpdated: null,
      message: "",
      addresses: null
    };
  }

  render(): JSX.Element {
    const { message, addresses, lastUpdated } = this.state;
    return (
      <View style={styles.section}>
        <Text style={styles.label}>FetchSavedAddresses</Text>
        {lastUpdated && <Text>Last Response: {lastUpdated}</Text>}
        <Text>{message}</Text>
        {addresses &&
          addresses.map((address: any) => (
            <View
              key={address.id}
              style={{ backgroundColor: "#ccc", marginVertical: 5 }}
            >
              <Text>JSON: {JSON.stringify(address)}</Text>
            </View>
          ))}
        <Button
          title="Fetch Addresses"
          onPress={() => {
            demandware
              .fetchSavedAddresses()
              .then((addresses: any) =>
                this.setState({
                  addresses,
                  message: "Fetch Saved Addresses Successful",
                  lastUpdated: new Date().toISOString()
                })
              )
              .catch((e: any) => {
                console.warn(e);
                this.setState({
                  message: parseError(e),
                  lastUpdated: new Date().toISOString()
                });
              });
          }}
        />
      </View>
    );
  }
}

class AddSavedAddress extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      lastUpdated: null,
      message: "",
      ...testData.newAddress
    };
  }

  render(): JSX.Element {
    const {
      message,
      lastUpdated,
      id,
      firstName,
      lastName,
      address1,
      address2,
      city,
      stateCode,
      postalCode,
      phone,
      email
    } = this.state;
    return (
      <View style={styles.section}>
        <Text style={styles.label}>AddSavedAddresses</Text>
        {lastUpdated && <Text>Last Response: {lastUpdated}</Text>}
        <Text>{message}</Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ id: text })}
          autoCorrect={false}
          value={id}
          style={styles.textInput}
          placeholder="address id"
        />
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ firstName: text })}
          autoCorrect={false}
          value={firstName}
          style={styles.textInput}
          placeholder="firstName"
        />
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ lastName: text })}
          autoCorrect={false}
          value={lastName}
          style={styles.textInput}
          placeholder="lastName"
        />
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ address1: text })}
          autoCorrect={false}
          value={address1}
          style={styles.textInput}
          placeholder="address1"
        />
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ address2: text })}
          autoCorrect={false}
          value={address2}
          style={styles.textInput}
          placeholder="address2"
        />
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ city: text })}
          autoCorrect={false}
          value={city}
          style={styles.textInput}
          placeholder="city"
        />
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ stateCode: text })}
          autoCorrect={false}
          value={stateCode}
          style={styles.textInput}
          placeholder="stateCode"
        />
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ postalCode1: text })}
          autoCorrect={false}
          value={postalCode}
          style={styles.textInput}
          placeholder="postalCode"
        />
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ phone: text })}
          autoCorrect={false}
          value={phone}
          style={styles.textInput}
          placeholder="phone"
        />
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ email: text })}
          autoCorrect={false}
          value={email}
          style={styles.textInput}
          placeholder="phone"
        />
        <Button
          title="Add Address"
          onPress={() => {
            demandware
              .addSavedAddress({
                id,
                firstName,
                lastName,
                address1,
                address2,
                city,
                stateCode,
                postalCode,
                phone,
                countryCode: "US",
                preferred: true
              })
              .then((address: any) =>
                this.setState({
                  address,
                  message: "Add Address Successful",
                  lastUpdated: new Date().toISOString()
                })
              )
              .catch((e: any) => {
                console.warn(e);
                this.setState({
                  message: parseError(e),
                  lastUpdated: new Date().toISOString()
                });
              });
          }}
        />
      </View>
    );
  }
}

class EditSavedAddress extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      lastUpdated: null,
      message: "",
      ...testData.updateAddress
    };
  }

  render(): JSX.Element {
    const {
      message,
      lastUpdated,
      id,
      firstName,
      lastName,
      address1,
      address2,
      city,
      stateCode,
      postalCode,
      phone
    } = this.state;
    return (
      <View style={styles.section}>
        <Text style={styles.label}>EditSavedAddresses</Text>
        {lastUpdated && <Text>Last Response: {lastUpdated}</Text>}
        <Text>{message}</Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ id: text })}
          autoCorrect={false}
          value={id}
          style={styles.textInput}
          placeholder="address id"
        />
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ firstName: text })}
          autoCorrect={false}
          value={firstName}
          style={styles.textInput}
          placeholder="firstName"
        />
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ lastName: text })}
          autoCorrect={false}
          value={lastName}
          style={styles.textInput}
          placeholder="lastName"
        />
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ address1: text })}
          autoCorrect={false}
          value={address1}
          style={styles.textInput}
          placeholder="address1"
        />
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ address2: text })}
          autoCorrect={false}
          value={address2}
          style={styles.textInput}
          placeholder="address2"
        />
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ city: text })}
          autoCorrect={false}
          value={city}
          style={styles.textInput}
          placeholder="city"
        />
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ stateCode: text })}
          autoCorrect={false}
          value={stateCode}
          style={styles.textInput}
          placeholder="stateCode"
        />
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ postalCode1: text })}
          autoCorrect={false}
          value={postalCode}
          style={styles.textInput}
          placeholder="postalCode"
        />
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ phone: text })}
          autoCorrect={false}
          value={phone}
          style={styles.textInput}
          placeholder="phone"
        />
        <Button
          title="Edit Address"
          onPress={() => {
            demandware
              .editSavedAddress({
                id,
                firstName,
                lastName,
                address1,
                address2,
                city,
                stateCode,
                postalCode,
                phone,
                countryCode: "US",
                preferred: true
              })
              .then((address: any) =>
                this.setState({
                  address,
                  message: "Edit Address Successful",
                  lastUpdated: new Date().toISOString()
                })
              )
              .catch((e: any) => {
                console.warn(e);
                this.setState({
                  message: parseError(e),
                  lastUpdated: new Date().toISOString()
                });
              });
          }}
        />
      </View>
    );
  }
}

class DeleteSavedAddress extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      lastUpdated: null,
      message: "",
      id: testData.savedAddressToDelete
    };
  }

  render(): JSX.Element {
    const { message, lastUpdated, id } = this.state;
    return (
      <View style={styles.section}>
        <Text style={styles.label}>DeleteSavedAddresses</Text>
        {lastUpdated && <Text>Last Response: {lastUpdated}</Text>}
        <Text>{message}</Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ id: text })}
          autoCorrect={false}
          value={id}
          style={styles.textInput}
          placeholder="address id"
        />
        <Button
          title="Delete Address"
          onPress={() => {
            demandware
              .deleteSavedAddress(id)
              .then((address: any) =>
                this.setState({
                  address,
                  message: "Delete Address Successful",
                  lastUpdated: new Date().toISOString()
                })
              )
              .catch((e: any) => {
                console.warn(e);
                this.setState({
                  message: parseError(e),
                  lastUpdated: new Date().toISOString()
                });
              });
          }}
        />
      </View>
    );
  }
}

class FetchSavedPayments extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      lastUpdated: null,
      message: "",
      payments: null
    };
  }

  render(): JSX.Element {
    const { message, payments, lastUpdated } = this.state;
    return (
      <View style={styles.section}>
        <Text style={styles.label}>FetchPayments</Text>
        {lastUpdated && <Text>Last Response: {lastUpdated}</Text>}
        <Text>{message}</Text>
        {payments &&
          payments.map((payment: any) => (
            <View
              key={payment.id}
              style={{ backgroundColor: "#ccc", marginVertical: 5 }}
            >
              <Text>JSON: {JSON.stringify(payment)}</Text>
            </View>
          ))}
        <Button
          title="Fetch Payments "
          onPress={() => {
            demandware
              .fetchSavedPayments()
              .then((payments: any) =>
                this.setState({
                  payments,
                  message: "Fetch Payments Successful",
                  lastUpdated: new Date().toISOString()
                })
              )
              .catch((e: any) => {
                console.warn(e);
                this.setState({
                  message: parseError(e),
                  lastUpdated: new Date().toISOString()
                });
              });
          }}
        />
      </View>
    );
  }
}

class AddSavedPayment extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      lastUpdated: null,
      message: "",
      ...testData.creditCard
    };
  }

  render(): JSX.Element {
    const {
      message,
      lastUpdated,
      expirationMonth,
      expirationYear,
      number
    } = this.state;
    return (
      <View style={styles.section}>
        <Text style={styles.label}>AddSavedAddPayment</Text>
        {lastUpdated && <Text>Last Response: {lastUpdated}</Text>}
        <Text>{message}</Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ expirationYear: text })}
          autoCorrect={false}
          value={expirationYear}
          style={styles.textInput}
          placeholder="expirationYear"
        />
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ expirationMonth: text })}
          autoCorrect={false}
          value={expirationMonth}
          style={styles.textInput}
          placeholder="expirationMonth"
        />
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ number: text })}
          autoCorrect={false}
          value={number}
          style={styles.textInput}
          placeholder="number"
        />
        <Button
          title="Add Payment"
          onPress={() => {
            demandware
              .addSavedPayment({
                paymentCard: {
                  expirationMonth: parseInt(expirationMonth),
                  expirationYear: parseInt(expirationYear),
                  number
                },
                paymentMethodId: "CREDIT_CARD"
              })
              .then((address: any) =>
                this.setState({
                  address,
                  message: "Add Payment Successful",
                  lastUpdated: new Date().toISOString()
                })
              )
              .catch((e: any) => {
                console.warn(e);
                this.setState({
                  message: parseError(e),
                  lastUpdated: new Date().toISOString()
                });
              });
          }}
        />
      </View>
    );
  }
}

class DeleteSavedPayment extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      lastUpdated: null,
      message: "",
      id: testData.savedPaymentToDelete
    };
  }

  render(): JSX.Element {
    const { message, lastUpdated, id } = this.state;
    return (
      <View style={styles.section}>
        <Text style={styles.label}>DeleteSavedPayment</Text>
        {lastUpdated && <Text>Last Response: {lastUpdated}</Text>}
        <Text>{message}</Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={text => this.setState({ id: text })}
          autoCorrect={false}
          value={id}
          style={styles.textInput}
          placeholder="payment id"
        />
        <Button
          title="Delete Payment"
          onPress={() => {
            demandware
              .deleteSavedPayment(id)
              .then((address: any) =>
                this.setState({
                  address,
                  message: "Delete Payment Successful",
                  lastUpdated: new Date().toISOString()
                })
              )
              .catch((e: any) => {
                console.warn(e);
                this.setState({
                  message: parseError(e),
                  lastUpdated: new Date().toISOString()
                });
              });
          }}
        />
      </View>
    );
  }
}

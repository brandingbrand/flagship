import React, { Component } from 'react';
import {
  ScrollView
} from 'react-native';

import Row from '../../components/Row';

export default class Home extends Component<any, any> {
  startCheckout = () => {
    this.props.navigator.showModal({ screen: 'fscheckout.CheckoutDemo', title: 'CheckoutDemo' });
  }

  render(): JSX.Element {
    return (
      <ScrollView style={{ flex: 1 }}>
        <Row text='CheckoutDemo' onPress={this.startCheckout} />
      </ScrollView>
    );
  }
}

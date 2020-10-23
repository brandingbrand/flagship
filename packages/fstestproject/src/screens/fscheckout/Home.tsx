import React, { Component } from 'react';
import {
  ScrollView
} from 'react-native';
import { Navigation } from 'react-native-navigation';

import Row from '../../components/Row';

export default class Home extends Component<any, any> {
  startCheckout = () => {
    Navigation.showModal({
      component: {
        name: 'fscheckout.CheckoutDemo',
        options: {
          topBar: {
            title: {
              text: 'CheckoutDemo'
            }
          }
        }
      }
    }).catch(err => console.warn('fscheckout.CheckoutDemo SHOWMODAL error: ', err));
  }

  render(): JSX.Element {
    return (
      <ScrollView style={{ flex: 1 }}>
        <Row text='CheckoutDemo' onPress={this.startCheckout} />
      </ScrollView>
    );
  }
}

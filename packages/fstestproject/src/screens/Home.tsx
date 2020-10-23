import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Row from '../components/Row';

export default class Home extends Component<any> {
  render(): JSX.Element {
    return (
      <ScrollView>
        <Row text='FSCommerce' onPress={this.goTo('fscommerce.Home')} />
        <Row text='FSProductIndex' onPress={this.goTo('fsproductindex.Home')} />
        <Row text='FSCategory' onPress={this.goTo('fscategory.Home')} />
        <Row text='FSCart' onPress={this.goTo('fscart.Home')} />
        <Row text='FSCheckout' onPress={this.goTo('fscheckout.Home')} />
        <Row text='FSProductDetail' onPress={this.goTo('fsproductdetail.Home')} />
      </ScrollView>
    );
  }

  goTo = (screen: string) =>
    () => Navigation.push(this.props.componentId, { component: { name: screen } })
      .catch(err => console.warn(`${screen} PUSH error: `, err))
}

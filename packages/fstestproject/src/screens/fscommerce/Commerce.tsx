import React, { Component } from 'react';
import {
  ScrollView
} from 'react-native';

import Row from '../../components/Row';

export default class Home extends Component<any, any> {
  goTo = (screen: any, title: any, backButtonTitle: any) => () => {
    this.props.navigator.push({ screen: 'fscommerce.' + screen, title, backButtonTitle });
  }

  render(): JSX.Element {
    return (
      <ScrollView style={{ flex: 1 }}>
        <Row
          text='Commerce Provider'
          onPress={this.goTo('CommerceProvider', 'CommerceProvider', 'Back')}
        />
        <Row
          text='Demandware'
          onPress={this.goTo('Demandware', 'Demandware', 'Back')}
        />
        <Row text='Shopify' onPress={this.goTo('Shopify', 'Shopify', 'Back')} />
        <Row
          text='DemandwareAccount'
          onPress={this.goTo('DemandwareAccount', 'DemandwareAccount', 'Back')}
        />
        <Row
          text='DemandwareCart'
          onPress={this.goTo('DemandwareCart', 'DemandwareCart', 'Back')}
        />
        <Row
          text='Mock Commerce Data Source'
          onPress={this.goTo('MockCommerceDataSource', 'MockCommerceDataSource', 'Back')}
        />
      </ScrollView>
    );
  }
}

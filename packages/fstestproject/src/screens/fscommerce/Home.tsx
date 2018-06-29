import React, { Component } from 'react';
import {
  ScrollView
} from 'react-native';

import Row from '../../components/Row';

export default class Home extends Component<any, any> {
  goTo = (screen: string, title: string, backButtonTitle: string) => () => {
    this.props.navigator.push({ screen: 'fscommerce.' + screen, title, backButtonTitle });
  }

  render(): JSX.Element {
    return (
      <ScrollView style={{ flex: 1 }}>
        <Row
          text='Commerce'
          onPress={this.goTo('Commerce', 'Commerce', 'Back')}
        />
        <Row text='Review' onPress={this.goTo('Review', 'Review', 'Back')} />
        <Row text='Address' onPress={this.goTo('Address', 'Address', 'Back')} />
      </ScrollView>
    );
  }
}

import React, { Component } from 'react';
import {
  ScrollView
} from 'react-native';
import { goToNavPush } from '../../lib/navigation';

import Row from '../../components/Row';

export default class Home extends Component<any, any> {
  goTo = (screen: string, title: string, backButtonTitle: string) => () => {
    goToNavPush('fscommerce', this.props.componentId, screen, title, backButtonTitle);
  }

  render(): JSX.Element {
    return (
      <ScrollView style={{ flex: 1 }}>
        <Row
          text='Commerce'
          onPress={this.goTo('Commerce', 'Commerce', 'Back')}
        />
        <Row text='Review' onPress={this.goTo('Review', 'Review', 'Back')} />
      </ScrollView>
    );
  }
}

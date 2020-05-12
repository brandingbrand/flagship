import React, { Component } from 'react';
import {
  ScrollView
} from 'react-native';
import { goToNavPush } from '../../lib/navigation';

import Row from '../../components/Row';

export default class Home extends Component<any> {
  goTo = (screen: string, title: string, backButtonTitle: string) => () => {
    goToNavPush('fsproductindex', this.props.componentId, screen, title, backButtonTitle);
  }

  render(): JSX.Element {
    return (
      <ScrollView style={{ flex: 1 }}>
        <Row
          text='Search With Provider'
          onPress={this.goTo('Search', 'Search', 'Back')}
        />
        <Row
          text='Product Index Grid'
          onPress={this.goTo(
            'ProductIndexGrid',
            'ProductIndexGrid',
            'Back'
          )}
        />
        <Row
          text='Product Index List'
          onPress={this.goTo(
            'ProductIndexList',
            'ProductIndexList',
            'Back'
          )}
        />
      </ScrollView>
    );
  }
}

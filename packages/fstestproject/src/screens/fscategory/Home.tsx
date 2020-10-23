import React, { Component } from 'react';
import {
  ScrollView
} from 'react-native';
import { goToNavPush } from '../../lib/navigation';

import Row from '../../components/Row';

export default class Home extends Component<any> {
  goTo = (screen: string, title: string, backButtonTitle: string) => () => {
    goToNavPush('fscategory', this.props.componentId, screen, title, backButtonTitle);
  }

  render(): JSX.Element {
    return (
      <ScrollView style={{ flex: 1 }}>
        <Row
          text='Category List'
          onPress={this.goTo(
            'CategoryList',
            'CategoryList',
            'Back'
          )}
        />
        <Row
          text='Category Grid (3 Col)'
          onPress={this.goTo(
            'CategoryGrid',
            'CategoryGrid',
            'Back'
          )}
        />
      </ScrollView>
    );
  }
}

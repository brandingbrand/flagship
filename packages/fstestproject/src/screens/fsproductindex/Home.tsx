import React, { Component } from 'react';
import {
  ScrollView
} from 'react-native';

import Row from '../../components/Row';

export default class Home extends Component<any> {
  goTo = (screen: string, title: string, backButtonTitle: string) => () => {
    this.props.navigator.push({ screen: 'fsproductindex.' + screen, title, backButtonTitle });
  }

  render(): JSX.Element {
    return (
      <ScrollView style={{ flex: 1 }}>
        <Row
          text='Search DemandWare With Provider'
          onPress={this.goTo('SearchDemandware', 'SearchDemandware', 'Back')}
        />
        <Row
          text='Product Index DemandwareGrid'
          onPress={this.goTo(
            'ProductIndexDemandwareGrid',
            'ProductIndexDemandwareGrid',
            'Back'
          )}
        />
        <Row
          text='Product Index DemandwareList'
          onPress={this.goTo(
            'ProductIndexDemandwareList',
            'ProductIndexDemandwareList',
            'Back'
          )}
        />
      </ScrollView>
    );
  }
}

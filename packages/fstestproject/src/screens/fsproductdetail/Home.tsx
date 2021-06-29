import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight
} from 'react-native';
import { goToNavPush } from '../../lib/navigation';

const S = StyleSheet.create({
  row: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  rowText: {
    fontSize: 15
  }
});

export default class Home extends Component<any> {
  goTo = (screen: string, title: string, backButtonTitle: string) => () => {
    goToNavPush('fsproductdetail', this.props.componentId, screen, title, backButtonTitle);
  }

  render(): JSX.Element {
    return (
      <ScrollView style={{ flex: 1 }}>
        <Row
          text='Product Detail Example'
          onPress={this.goTo('ProductDetailExample', 'Product Detail', 'Back')}
        />
      </ScrollView>
    );
  }
}

function Row({ text, onPress }: any): JSX.Element {
  return (
    <TouchableHighlight onPress={onPress} style={S.row} underlayColor='#eee'>
      <Text style={S.rowText}>
        {text}
      </Text>
    </TouchableHighlight>
  );
}

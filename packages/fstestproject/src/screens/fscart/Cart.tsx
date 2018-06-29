/* tslint:disable:jsx-use-translation-function */

import React, { Component } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { demandware } from '../../lib/datasource';

import { Cart } from '@brandingbrand/fscart';
const kExampleProductIds = [
  '701644155391',
  '701644574116',
  '701644395636'
];

export default class CartTest extends Component<any> {
  state: any = {
    cartVisible: true
  };

  onChange = (data: any) => {
    console.log('cart was changed');
    console.log(data);
  }

  reloadCart = () => {
    this.setState({ cartVisible: false }, () => {
      this.setState({ cartVisible: true });
    });
  }

  imagePress = (item: any) => {
    alert('Image pressed: ' + item.title);
  }

  handlePress = (id: string) => () => {
    demandware.addToCart(id)
      .then(this.reloadCart)
      .catch(e => console.warn(e));
  }

  render(): JSX.Element {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {kExampleProductIds.map((id, i) => {
            return (
              <TouchableOpacity
                key={i}
                style={{ padding: 10, backgroundColor: '#eee' }}
                onPress={this.handlePress(id)}
              >
                <Text>Add {id}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView>
          {this.state.cartVisible && (
            <Cart
              commerceDataSource={demandware}
              onChange={this.onChange}
              onImagePress={this.imagePress}
            />
          )}
        </ScrollView>
      </View>
    );
  }
}

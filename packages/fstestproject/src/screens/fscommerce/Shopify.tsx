/*import React, { Component } from 'react';
import {
  ScrollView
} from 'react-native';

import Row from '../../components/Row';
import { shopify } from '../../lib/datasource';


export default class Shopify extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <ScrollView style={{ flex: 1 }}>
        <Row text='Add To Cart' onPress={this.addToCart} />
        <Row text='Fetch Cart' onPress={this.fetchCart} />
        <Row text='Remove 1st Cart Item' onPress={this.removeCartItem} />
        <Row
          text='Update 1st Cart Item Qty to 10'
          onPress={this.updateCartItemQty(10)}
        />
        <Row
          text='Update 1st Cart Item Qty to 0'
          onPress={this.updateCartItemQty(0)}
        />
        <Row text='applyPromo' onPress={this.applyPromo} />
        <Row text='removePromo' onPress={this.removePromo} />
        <Row text='Search' onPress={this.search} />
        <Row text='Fetch Product' onPress={this.fetchProduct} />
        <Row text='Fetch Product Index' onPress={this.fetchProducts} />
        <Row text='Fetch One Category' onPress={this.fetchCategory} />
        <Row text='Fetch All Categories' onPress={this.fetchCategories} />
      </ScrollView>
    );
  }

  showData = (data: any) => {
    this.props.navigator.push({
      screen: 'fscommerce.DataView',
      passProps: {
        json: JSON.stringify(data, null, '  ')
      }
    });
  }

  fetchCart = () => {
    shopify
      .fetchCart()
      .then((data: any) => {
        this.showData(data);
      })
      .catch((err: any) => {
        console.warn(err);
      });
  }

  addToCart = () => {
    // variant id
    shopify
      .addToCart('Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMTE2ODE3NjE5NQ==')
      .then((data: any) => {
        this.showData(data);
      })
      .catch((err: any) => {
        console.warn(err);
      });
  }

  fetchProduct = () => {
    shopify
      .fetchProduct('Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzkwMDc1NjQ2MTE=')
      .then((data: any) => {
        this.showData(data);
      })
      .catch((err: any) => {
        console.warn(err);
      });
  }

  search = () => {
    shopify
      .search('skin')
      .then((data: any) => {
        this.showData(data);
      })
      .catch((err: any) => {
        console.warn(err);
      });
  }

  fetchProducts = () => {
    shopify
      .fetchProductIndex({
        categoryId: 'Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzIzNTM4NTY2Nw=='
      })
      .then((data: any) => {
        this.showData(data);
      })
      .catch((err: any) => {
        console.warn(err);
      });
  }

  fetchCategory = () => {
    shopify
      .fetchCategory('Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzIzNTM4NTY2Nw==')
      .then((data: any) => {
        this.showData(data);
      })
      .catch((err: any) => {
        console.warn(err);
      });
  }

  fetchCategories = () => {
    shopify
      .fetchCategory()
      .then((data: any) => {
        this.showData(data);
      })
      .catch((err: any) => {
        console.warn(err);
      });
  }

  removeCartItem = () => {
    shopify
      .fetchCart()
      .then(async (data: any) => {
        const items = data.items;
        if (items.length) {
          return shopify.removeCartItem(items[0].itemId);
        } else {
          return Promise.reject('nothing in the cart');
        }
      })
      .then((data: any) => {
        this.showData(data);
      })
      .catch((err: any) => {
        console.warn(err);
      });
  }

  updateCartItemQty = (qty: number) => () => {
    shopify
      .fetchCart()
      .then(async (data: any) => {
        const items = data.items;
        if (items.length) {
          return shopify.updateCartItemQty(items[0].itemId, qty);
        } else {
          return Promise.reject('nothing in the cart');
        }
      })
      .then((data: any) => {
        this.showData(data);
      })
      .catch((err: any) => {
        console.warn(err);
      });
  }
  applyPromo = () => {
    shopify
      .applyPromo('SAVEMORE')
      .then((data: any) => {
        this.showData(data);
      })
      .catch((err: any) => {
        showError(err);
      });
  }

  removePromo = () => {
    shopify
      .fetchCart()
      .then(async (data: any) => {
        const promos = data.promos;
        if (promos.length) {
          return shopify.removePromo(promos[0].id);
        } else {
          return Promise.reject('no promo in the cart');
        }
      })
      .then((data: any) => {
        this.showData(data);
      })
      .catch((err: any) => {
        showError(err);
      });
  }
}

function showError(err: any): void {
  if (
    err.response &&
    err.response.data &&
    err.response.data.fault &&
    err.response.data.fault.message
  ) {
    console.warn(err.response.data.fault.message);
  } else {
    console.warn(err);
  }
}
*/


import React, { Component } from 'react';
import {
  ScrollView
} from 'react-native';

import Row from '../../components/Row';
import { mockCommerceDataSource } from '../../lib/datasource';
import { CommerceDataSource } from '@brandingbrand/fscommerce';

const exampleCategoryId = 'electronics-digital-cameras';
const exampleProductId1 = 'sony-alpha350-wlen';
const exampleProductId2 = 'canon-powershot-g10';
const exampleSearchTerm = 'Sony';
const examplePipRefinement = { brand: 'Sony' };
const validPromoCode = 'VALID';
const invalidPromoCode = 'INVALID';

export default class MockCommerceDataSource extends Component<any, any> {
  private dataSource: CommerceDataSource;

  constructor(props: any) {
    super(props);

    // Capture and display any error messages that are created by the data source
    this.dataSource = new Proxy(mockCommerceDataSource, {
      get: (target: any, prop: any) => {
        if (typeof target[prop] !== 'function') {
          return target[prop];
        }

        return (...args: any[]) => {
          const ret = target[prop](...args);
          if (ret instanceof Promise) {
            ret.catch((e: Error) => this.showData({ message: e.message }));
          }
          return ret;
        };
      }
    });
  }

  render(): JSX.Element {
    return (
      <ScrollView style={{ flex: 1 }}>
        <Row text='Fetch One Category' onPress={this.fetchCategory} />
        <Row text='Fetch Product Index' onPress={this.fetchProducts} />
        <Row
          text='Fetch Product Index With Sort'
          onPress={this.fetchProductsSorted}
        />
        <Row
          text='Fetch Product Index With Filter'
          onPress={this.fetchProductsFiltered}
        />
        <Row
          text='Fetch Product Index With Pagination'
          onPress={this.fetchProductsPagination}
        />
        <Row text='Fetch Product' onPress={this.fetchProduct} />
        <Row text='Fetch Recommendations' onPress={this.fetchRecommendations} />
        <Row text='Search Suggestion' onPress={this.searchSuggestion} />
        <Row text='Search' onPress={this.search} />
        <Row text='Add To Cart (item 1)' onPress={this.addToCart(exampleProductId1)} />
        <Row text='Add To Cart (item 2)' onPress={this.addToCart(exampleProductId2)} />
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
        <Row text='Apply Valid Promo' onPress={this.applyPromo(validPromoCode)} />
        <Row text='Apply Invalid Promo' onPress={this.applyPromo(invalidPromoCode)} />
        <Row text='Remove 1st Promo' onPress={this.removePromo} />
        <Row text='Destroy Cart' onPress={this.destroyCart} />
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

  fetchCategory = async () => {
    const data = await this.dataSource.fetchCategory(exampleCategoryId);
    this.showData(data);
  }

  fetchProducts = async () => {
    const data = await this.dataSource.fetchProductIndex({
      categoryId: exampleCategoryId
    });

    this.showData(data);
  }

  fetchProductsSorted = async () => {
    const data = await this.dataSource.fetchProductIndex({
      categoryId: exampleCategoryId,
      sortBy: 'price-desc'
    });

    this.showData(data);
  }

  fetchProductsFiltered = async () => {
    const data = await this.dataSource.fetchProductIndex({
      categoryId: exampleCategoryId,
      refinements: examplePipRefinement
    });

    this.showData(data);
  }

  fetchProductsPagination = async () => {
    const data = await this.dataSource.fetchProductIndex({
      categoryId: exampleCategoryId,
      page: 1,
      limit: 2
    });
    this.showData(data);
  }

  fetchProduct = async () => {
    const data = await this.dataSource.fetchProduct(exampleProductId1);
    this.showData(data);
  }

  fetchRecommendations = async () => {
    const data = await this.dataSource.fetchProductRecommendations(exampleProductId1);
    this.showData(data);
  }

  searchSuggestion = async () => {
    const data = await this.dataSource.searchSuggestion('son');
    this.showData(data);
  }

  search = async () => {
    const data = await this.dataSource.search(exampleSearchTerm);
    this.showData(data);
  }

  fetchCart = async () => {
    const data = await this.dataSource.fetchCart();
    this.showData(data);
  }

  addToCart = (sku: string) => async () => {
    const data = await this.dataSource.addToCart(sku);
    this.showData(data);
  }

  removeCartItem = async () => {
    const cart = await this.dataSource.fetchCart();
    const items = cart.items;
    if (items.length === 0) {
      throw new Error('nothing in the cart');
    }

    const updatedCart = await this.dataSource.removeCartItem(items[0].itemId);
    this.showData(updatedCart);
  }

  updateCartItemQty = (qty: number) => async () => {
    const cart = await this.dataSource.fetchCart();
    const items = cart.items;
    if (items.length === 0) {
      throw new Error('Nothing in the cart');
    }

    const updatedCart = await this.dataSource.updateCartItemQty(items[0].itemId, qty);
    this.showData(updatedCart);
  }

  applyPromo = (code: string) => async () => {
    const data = await this.dataSource.applyPromo(code);
    this.showData(data);
  }

  removePromo = async () => {
    const cart = await this.dataSource.fetchCart();
    const promos = cart.promos;
    if (!Array.isArray(promos) || promos.length === 0) {
      throw new Error('no promo in the cart');
    }
    const updatedCart = await this.dataSource.removePromo(promos[0].id);
    this.showData(updatedCart);
  }

  destroyCart = async () => {
    await this.dataSource.destroyCart();
    alert('Cart emptied');
  }
}

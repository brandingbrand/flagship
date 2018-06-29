import React, { Component } from 'react';
import {
  ScrollView
} from 'react-native';

import Row from '../../components/Row';
import { demandware } from '../../lib/datasource';

const kExampleCategoryId = 'electronics-game-consoles';
const kExampleProductId = '25697194';
const kExampleSearchTerm = 'ps3';
const kExamplePipRefinement = { brand: 'Sony' };

export default class Demandware extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <ScrollView style={{ flex: 1 }}>
        <Row onPress={this.destroyBasket} text={'Destroy Basket'} />
        <Row
          text='Fetch Product Index With Filter'
          onPress={this.fetchProductsFilter}
        />
        <Row
          text='Fetch Product Index With Pagination'
          onPress={this.fetchProductsPagination}
        />
        <Row
          text='Fetch Product Index With Sort'
          onPress={this.fetchProductsSort}
        />
        <Row text='Fetch Product Index' onPress={this.fetchProducts} />
        <Row text='Search Suggestion' onPress={this.searchSuggestion} />
        <Row text='Fetch Cart' onPress={this.fetchCart} />
        <Row text='Add To Cart' onPress={this.addToCart} />
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
        <Row text='Fetch One Category' onPress={this.fetchCategory} />
        <Row text='Fetch Recommendations' onPress={this.fetchRecommendations} />
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

  destroyBasket = () => {
    demandware.destroyCart().then(cart => {
      alert('cart destroyed');
    }).catch(showError);
  }

  fetchProduct = () => {
    demandware
      .fetchProduct(kExampleProductId)
      .then((data: any) => {
        this.showData(data);
      })
      .catch((err: any) => {
        showError(err);
      });
  }

  search = () => {
    demandware
      .search(kExampleSearchTerm)
      .then((data: any) => {
        data.products = data.products.slice(0, 3); // text view couldn't show too much
        this.showData(data);
      })
      .catch((err: any) => {
        showError(err);
      });
  }

  fetchProducts = () => {
    demandware
      .fetchProductIndex({
        categoryId: kExampleCategoryId
      })
      .then((data: any) => {
        this.showData(data);
      })
      .catch((err: any) => {
        showError(err);
      });
  }

  fetchProductsSort = () => {
    demandware
      .fetchProductIndex({
        categoryId: kExampleCategoryId,
        sortBy: 'price-high-to-low'
      })
      .then((data: any) => {
        this.showData(data);
      })
      .catch((err: any) => {
        showError(err);
      });
  }

  fetchProductsFilter = () => {
    demandware
      .fetchProductIndex({
        categoryId: kExampleCategoryId,
        refinements: kExamplePipRefinement
      })
      .then((data: any) => {
        this.showData(data);
      })
      .catch((err: any) => {
        showError(err);
      });
  }

  fetchProductsPagination = () => {
    demandware
      .fetchProductIndex({
        categoryId: kExampleCategoryId,
        page: 4,
        limit: 10
      })
      .then((data: any) => {
        this.showData(data);
      })
      .catch((err: any) => {
        showError(err);
      });
  }

  fetchCategory = () => {
    demandware
      .fetchCategory('root', { })
      .then((data: any) => {
        this.showData(data);
      })
      .catch((err: any) => {
        showError(err);
      });
  }

  fetchRecommendations = () => {
    demandware
      .fetchProductRecommendations(kExampleProductId)
      .then((data: any) => {
        // Only return the first recommendation so the text-view can actually display it
        data = [data[0]];
        this.showData(data);
      })
      .catch((err: any) => {
        showError(err);
      });
  }

  fetchCart = () => {
    demandware
      .fetchCart()
      .then((data: any) => {
        this.showData(data);
      })
      .catch((err: any) => {
        showError(err);
      });
  }

  searchSuggestion = () => {
    demandware
      .searchSuggestion('bann')
      .then((data: any) => {
        this.showData(data);
      })
      .catch((err: any) => {
        showError(err);
      });
  }

  addToCart = () => {
    demandware
      .addToCart(kExampleProductId)
      .then((data: any) => {
        this.showData(data);
      })
      .catch((err: any) => {
        showError(err);
      });
  }

  removeCartItem = () => {
    demandware
      .fetchCart()
      .then(async (data: any) => {
        const items = data.items;
        if (items.length) {
          return demandware.removeCartItem(items[0].itemId);
        } else {
          return Promise.reject('nothing in the cart');
        }
      })
      .then((data: any) => {
        this.showData(data);
      })
      .catch((err: any) => {
        showError(err);
      });
  }

  updateCartItemQty = (qty: number) => () => {
    demandware
      .fetchCart()
      .then(async (data: any) => {
        const items = data.items;
        if (items.length) {
          return demandware.updateCartItemQty(items[0].itemId, qty);
        } else {
          return Promise.reject('nothing in the cart');
        }
      })
      .then((data: any) => {
        this.showData(data);
      })
      .catch((err: any) => {
        showError(err);
      });
  }

  applyPromo = () => {
    demandware
      .applyPromo('SAVEMORE')
      .then((data: any) => {
        this.showData(data);
      })
      .catch((err: any) => {
        showError(err);
      });
  }

  removePromo = () => {
    demandware
      .fetchCart()
      .then(async (data: any) => {
        const promos = data.promos;
        if (promos.length) {
          return demandware.removePromo(promos[0].id);
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

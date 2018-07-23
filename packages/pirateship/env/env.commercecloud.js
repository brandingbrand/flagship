const common = require('./common');

module.exports = {
  ...common,
  dataSource: {
    type: 'commercecloud',
      categoryFormat: 'list',
      apiConfig: {
        clientId: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        endpoint: 'https://demo-ocapi.demandware.net/s/SiteGenesis/dw/shop/v18_6',
        storeCurrencyCode: 'USD',
        networkClient: {
          baseURL: 'https://demo-ocapi.demandware.net/s/SiteGenesis/dw/shop/v18_6',
          headers: {
            origin: 'https://demo-ocapi.demandware.net/s/SiteGenesis/dw/shop/v18_6',
            'x-dw-client-id': 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
          }
        }
      },
      promoProducts: {
        categoryId: 'newarrivals',
        title: 'New Arrivals'
      }
  }
};

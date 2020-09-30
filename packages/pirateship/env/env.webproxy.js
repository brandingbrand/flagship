const common = require('./common');

module.exports = {
  ...common,
  dataSource: {
    type: 'commercecloud',
    categoryFormat: 'list',
    enableProxy: true,
    apiConfig: {
      clientId: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      endpoint: 'http://demo-ocapi.demandware.net/s/SiteGenesis/dw/shop/v18_6',
      storeCurrencyCode: 'USD',
      networkClient: {
        baseURL: 'https://localhost:3000/s/SiteGenesis/dw/shop/v18_6',
        headers: {
          origin: 'https://demo-ocapi.demandware.net/s/SiteGenesis/dw/shop/v18_6',
          'x-dw-client-id': 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        }
      },
      corsOptions: {
        origin: 'localhost:8080'
      },
      silent: true
    },
    promoProducts: {
      categoryId: 'newarrivals',
      title: 'New Arrivals'
    }
  }
};

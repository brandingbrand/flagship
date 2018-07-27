const common = require('./common');

module.exports = {
  ...common,
  dataSource: {
    type: 'shopify',
    categoryFormat: 'list',
    apiConfig: {
      domain: 'https://flagshipdemo.myshopify.com/api/graphql',
      storefrontAccessToken: '76f12786038b796aef137d56950644e7',
      googlePayPublicKey: '',
      storeCurrencyCode: 'USD'
    },
    promoProducts: {
      categoryId: 'Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzc4ODEwMDU0Nzc0',
      title: 'Featured Products'
    }
  }
};

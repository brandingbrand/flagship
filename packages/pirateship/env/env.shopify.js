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
    }
  }
};

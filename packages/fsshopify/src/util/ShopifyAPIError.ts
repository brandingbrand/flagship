export default class ShopifyAPIError extends Error {
  data: Object;

  constructor(msg: string, data?: Object) {
    super(msg);
    this.data = data || false;
  }
}

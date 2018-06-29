export interface CheckoutDataType {
  shippingAddress?: string;
  payment?: string;
  orderId?: string;
}
const DELAY_TIME = 300;
const delay = async (time: number) => new Promise<void>(resolve => setTimeout(resolve, time));

export const datasource = {
  data: {},
  startCheckout: async () => delay(DELAY_TIME).then(() => datasource.data),
  guestCheckout: async () => delay(DELAY_TIME).then(() => datasource.data),
  addShipping: async (address: string) => {
    datasource.data = { ...datasource.data, shippingAddress: address };
    return delay(DELAY_TIME).then(() => datasource.data);
  },
  addPayment: async (payment: string) => {
    datasource.data = { ...datasource.data, payment };
    return delay(DELAY_TIME).then(() => datasource.data);
  },
  placeOrder: async () => {
    datasource.data = { ...datasource.data, orderId: '123' };
    return delay(DELAY_TIME).then(() => datasource.data);
  }
};

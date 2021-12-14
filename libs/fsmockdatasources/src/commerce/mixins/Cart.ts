import { CartDataSource, CommerceTypes } from '@brandingbrand/fscommerce';
import {
  Cart,
  Constructor,
  DefaultShippingMethod,
  PaymentMethods,
  Products,
  Promos,
  ShippingMethods
} from '../../helpers';

export const CartMixin = <T extends Constructor>(superclass: T) => {
  return class CartMixin extends superclass implements CartDataSource {
    public cart: Cart;
    public orders: Map<string, CommerceTypes.Order> = new Map();

    constructor(...args: any[]) {
      super(...args);
      this.cart = new Cart();
    }

    async addToCart(
      productId: string,
      qty?: number,
      product?: CommerceTypes.Product
    ): Promise<CommerceTypes.Cart> {
      const invalidProductId = !Products.find(product => product.id === productId);
      if (invalidProductId) {
        throw new Error(`${productId} is not a valid product`);
      }

      qty = qty || 1;
      const existingCount = this.cart.itemStore.get(productId) || 0;
      this.cart.itemStore.set(productId, existingCount + qty);

      return this.cart.serialize();
    }

    async addPayment(cartId: string, payment: CommerceTypes.Payment): Promise<CommerceTypes.Cart> {
      this.cart.payment = payment;
      return this.cart.serialize();
    }

    async fetchCart(query?: CommerceTypes.CartQuery): Promise<CommerceTypes.Cart> {
      return this.cart.serialize();
    }

    async destroyCart(): Promise<void> {
      this.cart = new Cart();

      return;
    }

    async fetchPaymentMethods(cartId: string): Promise<CommerceTypes.ApplicablePayment[]> {
      return PaymentMethods;
    }

    async fetchShippingMethods(
      cartId: string,
      shipmentId: string
    ): Promise<CommerceTypes.ShippingMethodResponse> {
      return {
        defaultMethodId: DefaultShippingMethod.id,
        shippingMethods: ShippingMethods
      };
    }

    async removeCartItem(itemId: string): Promise<CommerceTypes.Cart> {
      this.cart.itemStore.delete(itemId);
      return this.cart.serialize();
    }

    async setBillingAddress(
      options: CommerceTypes.BillingAddressOptions
    ): Promise<CommerceTypes.Cart> {
      if (options.address === undefined) {
        throw new Error('Address is required');
      }

      this.cart.billingAddress = options.address;

      if (options.useAsShipping) {
        if (this.cart.shipment !== undefined) {
          this.cart.shipment.address = options.address;
        } else {
          this.cart.shipment = {
            id: 'me',
            address: options.address,
            shippingMethod: DefaultShippingMethod,
            gift: false
          };
        }
      }

      return this.cart.serialize();
    }

    async setCustomerInfo(options: CommerceTypes.CustomerInfoOptions): Promise<CommerceTypes.Cart> {
      const { email } = options;

      this.cart.customerInfo = {
        firstName: 'test',
        lastName: 'test',
        email,
        login: email
      };

      return this.cart.serialize();
    }

    async setShipmentAddress(
      options: CommerceTypes.ShipmentAddressOptions
    ): Promise<CommerceTypes.Cart> {
      if (options.address === undefined) {
        throw new Error('Address is required');
      }

      this.cart.shipment = {
        id: options.shipmentId,
        address: options.address,
        shippingMethod: this.cart.shipment ?
          this.cart.shipment.shippingMethod :
          DefaultShippingMethod,
        gift: false
      };

      if (options.useAsBilling) {
        this.cart.billingAddress = options.address;
      }

      return this.cart.serialize();
    }

    async setShipmentMethod(
      options: CommerceTypes.ShipmentMethodOptions
    ): Promise<CommerceTypes.Cart> {
      if (!this.cart.shipment) {
        throw new Error('You must set a shipping address before setting a shipping method');
      }

      const newShippingMethod = ShippingMethods.find(({id}) => id === options.methodId);
      if (newShippingMethod === undefined) {
        throw new Error('Invalid shipping method id');
      }

      this.cart.shipment.shippingMethod = newShippingMethod;
      return this.cart.serialize();
    }

    async submitOrder(cartId: string): Promise<CommerceTypes.Order> {
      const orderId = Date.now().toString();

      const isValid = this.cart.validate();
      if (!isValid) {
        const errors = this.cart.getValidationErrors();
        throw new Error(`Unable to submit order.\n${errors.join('\n')}`);
      }

      const {
        billingAddress,
        customerInfo,
        tax,
        total,
        payments,
        items,
        shipments
      } = this.cart.serialize();

      const customerName = customerInfo !== undefined ?
        `${customerInfo.firstName} ${customerInfo.lastName}` :
        '';

      const order: CommerceTypes.Order = {
        billingAddress,
        creationDate: new Date(),
        customerInfo,
        customerName,
        orderId,
        orderTax: tax,
        orderTotal: total,
        payments: payments as CommerceTypes.Payment[],
        paymentStatus: 'PAID',
        productItems: items.map(item => ({
          ...item,
          gift: false
        })),
        shipments,
        status: 'SHIPPED'
      };

      this.orders.set(orderId, order);
      await this.destroyCart();

      return order;
    }

    async updateOrder(order: CommerceTypes.Order): Promise<CommerceTypes.Order> {
      const oldOrder = this.orders.get(order.orderId);
      const updatedOrder = {
        ...oldOrder,
        ...order
      };

      this.orders.set(order.orderId, updatedOrder);
      return updatedOrder;
    }

    async updateOrderPayment(
      orderId: string,
      paymentId: string,
      payment: CommerceTypes.Payment
    ): Promise<CommerceTypes.Order> {
      const order = this.orders.get(orderId);

      if (!order) {
        throw new Error('Order ID not found');
      }

      return this.updateOrder({
        ...order,
        payments: [payment]
      });
    }

    async updateCartItemQty(itemId: string, qty: number): Promise<CommerceTypes.Cart> {
      if (qty === 0) {
        return this.removeCartItem(itemId);
      }

      this.cart.itemStore.set(itemId, qty);
      return this.cart.serialize();
    }

    async updatePayment(
      cartId: string,
      paymentId: string,
      payment: CommerceTypes.Payment
    ): Promise<CommerceTypes.Cart> {
      const total = this.cart.getTotal();

      this.cart.payment = {
        ...payment,
        amount: total
      };

      return this.cart.serialize();
    }

    async updateGiftOptions(giftOptions: CommerceTypes.GiftOptions): Promise<CommerceTypes.Cart> {
      throw new Error('Gifts are not supported');
    }

    async applyPromo(promoCode: string): Promise<CommerceTypes.Cart> {
      this.cart.promos = this.cart.promos || [];

      const promo = Promos.find(promo => promo.code === promoCode);
      if (!promo || !promo.valid) {
        throw new Error('Invalid promo code');
      }

      const existingPromo = this.cart.promos.find(promo => promo.code === promoCode);
      if (existingPromo) {
        throw new Error('Promo already applied');
      }

      this.cart.promos.push(promo);
      return this.cart.serialize();
    }

    async removePromo(promoItemId: string): Promise<CommerceTypes.Cart> {
      if (Array.isArray(this.cart.promos)) {
        this.cart.promos = this.cart.promos.filter(promo => promo.id !== promoItemId);
      }

      return this.cart.serialize();
    }
  };
};

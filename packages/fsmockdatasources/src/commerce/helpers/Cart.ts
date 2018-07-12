import { CommerceTypes } from '@brandingbrand/fscommerce';
import { DefaultCurrencyCode } from './Misc';
import { Products } from './Products';
import Decimal from 'decimal.js';

export class Cart {
  public id: string = 'my-cart';
  public billingAddress?: CommerceTypes.Address;
  public customerInfo?: CommerceTypes.CustomerAccount;
  public payment?: CommerceTypes.Payment;
  public promos?: CommerceTypes.Promo[];
  public shipment?: CommerceTypes.Shipment;
  public itemStore: Map<string, number> = new Map();

  public serialize(): CommerceTypes.Cart {
    const items = this.getItems();
    const subtotal = this.getSubtotal();
    const shipping = this.getShipping();
    const tax = this.getTax();
    const total = this.getTotal();

    return {
      items,
      billingAddress: this.billingAddress,
      customerInfo: this.customerInfo,
      id: this.id,
      payments: this.payment ? [this.payment] : undefined,
      promos: this.promos,
      shipments: this.shipment ? [this.shipment] : undefined,
      subtotal,
      total,
      shipping,
      tax
    };
  }

  public validate(): boolean {
    const hasItems = this.getItems().length > 0;
    const hasRequiredFields = [
      this.getTotal(),
      this.billingAddress,
      this.payment,
      this.shipment
    ].every(val => val !== undefined);

    return hasItems && hasRequiredFields;
  }

  public getValidationErrors(): string[] {
    const errors = [];

    if (this.getItems().length > 0) {
      errors.push('You must add something to cart');
    }

    if (this.getTotal() === undefined) {
      errors.push('Unable to calculate total');
    }

    if (this.billingAddress === undefined) {
      errors.push('You must specify a billing address');
    }

    if (this.payment === undefined) {
      errors.push('You must specify a payment method');
    }

    if (this.shipment === undefined) {
      errors.push('You must specify a shipping method and address');
    }

    return errors;
  }

  public getItems(): CommerceTypes.CartItem[] {
    return [...this.itemStore.entries()]
      .map(([sku, qty]): CommerceTypes.CartItem | undefined => {
        const product = Products.find(product => product.id === sku);
        if (product === undefined) {
          return;
        }

        return {
          title: product.title,
          handle: product.handle || '',
          brand: product.brand,
          description: product.description,
          images: product.images,
          price: product.price,
          originalPrice: product.originalPrice,
          available: product.available,
          options: product.options,
          variants: product.variants,
          review: product.review,
          inventory: product.inventory,
          itemId: product.id,
          productId: product.id,
          quantity: qty,
          totalPrice: product.price === undefined ? undefined : {
            currencyCode: product.price.currencyCode,
            value: new Decimal(product.price.value.times(qty))
          }
        };
      })
      .filter((item): item is CommerceTypes.CartItem => item !== undefined);
  }

  public getSubtotal() : CommerceTypes.CurrencyValue | undefined {
    const items = this.getItems();
    if (!Array.isArray(items) || items.length === 0) {
      return;
    }

    return this.calculateSubtotal(items);
  }

  public getShipping(): CommerceTypes.CurrencyValue | undefined {
    if (!this.shipment) {
      return;
    }

    const shippingMethod = this.shipment.shippingMethod;
    return this.calculateShipping(shippingMethod);
  }

  public getTax(): CommerceTypes.CurrencyValue | undefined {
    const subtotal = this.getSubtotal();
    const promos = this.getPromoTotal();

    if (!subtotal) {
      return;
    }

    return this.calculateTax(subtotal, promos);
  }

  public getPromoTotal(): CommerceTypes.CurrencyValue | undefined {
    const promos = (this.promos || []).filter(promo => promo.value);
    if (promos.length === 0) {
      return;
    }

    return this.calculatePromos(promos);
  }

  public getTotal(): CommerceTypes.CurrencyValue | undefined {
    const subtotal = this.getSubtotal();
    const shipping = this.getShipping();
    const tax = this.getTax();
    const promos = this.getPromoTotal();

    if (!subtotal || !shipping || !tax) {
      return;
    }

    return this.calculateTotal(subtotal, tax, shipping, promos);
  }

  protected calculateSubtotal(items: CommerceTypes.CartItem[]): CommerceTypes.CurrencyValue {
    const subtotal = {
      currencyCode: DefaultCurrencyCode,
      value: new Decimal(0)
    };

    return items.reduce((subtotal, item) => {
      if (item.totalPrice) {
        subtotal.currencyCode = item.totalPrice.currencyCode;
        subtotal.value = subtotal.value.add(item.totalPrice.value);
      }

      return subtotal;
    }, subtotal);
  }

  protected calculateShipping(method: CommerceTypes.ShippingMethod): CommerceTypes.CurrencyValue {
    if (!method || !method.price) {
      return {
        currencyCode: DefaultCurrencyCode,
        value: new Decimal(0)
      };
    }

    return method.price;
  }

  protected calculateTax(
    subtotal: CommerceTypes.CurrencyValue,
    promosTotal?: CommerceTypes.CurrencyValue
  ): CommerceTypes.CurrencyValue {
    const discounts = promosTotal ? promosTotal.value : new Decimal(0);

    return {
      currencyCode: subtotal.currencyCode,
      value: subtotal.value.minus(discounts).times(0.07)
    };
  }

  protected calculatePromos(promos: CommerceTypes.Promo[]): CommerceTypes.CurrencyValue {
    const promoTotal = promos.reduce(
      (total, promo) => promo.value ? total.add(promo.value.value) : total,
      new Decimal(0)
    );

    return {
      currencyCode: DefaultCurrencyCode,
      value: promoTotal
    };
  }

  protected calculateTotal(
    subtotal: CommerceTypes.CurrencyValue,
    tax: CommerceTypes.CurrencyValue,
    shipping: CommerceTypes.CurrencyValue,
    promos?: CommerceTypes.CurrencyValue
  ): CommerceTypes.CurrencyValue {
    const discounts = promos ? promos.value : new Decimal(0);

    const totalValue = subtotal.value
      .add(tax.value)
      .add(shipping.value)
      .minus(discounts);

    return {
      currencyCode: subtotal.currencyCode,
      value: totalValue.lessThan(0) ? new Decimal(0) : totalValue
    };
  }
}

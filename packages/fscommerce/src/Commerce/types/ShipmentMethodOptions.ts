/**
 * Interface to prescribe the requred parameters to add a shipping method to a shipment.
 */
export interface ShipmentMethodOptions {
  /**
   * An identifier corresponding to the cart in which the shipment is contained.
   *
   * @example 'bcs5vaOjgEQ9Uaaadk9zQIrXE6'
   */
  cartId: string;

  /**
   * An identifier corresponding to the shipping method which is to be applied to the shipment.
   *
   * @example 'bcs5vaOjgEQ9Uaaadk9zQIrXE6'
   */
  methodId: string;

  /**
   * An identifier corresponding to the shipment which is to receive the specified method.
   *
   * @example 'bcs5vaOjgEQ9Uaaadk9zQIrXE6'
   */
  shipmentId: string;
}

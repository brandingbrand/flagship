import {
  CommerceTypes as FSCommerceTypes
} from '@brandingbrand/fscommerce';
import * as ResponseTypes from '../util/ShopifyResponseTypes';
import { makeCurrency } from './helpers';

import ShopifyAPIError from '../util/ShopifyAPIError';

export function product(
  product: ResponseTypes.ShopifyProduct,
  currency: string
): FSCommerceTypes.Product {
  if (!product) {
    throw new ShopifyAPIError('No product');
  }

  const selectedVariant = product.variants && product.variants.edges &&
    product.variants.edges.length && product.variants.edges[0].node;
  if (!selectedVariant) {
    throw new ShopifyAPIError('No product variant information');
  }

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    brand: product.vendor,
    description: product.description,
    images: product.images.edges && product.images.edges.map(imageFromContainer),
    price: makeCurrency(selectedVariant.price, currency),
    originalPrice: makeCurrency(selectedVariant.compareAtPrice, currency),
    options: getOptions(product.options, product.variants),
    variants: product.variants &&
              product.variants.edges &&
              product.variants.edges.map(variantData => variant(variantData, currency)),
    available: selectedVariant.available
  };
}

function imageFromContainer(
  shopifyImage: ResponseTypes.ShopifyProductImageContainerEdge
): FSCommerceTypes.Image {
  return imageFromNode(shopifyImage.node || {});
}

function imageFromNode(
  imageNode: ResponseTypes.ShopifyImage
): FSCommerceTypes.Image {
  return {
    uri: imageNode.src,
    width: imageNode.width,
    height: imageNode.height
  };
}

function findAvailableVariant(
  variants: ResponseTypes.ShopifyProductVariantContainer,
  value: string
): boolean {
  const matchingVariant = variants && variants.edges.find(variant => {
    return variant.node && variant.node.title === value;
  });

  return !!matchingVariant
    && matchingVariant.node
    && matchingVariant.node.available;
}

function getOptions(
  options: ResponseTypes.ShopifyOption[],
  variants: ResponseTypes.ShopifyProductVariantContainer
): FSCommerceTypes.Option[] {
  return options && options.map(option => {
    return {
      id: option.name,
      name: option.name,
      values: (option.values || []).map(v => ({
        name: v,
        value: v,
        available: findAvailableVariant(variants, v)
      }))
    };
  });
}

function variant(
  shopifyVariant: ResponseTypes.ShopifyProductVariantContainerEdge,
  currency: string
): FSCommerceTypes.Variant {
  const variantNode = shopifyVariant.node;

  return {
    id: variantNode.id,
    title: variantNode.title,
    price: makeCurrency(variantNode.price, currency),
    originalPrice: makeCurrency(variantNode.compareAtPrice, currency),
    images: variantNode.image ? [imageFromNode(variantNode.image)] : undefined,
    optionValues: variantNode.selectedOptions.map(v => ({
      name: v.name,
      value: v.value || ''
    }))
  };
}

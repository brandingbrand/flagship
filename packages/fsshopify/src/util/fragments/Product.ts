import {Variant} from './Variant';

export const Product = `
  id
  createdAt
  updatedAt
  descriptionHtml
  description
  handle
  productType
  title
  vendor
  tags
  publishedAt
  onlineStoreUrl
  options {
    name
    values
  }
  images(first: 250) {
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    edges {
      cursor
      node {
        id
        src
        altText
      }
    }
  }
  variants(first: 250) {
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    edges {
      cursor
      node {
        ${Variant}
      }
    }
  }
`;

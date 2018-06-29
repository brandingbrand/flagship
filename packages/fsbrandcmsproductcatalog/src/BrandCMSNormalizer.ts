/**
 * this module is for normalizing Brand CMS data to standardized data
 */
import {
  CommerceTypes as FSCommerceTypes
} from '@brandingbrand/fscommerce';

function image(cmsRetinaImage: any): FSCommerceTypes.Image | undefined {
  if (!cmsRetinaImage.path) {
    return undefined;
  }

  return {
    uri: cmsRetinaImage.path,
    width: cmsRetinaImage.width,
    height: cmsRetinaImage.height
  };
}

function category(cmsCategoryItem: any): FSCommerceTypes.Category {
  return {
    id: cmsCategoryItem.Identifier,
    title: cmsCategoryItem.Title,
    handle: cmsCategoryItem.Identifier,
    pageDescription: cmsCategoryItem.Description,
    dataSourceType: cmsCategoryItem.DataSourceType,
    image: image(cmsCategoryItem['Retina-Image'])
  };
}

export default {
  category,
  image
};

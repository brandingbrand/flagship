// tslint:disable:ter-max-len max-line-length

export const Categories: import ('@brandingbrand/fscommerce').CommerceTypes.Category = {
  id: 'root',
  title: 'Storefront Catalog - EN',
  handle: 'root',
  categories: [{
    id: 'mens-accessories',
    title: 'Accessories',
    handle: 'mens-accessories',
    pageTitle: "Men's Accessories Belts, Wallets. Gloves, Hats, Watches, Luggage & More",
    pageDescription: 'Shop mens accessories including belts, wallets. gloves, hats, watches, luggage & more at Salesforce Commerce Cloud.',
    parentId: 'root'
  }, {
    id: 'electronics-digital-cameras',
    title: 'Digital Cameras',
    handle: 'electronics-digital-cameras',
    pageTitle: 'Digital Cameras',
    pageDescription: 'Shop the latest digital cameras from all the top brands, makes and models at Salesforce Commerce Cloud.',
    parentId: 'root'
  }]
};

export const CategoryProduct: import ('@brandingbrand/fsfoundation').Dictionary<string[]> = {
  'mens-accessories': [
    'P0150',
    '25752986',
    'M1355',
    'TG250',
    'TG508',
    'TG720',
    '25752218',
    'TG786',
    '25752235',
    '25752981',
    'TG733'
  ],
  'electronics-digital-cameras': [
    'sony-alpha350-wlen',
    'nikon-p6000',
    'nikon-sl16',
    'sony-cybershot-dsc-h50',
    'canon-powershot-sd990-is',
    'nikon-s60',
    'nikon-f700-body',
    'canon-eos-50d-body',
    'canon-powershot-a580',
    'canon-powershot-g10',
    'kodak-z712',
    'sony-cybershot-t77',
    'sony-cybershot-w120',
    'canon-powershot-sd1100-is',
    'kodak-z8612',
    'canon-powershot-s5-is',
    'canon-eos-5d-mark2-body',
    'canon-powershot-e1',
    'kodak-v1273',
    'S2510211',
    'nikon-d60-wlens',
    'sony-alpha900-body',
    'kodak-z1015',
    'kodak-c1013'
  ]
};

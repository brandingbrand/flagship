// tslint:disable:ter-max-len max-line-length

export const Categories: import ('@brandingbrand/fscommerce').CommerceTypes.Category = {
  id: 'root',
  title: 'Storefront Catalog - EN',
  handle: 'root',
  categories: [{
    id: 'mens',
    title: 'Men\'s',
    handle: 'mens',
    pageTitle: 'Men\'s Footwear, Outerwear, Clothing & Accessories',
    pageDescription: 'Men\'s range. Hard-wearing boots, jackets and clothing for unbeatable comfort day in, day out. Practical, easy-to-wear styles wherever you\'re headed.',
    parentId: 'root',
    image: {
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-storefront-catalog-en/default/dwd488d6b4/images/slot/landing/cat-landing-slotbottom-mens-dressshirts.jpg'
    },
    categories: [{
      id: 'mens-accessories',
      title: 'Accessories',
      handle: 'mens-accessories',
      pageTitle: "Men's Accessories Belts, Wallets. Gloves, Hats, Watches, Luggage & More",
      pageDescription: 'Shop mens accessories including belts, wallets. gloves, hats, watches, luggage & more at Salesforce Commerce Cloud.',
      parentId: 'mens',
      image: {
        uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-storefront-catalog-en/default/dwc38f1ace/images/slot/landing/cat-landing-slotbottom-mens-accessories.jpg'
      }
    }]
  }, {
    id: 'electronics',
    title: 'Electronics',
    handle: 'electronics',
    pageTitle: 'Shop Electronics Including Televisions, Digital Cameras, iPods & More',
    pageDescription: 'Shop Electronics including the latest in televisions, digital cameras, camcorders, mp3, ipod, mobil phones, GPS & gaming at Salesforce Commerce Cloud',
    parentId: 'root',
    image: {
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-storefront-catalog-en/default/dwa0034e19/images/slot/landing/cat-landing-slotbottom-electronics.jpg'
    },
    categories: [{
      id: 'electronics-digital-cameras',
      title: 'Digital Cameras',
      handle: 'electronics-digital-cameras',
      pageTitle: 'Digital Cameras',
      pageDescription: 'Shop the latest digital cameras from all the top brands, makes and models at Salesforce Commerce Cloud.',
      parentId: 'electronics',
      image: {
        uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-storefront-catalog-en/default/dw1a543dc7/images/slot/landing/cat-landing-camera.jpg'
      }
    }]
  }]
};

const mensProducts = [
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
  'TG733',
  '793775370033',
  '793775362380',
  '842204063326',
  '842204063333',
  '061492858852',
  '061492858869',
  '061492858876',
  '061492858906',
  '061492858913',
  '061492858920',
  '061492183572',
  '061492183589',
  '061492183596',
  '061492215594',
  '061492215617',
  '061492215624',
  '029407331289',
  '029407331227',
  '029407331258',
  '061492273693',
  '061492273709',
  '061492273716',
  '682875090845',
  '682875719029',
  '682875540326',
  '793775064963',
  '061492216683',
  '061492216706',
  '061492216690'
];

const electronicsProducts = [
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
];

export const CategoryProduct: import ('@brandingbrand/fsfoundation').Dictionary<string[]> = {
  electronics: electronicsProducts,
  'electronics-digital-cameras': electronicsProducts,
  mens: mensProducts,
  'mens-accessories': mensProducts
};

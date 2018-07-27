// tslint:disable:ter-max-len max-line-length
import Decimal from 'decimal.js';
import { DefaultCurrencyCode } from './Misc';

export const Products: import ('@brandingbrand/fscommerce').CommerceTypes.Product[] = [
  {
    id: 'P0150',
    title: 'Upright Case (33L - 3.7Kg)',
    handle: 'P0150',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw0886c941/images/large/P0150_001.jpg',
      alt: 'Upright Case (33L - 3.7Kg), , large'
    }],
    price: {
      value: new Decimal('99.99'),
      currencyCode: DefaultCurrencyCode
    },
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 2
    }
  }, {
    id: '25752986',
    title: 'Striped Silk Tie',
    handle: '25752986',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw09f18f3d/images/large/PG.949114314S.REDSI.PZ.jpg',
      alt: 'Striped Silk Tie, , large'
    }, {
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw2dc737ab/images/large/PG.949114314S.REDSI.BZ.jpg',
      alt: 'Striped Silk Tie, , large'
    }],
    price: {
      value: new Decimal('29.99'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Red',
        value: 'REDSI',
        available: true
      }, {
        name: 'Turquoise',
        value: 'TURQUSI',
        available: true
      }]
    }],
    variants: [{
      id: '793775370033',
      price: {
        value: new Decimal('29.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'TURQUSI'
      }]
    }, {
      id: '793775362380',
      price: {
        value: new Decimal('29.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'REDSI'
      }]
    }],
    available: true,
    promotions: ['PromotionTest_WithoutQualifying'],
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: 'M1355',
    title: "Men's Leather Luggage Fisherman Bag",
    handle: 'M1355',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw940383d7/images/large/M1355_214.jpg',
      alt: "Men's Leather Luggage Fisherman Bag, , large"
    }],
    price: {
      value: new Decimal('162'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Black',
        value: '0001M1355001',
        available: true
      }, {
        name: 'Brown',
        value: '0002M1355214',
        available: true
      }]
    }, {
      id: 'accessorySize',
      name: 'Size',
      values: [{
        name: 'ALL',
        value: '010',
        available: true
      }]
    }],
    variants: [{
      id: '842204063326',
      price: {
        value: new Decimal('162'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001M1355001'
      }, {
        name: 'accessorySize',
        value: '010'
      }]
    }, {
      id: '842204063333',
      price: {
        value: new Decimal('162'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0002M1355214'
      }, {
        name: 'accessorySize',
        value: '010'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: 'TG250',
    title: "Men's Oxford Gloves",
    handle: 'TG250',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dwd5d6d418/images/large/TG250_206.jpg',
      alt: "Men's Oxford Gloves, , large"
    }],
    price: {
      value: new Decimal('99.99'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Black',
        value: '0001TG250001',
        available: true
      }, {
        name: 'Brandy',
        value: '0002TG250206',
        available: true
      }]
    }, {
      id: 'accessorySize',
      name: 'Size',
      values: [{
        name: 'M',
        value: '050',
        available: true
      }, {
        name: 'L',
        value: '060',
        available: true
      }, {
        name: 'XL',
        value: '080',
        available: true
      }]
    }],
    variants: [{
      id: '061492858852',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG250001'
      }, {
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492858869',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG250001'
      }, {
        name: 'accessorySize',
        value: '060'
      }]
    }, {
      id: '061492858876',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG250001'
      }, {
        name: 'accessorySize',
        value: '080'
      }]
    }, {
      id: '061492858906',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0002TG250206'
      }, {
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492858913',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0002TG250206'
      }, {
        name: 'accessorySize',
        value: '060'
      }]
    }, {
      id: '061492858920',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0002TG250206'
      }, {
        name: 'accessorySize',
        value: '080'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 0
    }
  }, {
    id: 'TG508',
    title: "Men's Classic Deer Gloves",
    handle: 'TG508',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw93da4621/images/large/TG508_206.jpg',
      alt: "Men's Classic Deer Gloves, , large"
    }],
    price: {
      value: new Decimal('99.99'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'accessorySize',
      name: 'Size',
      values: [{
        name: 'M',
        value: '050',
        available: true
      }, {
        name: 'L',
        value: '060',
        available: true
      }, {
        name: 'XL',
        value: '080',
        available: true
      }]
    }],
    variants: [{
      id: '061492183572',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492183589',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'accessorySize',
        value: '060'
      }]
    }, {
      id: '061492183596',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'accessorySize',
        value: '080'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: 'TG720',
    title: 'Unisex Boot II Gloves',
    handle: 'TG720',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw7aff72a2/images/large/TG720_754.jpg',
      alt: 'Unisex Boot II Gloves, , large'
    }],
    price: {
      value: new Decimal('95'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Wheat Nubuck',
        value: '0001TG720754',
        available: true
      }]
    }, {
      id: 'accessorySize',
      name: 'Size',
      values: [{
        name: 'M',
        value: '050',
        available: true
      }, {
        name: 'L',
        value: '060',
        available: true
      }, {
        name: 'XL',
        value: '080',
        available: true
      }]
    }],
    variants: [{
      id: '061492215594',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG720754'
      }, {
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492215617',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG720754'
      }, {
        name: 'accessorySize',
        value: '060'
      }]
    }, {
      id: '061492215624',
      price: {
        value: new Decimal('95'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG720754'
      }, {
        name: 'accessorySize',
        value: '080'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: '25752218',
    title: 'Solid Silk Tie',
    handle: '25752218',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dwa003e1ec/images/large/PG.949432114S.NAVYSI.PZ.jpg',
      alt: 'Solid Silk Tie, , large'
    }, {
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw209d58ec/images/large/PG.949432114S.NAVYSI.BZ.jpg',
      alt: 'Solid Silk Tie, , large'
    }],
    price: {
      value: new Decimal('21.59'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Navy',
        value: 'NAVYSI',
        available: true
      }, {
        name: 'Red',
        value: 'REDSI',
        available: true
      }, {
        name: 'Yellow',
        value: 'YELLOSI',
        available: true
      }]
    }],
    variants: [{
      id: '029407331289',
      price: {
        value: new Decimal('21.59'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'YELLOSI'
      }]
    }, {
      id: '029407331227',
      price: {
        value: new Decimal('21.59'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'NAVYSI'
      }]
    }, {
      id: '029407331258',
      price: {
        value: new Decimal('21.59'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'REDSI'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: 'TG786',
    title: "Men's Yarmouth Gloves",
    handle: 'TG786',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dwf0ffc141/images/large/TG786_214.jpg',
      alt: "Men's Yarmouth Gloves, , large"
    }],
    price: {
      value: new Decimal('86'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Brown',
        value: '0001TG786214',
        available: true
      }]
    }, {
      id: 'accessorySize',
      name: 'Size',
      values: [{
        name: 'M',
        value: '050',
        available: true
      }, {
        name: 'L',
        value: '060',
        available: true
      }, {
        name: 'XL',
        value: '080',
        available: true
      }]
    }],
    variants: [{
      id: '061492273693',
      price: {
        value: new Decimal('86'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG786214'
      }, {
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492273709',
      price: {
        value: new Decimal('86'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG786214'
      }, {
        name: 'accessorySize',
        value: '060'
      }]
    }, {
      id: '061492273716',
      price: {
        value: new Decimal('86'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG786214'
      }, {
        name: 'accessorySize',
        value: '080'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: '25752235',
    title: 'Checked Silk Tie',
    handle: '25752235',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dwe495e4e1/images/large/PG.949612424S.COBATSI.PZ.jpg',
      alt: 'Checked Silk Tie, , large'
    }, {
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dwc8be6d8b/images/large/PG.949612424S.COBATSI.BZ.jpg',
      alt: 'Checked Silk Tie, , large'
    }],
    price: {
      value: new Decimal('21.59'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Cobalt',
        value: 'COBATSI',
        available: true
      }, {
        name: 'Navy',
        value: 'NAVYSI',
        available: true
      }, {
        name: 'Yellow',
        value: 'YELLOSI',
        available: true
      }]
    }],
    variants: [{
      id: '682875090845',
      price: {
        value: new Decimal('21.59'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'COBATSI'
      }]
    }, {
      id: '682875719029',
      price: {
        value: new Decimal('21.59'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'NAVYSI'
      }]
    }, {
      id: '682875540326',
      price: {
        value: new Decimal('21.59'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'YELLOSI'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: '25752981',
    title: 'Striped Silk Tie',
    handle: '25752981',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw81a381dd/images/large/PG.949034314S.TAUPESI.PZ.jpg',
      alt: 'Striped Silk Tie, , large'
    }, {
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw89c8970f/images/large/PG.949034314S.TAUPESI.BZ.jpg',
      alt: 'Striped Silk Tie, , large'
    }],
    price: {
      value: new Decimal('21.59'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Taupe',
        value: 'TAUPESI',
        available: true
      }]
    }],
    variants: [{
      id: '793775064963',
      price: {
        value: new Decimal('21.59'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'TAUPESI'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: 'TG733',
    title: "Men's Resolve Gloves",
    handle: 'TG733',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw005af1fa/images/large/TG733_243.jpg',
      alt: "Men's Resolve Gloves, , large"
    }],
    price: {
      value: new Decimal('72'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'accessorySize',
      name: 'Size',
      values: [{
        name: 'M',
        value: '050',
        available: true
      }, {
        name: 'L',
        value: '060',
        available: true
      }, {
        name: 'XL',
        value: '080',
        available: true
      }]
    }],
    variants: [{
      id: '061492216683',
      price: {
        value: new Decimal('72'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492216706',
      price: {
        value: new Decimal('72'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'accessorySize',
        value: '080'
      }]
    }, {
      id: '061492216690',
      price: {
        value: new Decimal('72'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'accessorySize',
        value: '060'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: '793775370033',
    title: 'Striped Silk Tie',
    handle: '793775370033',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw0795cc84/images/large/PG.949114314S.TURQUSI.PZ.jpg',
      alt: 'Striped Silk Tie, Turquoise, large'
    }, {
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dwee2ea977/images/large/PG.949114314S.TURQUSI.BZ.jpg',
      alt: 'Striped Silk Tie, Turquoise, large'
    }],
    price: {
      value: new Decimal('29.99'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Red',
        value: 'REDSI',
        available: true
      }, {
        name: 'Turquoise',
        value: 'TURQUSI',
        available: true
      }]
    }],
    variants: [{
      id: '793775370033',
      price: {
        value: new Decimal('29.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'TURQUSI'
      }]
    }, {
      id: '793775362380',
      price: {
        value: new Decimal('29.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'REDSI'
      }]
    }],
    available: true,
    promotions: ['PromotionTest_WithoutQualifying'],
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: '793775362380',
    title: 'Striped Silk Tie',
    handle: '793775362380',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw09f18f3d/images/large/PG.949114314S.REDSI.PZ.jpg',
      alt: 'Striped Silk Tie, Red, large'
    }, {
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw2dc737ab/images/large/PG.949114314S.REDSI.BZ.jpg',
      alt: 'Striped Silk Tie, Red, large'
    }],
    price: {
      value: new Decimal('29.99'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Red',
        value: 'REDSI',
        available: true
      }, {
        name: 'Turquoise',
        value: 'TURQUSI',
        available: true
      }]
    }],
    variants: [{
      id: '793775370033',
      price: {
        value: new Decimal('29.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'TURQUSI'
      }]
    }, {
      id: '793775362380',
      price: {
        value: new Decimal('29.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'REDSI'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: '842204063326',
    title: "Men's Leather Luggage Fisherman Bag",
    handle: '842204063326',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw853f545e/images/large/M1355_001.jpg',
      alt: "Men's Leather Luggage Fisherman Bag, Black, large"
    }],
    price: {
      value: new Decimal('162'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Black',
        value: '0001M1355001',
        available: true
      }, {
        name: 'Brown',
        value: '0002M1355214',
        available: true
      }]
    }, {
      id: 'accessorySize',
      name: 'Size',
      values: [{
        name: 'ALL',
        value: '010',
        available: true
      }]
    }],
    variants: [{
      id: '842204063326',
      price: {
        value: new Decimal('162'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001M1355001'
      }, {
        name: 'accessorySize',
        value: '010'
      }]
    }, {
      id: '842204063333',
      price: {
        value: new Decimal('162'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0002M1355214'
      }, {
        name: 'accessorySize',
        value: '010'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: '842204063333',
    title: "Men's Leather Luggage Fisherman Bag",
    handle: '842204063333',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw940383d7/images/large/M1355_214.jpg',
      alt: "Men's Leather Luggage Fisherman Bag, Brown, large"
    }],
    price: {
      value: new Decimal('162'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Black',
        value: '0001M1355001',
        available: true
      }, {
        name: 'Brown',
        value: '0002M1355214',
        available: true
      }]
    }, {
      id: 'accessorySize',
      name: 'Size',
      values: [{
        name: 'ALL',
        value: '010',
        available: true
      }]
    }],
    variants: [{
      id: '842204063326',
      price: {
        value: new Decimal('162'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001M1355001'
      }, {
        name: 'accessorySize',
        value: '010'
      }]
    }, {
      id: '842204063333',
      price: {
        value: new Decimal('162'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0002M1355214'
      }, {
        name: 'accessorySize',
        value: '010'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: '061492858852',
    title: "Men's Oxford Gloves",
    handle: '061492858852',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dwd48d6ac0/images/large/TG250_001.jpg',
      alt: "Men's Oxford Gloves, Black, large"
    }],
    price: {
      value: new Decimal('99.99'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Black',
        value: '0001TG250001',
        available: true
      }, {
        name: 'Brandy',
        value: '0002TG250206',
        available: true
      }]
    }, {
      id: 'accessorySize',
      name: 'Size',
      values: [{
        name: 'M',
        value: '050',
        available: true
      }, {
        name: 'L',
        value: '060',
        available: true
      }, {
        name: 'XL',
        value: '080',
        available: true
      }]
    }],
    variants: [{
      id: '061492858852',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG250001'
      }, {
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492858869',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG250001'
      }, {
        name: 'accessorySize',
        value: '060'
      }]
    }, {
      id: '061492858876',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG250001'
      }, {
        name: 'accessorySize',
        value: '080'
      }]
    }, {
      id: '061492858906',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0002TG250206'
      }, {
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492858913',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0002TG250206'
      }, {
        name: 'accessorySize',
        value: '060'
      }]
    }, {
      id: '061492858920',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0002TG250206'
      }, {
        name: 'accessorySize',
        value: '080'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: true,
      stock: 0
    }
  }, {
    id: '061492858869',
    title: "Men's Oxford Gloves",
    handle: '061492858869',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dwd48d6ac0/images/large/TG250_001.jpg',
      alt: "Men's Oxford Gloves, Black, large"
    }],
    price: {
      value: new Decimal('99.99'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Black',
        value: '0001TG250001',
        available: true
      }, {
        name: 'Brandy',
        value: '0002TG250206',
        available: true
      }]
    }, {
      id: 'accessorySize',
      name: 'Size',
      values: [{
        name: 'M',
        value: '050',
        available: true
      }, {
        name: 'L',
        value: '060',
        available: true
      }, {
        name: 'XL',
        value: '080',
        available: true
      }]
    }],
    variants: [{
      id: '061492858852',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG250001'
      }, {
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492858869',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG250001'
      }, {
        name: 'accessorySize',
        value: '060'
      }]
    }, {
      id: '061492858876',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG250001'
      }, {
        name: 'accessorySize',
        value: '080'
      }]
    }, {
      id: '061492858906',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0002TG250206'
      }, {
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492858913',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0002TG250206'
      }, {
        name: 'accessorySize',
        value: '060'
      }]
    }, {
      id: '061492858920',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0002TG250206'
      }, {
        name: 'accessorySize',
        value: '080'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: true,
      stock: 0
    }
  }, {
    id: '061492858876',
    title: "Men's Oxford Gloves",
    handle: '061492858876',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dwd48d6ac0/images/large/TG250_001.jpg',
      alt: "Men's Oxford Gloves, Black, large"
    }],
    price: {
      value: new Decimal('99.99'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Black',
        value: '0001TG250001',
        available: true
      }, {
        name: 'Brandy',
        value: '0002TG250206',
        available: true
      }]
    }, {
      id: 'accessorySize',
      name: 'Size',
      values: [{
        name: 'M',
        value: '050',
        available: true
      }, {
        name: 'L',
        value: '060',
        available: true
      }, {
        name: 'XL',
        value: '080',
        available: true
      }]
    }],
    variants: [{
      id: '061492858852',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG250001'
      }, {
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492858869',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG250001'
      }, {
        name: 'accessorySize',
        value: '060'
      }]
    }, {
      id: '061492858876',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG250001'
      }, {
        name: 'accessorySize',
        value: '080'
      }]
    }, {
      id: '061492858906',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0002TG250206'
      }, {
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492858913',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0002TG250206'
      }, {
        name: 'accessorySize',
        value: '060'
      }]
    }, {
      id: '061492858920',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0002TG250206'
      }, {
        name: 'accessorySize',
        value: '080'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: true,
      stock: 0
    }
  }, {
    id: '061492858906',
    title: "Men's Oxford Gloves",
    handle: '061492858906',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dwd5d6d418/images/large/TG250_206.jpg',
      alt: "Men's Oxford Gloves, Brandy, large"
    }],
    price: {
      value: new Decimal('99.99'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Black',
        value: '0001TG250001',
        available: true
      }, {
        name: 'Brandy',
        value: '0002TG250206',
        available: true
      }]
    }, {
      id: 'accessorySize',
      name: 'Size',
      values: [{
        name: 'M',
        value: '050',
        available: true
      }, {
        name: 'L',
        value: '060',
        available: true
      }, {
        name: 'XL',
        value: '080',
        available: true
      }]
    }],
    variants: [{
      id: '061492858852',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG250001'
      }, {
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492858869',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG250001'
      }, {
        name: 'accessorySize',
        value: '060'
      }]
    }, {
      id: '061492858876',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG250001'
      }, {
        name: 'accessorySize',
        value: '080'
      }]
    }, {
      id: '061492858906',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0002TG250206'
      }, {
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492858913',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0002TG250206'
      }, {
        name: 'accessorySize',
        value: '060'
      }]
    }, {
      id: '061492858920',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0002TG250206'
      }, {
        name: 'accessorySize',
        value: '080'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: true,
      stock: 0
    }
  }, {
    id: '061492858913',
    title: "Men's Oxford Gloves",
    handle: '061492858913',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dwd5d6d418/images/large/TG250_206.jpg',
      alt: "Men's Oxford Gloves, Brandy, large"
    }],
    price: {
      value: new Decimal('99.99'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Black',
        value: '0001TG250001',
        available: true
      }, {
        name: 'Brandy',
        value: '0002TG250206',
        available: true
      }]
    }, {
      id: 'accessorySize',
      name: 'Size',
      values: [{
        name: 'M',
        value: '050',
        available: true
      }, {
        name: 'L',
        value: '060',
        available: true
      }, {
        name: 'XL',
        value: '080',
        available: true
      }]
    }],
    variants: [{
      id: '061492858852',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG250001'
      }, {
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492858869',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG250001'
      }, {
        name: 'accessorySize',
        value: '060'
      }]
    }, {
      id: '061492858876',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG250001'
      }, {
        name: 'accessorySize',
        value: '080'
      }]
    }, {
      id: '061492858906',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0002TG250206'
      }, {
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492858913',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0002TG250206'
      }, {
        name: 'accessorySize',
        value: '060'
      }]
    }, {
      id: '061492858920',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0002TG250206'
      }, {
        name: 'accessorySize',
        value: '080'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: true,
      stock: 0
    }
  }, {
    id: '061492858920',
    title: "Men's Oxford Gloves",
    handle: '061492858920',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dwd5d6d418/images/large/TG250_206.jpg',
      alt: "Men's Oxford Gloves, Brandy, large"
    }],
    price: {
      value: new Decimal('99.99'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Black',
        value: '0001TG250001',
        available: true
      }, {
        name: 'Brandy',
        value: '0002TG250206',
        available: true
      }]
    }, {
      id: 'accessorySize',
      name: 'Size',
      values: [{
        name: 'M',
        value: '050',
        available: true
      }, {
        name: 'L',
        value: '060',
        available: true
      }, {
        name: 'XL',
        value: '080',
        available: true
      }]
    }],
    variants: [{
      id: '061492858852',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG250001'
      }, {
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492858869',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG250001'
      }, {
        name: 'accessorySize',
        value: '060'
      }]
    }, {
      id: '061492858876',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG250001'
      }, {
        name: 'accessorySize',
        value: '080'
      }]
    }, {
      id: '061492858906',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0002TG250206'
      }, {
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492858913',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0002TG250206'
      }, {
        name: 'accessorySize',
        value: '060'
      }]
    }, {
      id: '061492858920',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0002TG250206'
      }, {
        name: 'accessorySize',
        value: '080'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: true,
      stock: 0
    }
  }, {
    id: '061492183572',
    title: "Men's Classic Deer Gloves",
    handle: '061492183572',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw93da4621/images/large/TG508_206.jpg',
      alt: "Men's Classic Deer Gloves, , large"
    }],
    price: {
      value: new Decimal('99.99'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'accessorySize',
      name: 'Size',
      values: [{
        name: 'M',
        value: '050',
        available: true
      }, {
        name: 'L',
        value: '060',
        available: true
      }, {
        name: 'XL',
        value: '080',
        available: true
      }]
    }],
    variants: [{
      id: '061492183572',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492183589',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'accessorySize',
        value: '060'
      }]
    }, {
      id: '061492183596',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'accessorySize',
        value: '080'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: '061492183589',
    title: "Men's Classic Deer Gloves",
    handle: '061492183589',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw93da4621/images/large/TG508_206.jpg',
      alt: "Men's Classic Deer Gloves, , large"
    }],
    price: {
      value: new Decimal('99.99'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'accessorySize',
      name: 'Size',
      values: [{
        name: 'M',
        value: '050',
        available: true
      }, {
        name: 'L',
        value: '060',
        available: true
      }, {
        name: 'XL',
        value: '080',
        available: true
      }]
    }],
    variants: [{
      id: '061492183572',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492183589',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'accessorySize',
        value: '060'
      }]
    }, {
      id: '061492183596',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'accessorySize',
        value: '080'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: '061492183596',
    title: "Men's Classic Deer Gloves",
    handle: '061492183596',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw93da4621/images/large/TG508_206.jpg',
      alt: "Men's Classic Deer Gloves, , large"
    }],
    price: {
      value: new Decimal('99.99'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'accessorySize',
      name: 'Size',
      values: [{
        name: 'M',
        value: '050',
        available: true
      }, {
        name: 'L',
        value: '060',
        available: true
      }, {
        name: 'XL',
        value: '080',
        available: true
      }]
    }],
    variants: [{
      id: '061492183572',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492183589',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'accessorySize',
        value: '060'
      }]
    }, {
      id: '061492183596',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'accessorySize',
        value: '080'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: '061492215594',
    title: 'Unisex Boot II Gloves',
    handle: '061492215594',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw7aff72a2/images/large/TG720_754.jpg',
      alt: 'Unisex Boot II Gloves, Wheat Nubuck, large'
    }],
    price: {
      value: new Decimal('99.99'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Wheat Nubuck',
        value: '0001TG720754',
        available: true
      }]
    }, {
      id: 'accessorySize',
      name: 'Size',
      values: [{
        name: 'M',
        value: '050',
        available: true
      }, {
        name: 'L',
        value: '060',
        available: true
      }, {
        name: 'XL',
        value: '080',
        available: true
      }]
    }],
    variants: [{
      id: '061492215594',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG720754'
      }, {
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492215617',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG720754'
      }, {
        name: 'accessorySize',
        value: '060'
      }]
    }, {
      id: '061492215624',
      price: {
        value: new Decimal('95'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG720754'
      }, {
        name: 'accessorySize',
        value: '080'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: '061492215617',
    title: 'Unisex Boot II Gloves',
    handle: '061492215617',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw7aff72a2/images/large/TG720_754.jpg',
      alt: 'Unisex Boot II Gloves, Wheat Nubuck, large'
    }],
    price: {
      value: new Decimal('99.99'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Wheat Nubuck',
        value: '0001TG720754',
        available: true
      }]
    }, {
      id: 'accessorySize',
      name: 'Size',
      values: [{
        name: 'M',
        value: '050',
        available: true
      }, {
        name: 'L',
        value: '060',
        available: true
      }, {
        name: 'XL',
        value: '080',
        available: true
      }]
    }],
    variants: [{
      id: '061492215594',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG720754'
      }, {
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492215617',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG720754'
      }, {
        name: 'accessorySize',
        value: '060'
      }]
    }, {
      id: '061492215624',
      price: {
        value: new Decimal('95'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG720754'
      }, {
        name: 'accessorySize',
        value: '080'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: '061492215624',
    title: 'Unisex Boot II Gloves',
    handle: '061492215624',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw7aff72a2/images/large/TG720_754.jpg',
      alt: 'Unisex Boot II Gloves, Wheat Nubuck, large'
    }],
    price: {
      value: new Decimal('95'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Wheat Nubuck',
        value: '0001TG720754',
        available: true
      }]
    }, {
      id: 'accessorySize',
      name: 'Size',
      values: [{
        name: 'M',
        value: '050',
        available: true
      }, {
        name: 'L',
        value: '060',
        available: true
      }, {
        name: 'XL',
        value: '080',
        available: true
      }]
    }],
    variants: [{
      id: '061492215594',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG720754'
      }, {
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492215617',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG720754'
      }, {
        name: 'accessorySize',
        value: '060'
      }]
    }, {
      id: '061492215624',
      price: {
        value: new Decimal('95'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG720754'
      }, {
        name: 'accessorySize',
        value: '080'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: '029407331289',
    title: 'Solid Silk Tie',
    handle: '029407331289',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dwcc2865e9/images/large/PG.949432114S.YELLOSI.PZ.jpg',
      alt: 'Solid Silk Tie, Yellow, large'
    }, {
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dwb5268704/images/large/PG.949432114S.YELLOSI.BZ.jpg',
      alt: 'Solid Silk Tie, Yellow, large'
    }],
    price: {
      value: new Decimal('29.99'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Navy',
        value: 'NAVYSI',
        available: true
      }, {
        name: 'Red',
        value: 'REDSI',
        available: true
      }, {
        name: 'Yellow',
        value: 'YELLOSI',
        available: true
      }]
    }],
    variants: [{
      id: '029407331289',
      price: {
        value: new Decimal('29.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'YELLOSI'
      }]
    }, {
      id: '029407331227',
      price: {
        value: new Decimal('29.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'NAVYSI'
      }]
    }, {
      id: '029407331258',
      price: {
        value: new Decimal('29.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'REDSI'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: '029407331227',
    title: 'Solid Silk Tie',
    handle: '029407331227',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dwa003e1ec/images/large/PG.949432114S.NAVYSI.PZ.jpg',
      alt: 'Solid Silk Tie, Navy, large'
    }, {
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw209d58ec/images/large/PG.949432114S.NAVYSI.BZ.jpg',
      alt: 'Solid Silk Tie, Navy, large'
    }],
    price: {
      value: new Decimal('29.99'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Navy',
        value: 'NAVYSI',
        available: true
      }, {
        name: 'Red',
        value: 'REDSI',
        available: true
      }, {
        name: 'Yellow',
        value: 'YELLOSI',
        available: true
      }]
    }],
    variants: [{
      id: '029407331289',
      price: {
        value: new Decimal('29.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'YELLOSI'
      }]
    }, {
      id: '029407331227',
      price: {
        value: new Decimal('29.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'NAVYSI'
      }]
    }, {
      id: '029407331258',
      price: {
        value: new Decimal('29.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'REDSI'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: '029407331258',
    title: 'Solid Silk Tie',
    handle: '029407331258',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dwa242825f/images/large/PG.949432114S.REDSI.PZ.jpg',
      alt: 'Solid Silk Tie, Red, large'
    }, {
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dwb6f76fb2/images/large/PG.949432114S.REDSI.BZ.jpg',
      alt: 'Solid Silk Tie, Red, large'
    }],
    price: {
      value: new Decimal('29.99'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Navy',
        value: 'NAVYSI',
        available: true
      }, {
        name: 'Red',
        value: 'REDSI',
        available: true
      }, {
        name: 'Yellow',
        value: 'YELLOSI',
        available: true
      }]
    }],
    variants: [{
      id: '029407331289',
      price: {
        value: new Decimal('29.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'YELLOSI'
      }]
    }, {
      id: '029407331227',
      price: {
        value: new Decimal('29.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'NAVYSI'
      }]
    }, {
      id: '029407331258',
      price: {
        value: new Decimal('29.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'REDSI'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: '061492273693',
    title: "Men's Yarmouth Gloves",
    handle: '061492273693',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dwf0ffc141/images/large/TG786_214.jpg',
      alt: "Men's Yarmouth Gloves, Brown, large"
    }],
    price: {
      value: new Decimal('119.99'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Brown',
        value: '0001TG786214',
        available: true
      }]
    }, {
      id: 'accessorySize',
      name: 'Size',
      values: [{
        name: 'M',
        value: '050',
        available: true
      }, {
        name: 'L',
        value: '060',
        available: true
      }, {
        name: 'XL',
        value: '080',
        available: true
      }]
    }],
    variants: [{
      id: '061492273693',
      price: {
        value: new Decimal('119.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG786214'
      }, {
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492273709',
      price: {
        value: new Decimal('119.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG786214'
      }, {
        name: 'accessorySize',
        value: '060'
      }]
    }, {
      id: '061492273716',
      price: {
        value: new Decimal('119.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG786214'
      }, {
        name: 'accessorySize',
        value: '080'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: '061492273709',
    title: "Men's Yarmouth Gloves",
    handle: '061492273709',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dwf0ffc141/images/large/TG786_214.jpg',
      alt: "Men's Yarmouth Gloves, Brown, large"
    }],
    price: {
      value: new Decimal('119.99'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Brown',
        value: '0001TG786214',
        available: true
      }]
    }, {
      id: 'accessorySize',
      name: 'Size',
      values: [{
        name: 'M',
        value: '050',
        available: true
      }, {
        name: 'L',
        value: '060',
        available: true
      }, {
        name: 'XL',
        value: '080',
        available: true
      }]
    }],
    variants: [{
      id: '061492273693',
      price: {
        value: new Decimal('119.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG786214'
      }, {
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492273709',
      price: {
        value: new Decimal('119.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG786214'
      }, {
        name: 'accessorySize',
        value: '060'
      }]
    }, {
      id: '061492273716',
      price: {
        value: new Decimal('119.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG786214'
      }, {
        name: 'accessorySize',
        value: '080'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: '061492273716',
    title: "Men's Yarmouth Gloves",
    handle: '061492273716',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dwf0ffc141/images/large/TG786_214.jpg',
      alt: "Men's Yarmouth Gloves, Brown, large"
    }],
    price: {
      value: new Decimal('119.99'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Brown',
        value: '0001TG786214',
        available: true
      }]
    }, {
      id: 'accessorySize',
      name: 'Size',
      values: [{
        name: 'M',
        value: '050',
        available: true
      }, {
        name: 'L',
        value: '060',
        available: true
      }, {
        name: 'XL',
        value: '080',
        available: true
      }]
    }],
    variants: [{
      id: '061492273693',
      price: {
        value: new Decimal('119.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG786214'
      }, {
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492273709',
      price: {
        value: new Decimal('119.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG786214'
      }, {
        name: 'accessorySize',
        value: '060'
      }]
    }, {
      id: '061492273716',
      price: {
        value: new Decimal('119.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: '0001TG786214'
      }, {
        name: 'accessorySize',
        value: '080'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: '682875090845',
    title: 'Checked Silk Tie',
    handle: '682875090845',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dwe495e4e1/images/large/PG.949612424S.COBATSI.PZ.jpg',
      alt: 'Checked Silk Tie, Cobalt, large'
    }, {
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dwc8be6d8b/images/large/PG.949612424S.COBATSI.BZ.jpg',
      alt: 'Checked Silk Tie, Cobalt, large'
    }],
    price: {
      value: new Decimal('29.99'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Cobalt',
        value: 'COBATSI',
        available: true
      }, {
        name: 'Navy',
        value: 'NAVYSI',
        available: true
      }, {
        name: 'Yellow',
        value: 'YELLOSI',
        available: true
      }]
    }],
    variants: [{
      id: '682875090845',
      price: {
        value: new Decimal('29.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'COBATSI'
      }]
    }, {
      id: '682875719029',
      price: {
        value: new Decimal('29.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'NAVYSI'
      }]
    }, {
      id: '682875540326',
      price: {
        value: new Decimal('29.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'YELLOSI'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: '682875719029',
    title: 'Checked Silk Tie',
    handle: '682875719029',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw111c2684/images/large/PG.949612424S.NAVYSI.PZ.jpg',
      alt: 'Checked Silk Tie, Navy, large'
    }, {
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw728fb9b4/images/large/PG.949612424S.NAVYSI.BZ.jpg',
      alt: 'Checked Silk Tie, Navy, large'
    }],
    price: {
      value: new Decimal('29.99'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Cobalt',
        value: 'COBATSI',
        available: true
      }, {
        name: 'Navy',
        value: 'NAVYSI',
        available: true
      }, {
        name: 'Yellow',
        value: 'YELLOSI',
        available: true
      }]
    }],
    variants: [{
      id: '682875090845',
      price: {
        value: new Decimal('29.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'COBATSI'
      }]
    }, {
      id: '682875719029',
      price: {
        value: new Decimal('29.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'NAVYSI'
      }]
    }, {
      id: '682875540326',
      price: {
        value: new Decimal('29.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'YELLOSI'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: '682875540326',
    title: 'Checked Silk Tie',
    handle: '682875540326',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw4e164a3a/images/large/PG.949612424S.YELLOSI.PZ.jpg',
      alt: 'Checked Silk Tie, Yellow, large'
    }, {
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw55693281/images/large/PG.949612424S.YELLOSI.BZ.jpg',
      alt: 'Checked Silk Tie, Yellow, large'
    }],
    price: {
      value: new Decimal('29.99'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Cobalt',
        value: 'COBATSI',
        available: true
      }, {
        name: 'Navy',
        value: 'NAVYSI',
        available: true
      }, {
        name: 'Yellow',
        value: 'YELLOSI',
        available: true
      }]
    }],
    variants: [{
      id: '682875090845',
      price: {
        value: new Decimal('29.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'COBATSI'
      }]
    }, {
      id: '682875719029',
      price: {
        value: new Decimal('29.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'NAVYSI'
      }]
    }, {
      id: '682875540326',
      price: {
        value: new Decimal('29.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'YELLOSI'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: '793775064963',
    title: 'Striped Silk Tie',
    handle: '793775064963',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw81a381dd/images/large/PG.949034314S.TAUPESI.PZ.jpg',
      alt: 'Striped Silk Tie, Taupe, large'
    }, {
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw89c8970f/images/large/PG.949034314S.TAUPESI.BZ.jpg',
      alt: 'Striped Silk Tie, Taupe, large'
    }],
    price: {
      value: new Decimal('29.99'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'color',
      name: 'Color',
      values: [{
        name: 'Taupe',
        value: 'TAUPESI',
        available: true
      }]
    }],
    variants: [{
      id: '793775064963',
      price: {
        value: new Decimal('29.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'color',
        value: 'TAUPESI'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: '061492216683',
    title: "Men's Resolve Gloves",
    handle: '061492216683',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw005af1fa/images/large/TG733_243.jpg',
      alt: "Men's Resolve Gloves, , large"
    }],
    price: {
      value: new Decimal('99.99'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'accessorySize',
      name: 'Size',
      values: [{
        name: 'M',
        value: '050',
        available: true
      }, {
        name: 'L',
        value: '060',
        available: true
      }, {
        name: 'XL',
        value: '080',
        available: true
      }]
    }],
    variants: [{
      id: '061492216683',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492216706',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'accessorySize',
        value: '080'
      }]
    }, {
      id: '061492216690',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'accessorySize',
        value: '060'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: true,
      stock: 0
    }
  }, {
    id: '061492216706',
    title: "Men's Resolve Gloves",
    handle: '061492216706',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw005af1fa/images/large/TG733_243.jpg',
      alt: "Men's Resolve Gloves, , large"
    }],
    price: {
      value: new Decimal('99.99'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'accessorySize',
      name: 'Size',
      values: [{
        name: 'M',
        value: '050',
        available: true
      }, {
        name: 'L',
        value: '060',
        available: true
      }, {
        name: 'XL',
        value: '080',
        available: true
      }]
    }],
    variants: [{
      id: '061492216683',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492216706',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'accessorySize',
        value: '080'
      }]
    }, {
      id: '061492216690',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'accessorySize',
        value: '060'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: '061492216690',
    title: "Men's Resolve Gloves",
    handle: '061492216690',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-apparel-catalog/default/dw005af1fa/images/large/TG733_243.jpg',
      alt: "Men's Resolve Gloves, , large"
    }],
    price: {
      value: new Decimal('99.99'),
      currencyCode: DefaultCurrencyCode
    },
    options: [{
      id: 'accessorySize',
      name: 'Size',
      values: [{
        name: 'M',
        value: '050',
        available: true
      }, {
        name: 'L',
        value: '060',
        available: true
      }, {
        name: 'XL',
        value: '080',
        available: true
      }]
    }],
    variants: [{
      id: '061492216683',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'accessorySize',
        value: '050'
      }]
    }, {
      id: '061492216706',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'accessorySize',
        value: '080'
      }]
    }, {
      id: '061492216690',
      price: {
        value: new Decimal('99.99'),
        currencyCode: DefaultCurrencyCode
      },
      available: true,
      optionValues: [{
        name: 'accessorySize',
        value: '060'
      }]
    }],
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: true,
      stock: 0
    }
  }, {
    id: 'sony-alpha350-wlen',
    title: 'Sony Alpha 350 Digital SLR Camera w/18-70mm Lens',
    handle: 'sony-alpha350-wlen',
    brand: 'Sony',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-electronics-catalog/default/dw8a1815da/images/large/sony-alpha350-wlen.jpg',
      alt: 'Sony Alpha 350 Digital SLR Camera w/18-70mm Lens, , large'
    }],
    price: {
      value: new Decimal('1399.99'),
      currencyCode: DefaultCurrencyCode
    },
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: 'nikon-p6000',
    title: 'Nikon Coolpix P6000 Digital Point and Shoot Camera',
    handle: 'nikon-p6000',
    brand: 'Nikon',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-electronics-catalog/default/dw79f0ebce/images/large/nikon-p6000.jpg',
      alt: 'Nikon Coolpix P6000 Digital Point and Shoot Camera, , large'
    }],
    price: {
      value: new Decimal('399.99'),
      currencyCode: DefaultCurrencyCode
    },
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: true,
      stock: 0
    }
  }, {
    id: 'nikon-sl16',
    title: 'Nikon Coolpix L16 Digital Point and Shoot Camera',
    handle: 'nikon-sl16',
    brand: 'Nikon',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-electronics-catalog/default/dw45e65286/images/large/nikon-sl16.jpg',
      alt: 'Nikon Coolpix L16 Digital Point and Shoot Camera, , large'
    }],
    price: {
      value: new Decimal('119.99'),
      currencyCode: DefaultCurrencyCode
    },
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: true,
      stock: 0
    }
  }, {
    id: 'sony-cybershot-dsc-h50',
    title: 'Sony Cyber-shot® DSC-H50 Digital Point and Shoot Camera',
    handle: 'sony-cybershot-dsc-h50',
    brand: 'Sony',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-electronics-catalog/default/dw13ae0460/images/large/sony-cybershot-dsc-h50.jpg',
      alt: 'Sony Cyber-shot® DSC-H50 Digital Point and Shoot Camera, , large'
    }],
    price: {
      value: new Decimal('189.99'),
      currencyCode: DefaultCurrencyCode
    },
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: 'canon-powershot-sd990-is',
    title: 'Canon PowerShot SD990 Digital Point and Shoot Camera',
    handle: 'canon-powershot-sd990-is',
    brand: 'Canon',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-electronics-catalog/default/dw39a3afcc/images/large/canon-powershot-sd990-is.jpg',
      alt: 'Canon PowerShot SD990 Digital Point and Shoot Camera, , large'
    }],
    price: {
      value: new Decimal('399.99'),
      currencyCode: DefaultCurrencyCode
    },
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: 'nikon-s60',
    title: 'Nikon Coolpix S60 Digital Point and Shoot Camera',
    handle: 'nikon-s60',
    brand: 'Nikon',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-electronics-catalog/default/dw94fc9c3f/images/large/nikon-s60.jpg',
      alt: 'Nikon Coolpix S60 Digital Point and Shoot Camera, , large'
    }],
    price: {
      value: new Decimal('199.99'),
      currencyCode: DefaultCurrencyCode
    },
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: true,
      stock: 0
    }
  }, {
    id: 'nikon-f700-body',
    title: 'Nikon F700 Digital SLR Camera (body only)',
    handle: 'nikon-f700-body',
    brand: 'Nikon',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-electronics-catalog/default/dwb8763c8e/images/large/nikon-f700-body.jpg',
      alt: 'Nikon F700 Digital SLR Camera (body only), , large'
    }],
    price: {
      value: new Decimal('1154.3'),
      currencyCode: DefaultCurrencyCode
    },
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: 'canon-eos-50d-body',
    title: 'Canon EOS 50D Digital SLR Camera (body only)',
    handle: 'canon-eos-50d-body',
    brand: 'Canon',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-electronics-catalog/default/dwb3da83be/images/large/canon-eos-50d-body.jpg',
      alt: 'Canon EOS 50D Digital SLR Camera (body only), , large'
    }],
    price: {
      value: new Decimal('979.99'),
      currencyCode: DefaultCurrencyCode
    },
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: 'canon-powershot-a580',
    title: 'Canon PowerShot A580 Digital Point and Shoot Camera',
    handle: 'canon-powershot-a580',
    brand: 'Canon',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-electronics-catalog/default/dwc5c6fe6a/images/large/canon-powershot-a580.jpg',
      alt: 'Canon PowerShot A580 Digital Point and Shoot Camera, , large'
    }],
    price: {
      value: new Decimal('149.99'),
      currencyCode: DefaultCurrencyCode
    },
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: 'canon-powershot-g10',
    title: 'Canon PowerShot G10 Digital Point and Shoot Camera',
    handle: 'canon-powershot-g10',
    brand: 'Canon',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-electronics-catalog/default/dwf77c80da/images/large/canon-powershot-g10.jpg',
      alt: 'Canon PowerShot G10 Digital Point and Shoot Camera, , large'
    }],
    price: {
      value: new Decimal('499.99'),
      currencyCode: DefaultCurrencyCode
    },
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: 'kodak-z712',
    title: 'Kodak EasyShare Z712 Digital Point and Shoot Camera',
    handle: 'kodak-z712',
    brand: 'Kodak',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-electronics-catalog/default/dwfc0ebba9/images/large/kodak-z712.jpg',
      alt: 'Kodak EasyShare Z712 Digital Point and Shoot Camera, , large'
    }],
    price: {
      value: new Decimal('139.96'),
      currencyCode: DefaultCurrencyCode
    },
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: 'sony-cybershot-t77',
    title: 'Sony Cyber-shot® T77 Digital Point and Shoot Camera',
    handle: 'sony-cybershot-t77',
    brand: 'Sony',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-electronics-catalog/default/dw5b8ebb04/images/large/sony-cybershot-t77.jpg',
      alt: 'Sony Cyber-shot® T77 Digital Point and Shoot Camera, , large'
    }],
    price: {
      value: new Decimal('129.99'),
      currencyCode: DefaultCurrencyCode
    },
    available: true,
    promotions: ['Buy5for50'],
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: 'sony-cybershot-w120',
    title: 'Sony Cyber-shot® W120 Digital Point and Shoot Camera',
    handle: 'sony-cybershot-w120',
    brand: 'Sony',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-electronics-catalog/default/dw46fb4c20/images/large/sony-cybershot-w120.jpg',
      alt: 'Sony Cyber-shot® W120 Digital Point and Shoot Camera, , large'
    }],
    price: {
      value: new Decimal('179.99'),
      currencyCode: DefaultCurrencyCode
    },
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: 'canon-powershot-sd1100-is',
    title: 'Canon PowerShot SD1100 Digital Point and Shoot Camera',
    handle: 'canon-powershot-sd1100-is',
    brand: 'Canon',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-electronics-catalog/default/dw932aece0/images/large/canon-powershot-sd1100-is.jpg',
      alt: 'Canon PowerShot SD1100 Digital Point and Shoot Camera, , large'
    }],
    price: {
      value: new Decimal('349.99'),
      currencyCode: DefaultCurrencyCode
    },
    available: true,
    promotions: ['Buy5for50'],
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: 'kodak-z8612',
    title: 'Kodak EasyShare Z8612 Digital Point and Shoot Camera',
    handle: 'kodak-z8612',
    brand: 'Kodak',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-electronics-catalog/default/dw4f3d7e76/images/large/kodak-z8612.jpg',
      alt: 'Kodak EasyShare Z8612 Digital Point and Shoot Camera, , large'
    }],
    price: {
      value: new Decimal('199.95'),
      currencyCode: DefaultCurrencyCode
    },
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: 'canon-powershot-s5-is',
    title: 'Canon PowerShot S5 IS Digital Point and Shoot Camera',
    handle: 'canon-powershot-s5-is',
    brand: 'Canon',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-electronics-catalog/default/dw226ae11a/images/large/canon-powershot-s5-is.jpg',
      alt: 'Canon PowerShot S5 IS Digital Point and Shoot Camera, , large'
    }],
    price: {
      value: new Decimal('399.99'),
      currencyCode: DefaultCurrencyCode
    },
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: 'canon-eos-5d-mark2-body',
    title: 'Canon EOS 5D Mark II Digital SLR Camera (body only)',
    handle: 'canon-eos-5d-mark2-body',
    brand: 'Canon',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-electronics-catalog/default/dw2ad5b3e9/images/large/canon-eos-5d-mark2-body.jpg',
      alt: 'Canon EOS 5D Mark II Digital SLR Camera (body only), , large'
    }],
    price: {
      value: new Decimal('1889.99'),
      currencyCode: DefaultCurrencyCode
    },
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: 'canon-powershot-e1',
    title: 'Canon PowerShot E1 Digital Point and Shoot Camera',
    handle: 'canon-powershot-e1',
    brand: 'Canon',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-electronics-catalog/default/dw4f3f204b/images/large/canon-powershot-e1.jpg',
      alt: 'Canon PowerShot E1 Digital Point and Shoot Camera, , large'
    }],
    price: {
      value: new Decimal('199.99'),
      currencyCode: DefaultCurrencyCode
    },
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: 'kodak-v1273',
    title: 'Kodak EasyShare V1273 Digital Point and Shoot Camera',
    handle: 'kodak-v1273',
    brand: 'Kodak',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-electronics-catalog/default/dw984b86a1/images/large/kodak-v1273.jpg',
      alt: 'Kodak EasyShare V1273 Digital Point and Shoot Camera, , large'
    }],
    price: {
      value: new Decimal('229.95'),
      currencyCode: DefaultCurrencyCode
    },
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: 'S2510211',
    title: 'Samsung Digimax A6 - Digital camera - 6.0 Mpix - optical zoom: 3 x - supported memory: MMC, SD',
    handle: 'S2510211',
    brand: 'Samsung',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-electronics-catalog/default/dw6ce064b8/images/large/Samsung-DigimaxA6.jpg',
      alt: 'Samsung Digimax A6 - Digital camera - 6.0 Mpix - optical zoom: 3 x - supported memory: MMC, SD, , large'
    }],
    price: {
      value: new Decimal('399.99'),
      currencyCode: DefaultCurrencyCode
    },
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: 'nikon-d60-wlens',
    title: 'Nikon D60 Digital SLR Camera w/18-55mm Lens',
    handle: 'nikon-d60-wlens',
    brand: 'Nikon',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-electronics-catalog/default/dwcb755292/images/large/nikon-d60-wlens.jpg',
      alt: 'Nikon D60 Digital SLR Camera w/18-55mm Lens, , large'
    }],
    price: {
      value: new Decimal('300.3'),
      currencyCode: DefaultCurrencyCode
    },
    available: true,
    promotions: ['Buy5for50'],
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: 'sony-alpha900-body',
    title: 'Sony Alpha 900 Digital SLR Camera (body only)',
    handle: 'sony-alpha900-body',
    brand: 'Sony',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-electronics-catalog/default/dw5a0f070d/images/large/sony-alpha900-body.jpg',
      alt: 'Sony Alpha 900 Digital SLR Camera (body only), , large'
    }],
    price: {
      value: new Decimal('2099.99'),
      currencyCode: DefaultCurrencyCode
    },
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: 'kodak-z1015',
    title: 'Kodak EasyShare Z1015 Digital Point and Shoot Camera',
    handle: 'kodak-z1015',
    brand: 'Kodak',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-electronics-catalog/default/dw2172c7aa/images/large/kodak-z1015.jpg',
      alt: 'Kodak EasyShare Z1015 Digital Point and Shoot Camera, , large'
    }],
    price: {
      value: new Decimal('299.95'),
      currencyCode: DefaultCurrencyCode
    },
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 50
    }
  }, {
    id: 'kodak-c1013',
    title: 'Kodak EasyShare C1013 Digital Point and Shoot Camera',
    handle: 'kodak-c1013',
    brand: 'Kodak',
    images: [{
      uri: 'https://demo-ocapi.demandware.net/on/demandware.static/-/Sites-electronics-catalog/default/dw50d5eba8/images/large/kodak-c1013.jpg',
      alt: 'Kodak EasyShare C1013 Digital Point and Shoot Camera, , large'
    }],
    price: {
      value: new Decimal('129.95'),
      currencyCode: DefaultCurrencyCode
    },
    available: true,
    inventory: {
      orderable: true,
      backorderable: false,
      preorderable: false,
      stock: 3
    }
  }
];

export const ProductSortingOptions: import ('@brandingbrand/fscommerce').CommerceTypes.SortingOption[] = [
  {
    id: 'title-asc',
    title: 'Name (asc)'
  }, {
    id: 'title-desc',
    title: 'Name (desc)'
  }, {
    id: 'price-asc',
    title: 'Price (asc)'
  }, {
    id: 'price-desc',
    title: 'Price (desc)'
  }
];

const brands = Products
  .map(product => product.brand)
  .filter((brand): brand is string => brand !== undefined);

export const ProductRefinements: import ('@brandingbrand/fscommerce').CommerceTypes.Refinement[] = [{
  id: 'brand',
  title: 'Brand',
  values: [...new Set(brands)].map(brand => ({
    value: brand,
    title: brand,
    count: Products.reduce((count, product) => product.brand === brand ? count++ : count, 0)
  }))
}];

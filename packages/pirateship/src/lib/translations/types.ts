import {
  EmailErrors,
  PasswordFormErrors,
  TranslationKey,
  TranslationKeys
} from '@brandingbrand/fsi18n';

export interface ProjectTranslationKeys<KeyType = TranslationKey> extends TranslationKeys {
  formPlaceholders: {
    required: KeyType;
    optional: KeyType;
  };
  contactInfo: ContactInfoForm<KeyType>;
  address: Address<KeyType>;
  item: Item<KeyType>;
  search: Search<KeyType>;
  account: Account<KeyType>;
  screens: Screens<KeyType>;
  cart: Cart<KeyType>;
  payment: Payment<KeyType>;
  emailSignUp: EmailSignUp<KeyType>;
}

interface ContactInfoForm<KeyType> {
  notes: {
    callout: KeyType;
    email: KeyType;
  };
  actions: {
    save: {
      actionBtn: KeyType;
    };
    cancel: {
      actionBtn: KeyType;
    };
  };
  errors: {
    email: EmailErrors<KeyType>;
    password: PasswordFormErrors<KeyType>;
  };
  form: {
    firstName: {
      label: KeyType;
      error: KeyType;
    };
    lastName: {
      label: KeyType;
      error: KeyType;
    };
    email: {
      label: KeyType;
    };
    emailConfirmation: {
      label: KeyType;
    };
    password: {
      label: KeyType;
    };
    passwordConfirmation: {
      label: KeyType;
    };
  };
}

interface Address<KeyType> {
  loading: KeyType;
  actions: {
    setAsDefault: {
      isDefault: KeyType;
      actionBtn: KeyType;
      loading: KeyType;
      error: KeyType;
    };
    edit: {
      actionBtn: KeyType;
      confirmBtn: KeyType;
      cancelBtn: KeyType;
    };
    delete: {
      actionBtn: KeyType;
      confirmBtn: KeyType;
      cancelBtn: KeyType;
      confirmationHeader: KeyType;
      confirmation: KeyType;
      loading: KeyType;
      error: KeyType;
    };
    add: {
      actionBtn: KeyType;
      confirmBtn: KeyType;
      cancelBtn: KeyType;
    };
  };
  form: {
    addressName: {
      label: KeyType;
      error: KeyType;
    };
    firstName: {
      label: KeyType;
      error: KeyType;
    };
    lastName: {
      label: KeyType;
      error: KeyType;
    };
    phone: {
      label: KeyType;
      error: KeyType;
    };
    email: {
      label: KeyType;
    };
    countryCode: {
      label: KeyType;
      error: KeyType;
      placeholder: KeyType;
      title: KeyType;
    };
    address1: {
      label: KeyType;
      error: KeyType;
    };
    address2: {
      label: KeyType;
      placeholder: KeyType;
    };
    city: {
      label: KeyType;
      error: KeyType;
    };
    stateCode: {
      label: KeyType;
      error: KeyType;
      placeholder: KeyType;
      title: KeyType;
    };
    postalCode: {
      label: KeyType;
      error: KeyType;
    };
  };
}

interface Item<KeyType> {
  qty: KeyType;
  sku: KeyType;
  actions: {
    addGiftWrap: {
      actionBtn: KeyType;
    };
    addToCart: {
      actionBtn: KeyType;
    };
  };
}

interface Search<KeyType> {
  placeholder: KeyType;
  noResults: {
    text: KeyType;
    suggestions: KeyType[];
    actions: {
      contact: {
        actionBtn: KeyType;
      };
      shopByCategory: {
        actionBtn: KeyType;
      };
    };
  };
  filtered: {
    originalResults: {
      keyword: KeyType;
      noKeyword: KeyType;
    };
    correctedResults: {
      originalSearch: {
        keyword: KeyType;
        noKeyword: KeyType;
      };
      newSearch: KeyType;
    };
  };
}

interface Account<KeyType> {
  actions: {
    signIn: {
      headerCallout: KeyType;
      headerText: KeyType;
      actionBtn: KeyType;
    };
    signOut: {
      actionBtn: KeyType;
    };
    signUp: {
      headerCallout: KeyType;
      promptBtnCallout: KeyType;
      promptBtn: KeyType;
      contactFormHeader: KeyType;
      shippingFormHeader: KeyType;
      actionBtn: KeyType;
      error: KeyType;
    };
    storeAccount: {
      promptText: KeyType;
      confirmBtn: KeyType;
      cancelBtn: KeyType;
      error: KeyType;
    };
    changePassword: {
      headerCallout: KeyType;
      headerText: KeyType;
      actionBtn: KeyType;
      error: KeyType;
    };
    forgotPassword: {
      headerCallout: KeyType;
      instructions: KeyType;
      promptBtn: KeyType;
      actionBtn: KeyType;
      completedBtn: KeyType;
      success: KeyType;
      errors: {
        generic: KeyType;
        email: EmailErrors<KeyType>;
      };
      form: {
        email: {
          label: KeyType;
        };
      };
    };
  };
  orderHistory: {
    needHelp: KeyType;
    noHistory: KeyType;
    updateInterval: KeyType;
    errors: {
      generic: KeyType;
    };
    actions: {
      callSupport: {
        actionBtn: KeyType;
      };
      contact: {
        actionBtn: KeyType;
      };
      reload: {
        actionBtn: KeyType;
      };
      reset: {
        actionBtn: KeyType;
      };
      trackOrder: {
        actionCallout: KeyType;
        actionBtn: KeyType;
        description: KeyType;
        exampleQueries: KeyType;
        queryHelp: KeyType;
      };
    };
    order: {
      shipTo: KeyType;
      date: KeyType;
      status: KeyType;
      total: KeyType;
    };
  };
}

interface Screens<KeyType> {
  editAddresses: ScreenTitle<KeyType>;
  editAddress: ScreenTitle<KeyType> & {
    noId: KeyType;
  };
  newAddress: ScreenTitle<KeyType>;
  editSavedPayments: ScreenTitle<KeyType>;
  account: ScreenTitle<KeyType>;
  changePassword: ScreenTitle<KeyType>;
  forgotPassword: ScreenTitle<KeyType>;
  editPersonal: ScreenTitle<KeyType>;
  emailSignUp: ScreenTitle<KeyType>;
  more: ScreenTitle<KeyType>;
  viewOrders: ScreenTitle<KeyType>;
  trackOrder: ScreenTitle<KeyType>;
  register: ScreenTitle<KeyType>;
  contactUs: ScreenTitle<KeyType>;
  allCategories: ScreenTitle<KeyType>;
  productDetail: ScreenTitle<KeyType> & {
    reviewsTitle: KeyType;
    recentlyViewed: KeyType;
    loadMore: KeyType;
    qa: {
      time: KeyType;
      answer: KeyType;
      noQuestions: KeyType;
    };
  };
  shop: ScreenTitle<KeyType> & {
    shopByCategoryBtn: KeyType;
    shopAllBtn: KeyType;
    shopTopBtn: KeyType;
    viewAllBtn: KeyType;
  };
  pushOptIn: ScreenTitle<KeyType> & {
    header: KeyType;
    description: KeyType;
    actions: {
      optIn: {
        confirmBtn: KeyType;
        cancelBtn: KeyType;
      };
    };
  };
}

interface Cart<KeyType> {
  loading: KeyType;
  cartCount: KeyType;
  notes: {
    missingItems: KeyType;
  };
  emptyCart: KeyType;
  emptyCartDetails: KeyType;
  actions: {
    continueShopping: {
      actionBtn: KeyType;
    };
    checkout: {
      actionBtn: KeyType;
    };
  };
}

interface Payment<KeyType> {
  lastFour: KeyType;
  expiration: KeyType;
  noSavedPayments: KeyType;
  actions: {
    delete: {
      actionBtn: KeyType;
      confirmBtn: KeyType;
      cancelBtn: KeyType;
      confirmationHeader: KeyType;
      confirmationText: KeyType;
      loading: KeyType;
      error: KeyType;
    };
  };
}

interface EmailSignUp<KeyType> {
  actions: {
    subscribe: {
      actionText: KeyType;
      closeBtn: KeyType;
      confirmationCallout: KeyType;
      confirmationText: KeyType;
      error: KeyType;
    };
  };
  form: {
    email: {
      label: KeyType;
      error: KeyType;
    };
  };
}

interface ScreenTitle<KeyType> {
  title: KeyType;
}

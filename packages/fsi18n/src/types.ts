export type NumberLike = number | string | import ('decimal.js').Decimal;

export interface I18n {
  currentLocale: () => string;
  fallbacks?: boolean;
  translations: Translations;
  translate: (scope: I18n.Scope, options?: I18n.TranslateOptions) => string;
}

export interface Translations {
  [locale: string]: TranslationKeys;
}

export interface TranslationKeys {
  [key: string]: TranslationKeys | TranslationKey | object;
}

export type TranslationKey = string | {
  zero?: string;
  one?: string;
  other?: string;
};

export interface FSTranslationKeys<KeyType = TranslationKey> extends TranslationKeys {
  flagship: {
    cart: CartTranslations<KeyType>;
    feedback: FeedbackTranslations<KeyType>;
    changePassword: ChangePasswordTranslations<KeyType>;
    sort: SortTranslations<KeyType>;
    reviews: ReviewsTranslations<KeyType>;
    search: SearchTranslations<KeyType>;
    updateNameOrEmail: UpdateNameOrEmailTranslations<KeyType>;
    zoomCarousel: ZoomCarouselTranslations<KeyType>;
    registration: RegistrationTranslations<KeyType>;
    storeLocator: StoreLocatorTranslations<KeyType>;
    productIndex: ProductIndexTranslations<KeyType>;
    checkout: CheckoutTranslations<KeyType>;
  };
}

export interface PasswordFormErrors<KeyType = TranslationKey> {
  tooShort: KeyType;
  invalid: KeyType;
  mismatch: KeyType;
}

export interface EmailErrors<KeyType = TranslationKey> {
  missing: KeyType;
  mismatch: KeyType;
  invalid: KeyType;
}

export interface CartTranslations<KeyType> {
  isEmpty: KeyType;
  actions: {
    add: {
      actionBtn: KeyType;
    };
    remove: {
      actionBtn: KeyType;
    };
  };
  item: {
    unitPrice: KeyType;
    totalPrice: KeyType;
  };
  summary: {
    subtotal: {
      defaultValue: KeyType;
      text: KeyType;
    };
    tax: {
      defaultValue: KeyType;
      text: KeyType;
    };
    shipping: {
      defaultValue: KeyType;
      text: KeyType;
    };
    total: {
      defaultValue: KeyType;
      text: KeyType;
    };
  };
}

export interface FeedbackTranslations<KeyType> {
  actions: {
    submit: {
      actionBtn: KeyType;
      cancelBtn: KeyType;
      success: KeyType;
      failure: KeyType;
    };
  };
  title: KeyType;
  form: {
    email: {
      label: KeyType;
      placeholder: KeyType;
      error: KeyType;
    };
    feedback: {
      label: KeyType;
      error: KeyType;
    };
  };
}

export interface ChangePasswordTranslations<KeyType> {
  actions: {
    submit: {
      actionBtn: KeyType;
    };
  };
  form: {
    errors: {
      password: PasswordFormErrors<KeyType>;
    };
    currentPassword: {
      label: KeyType;
    };
    newPassword: {
      label: KeyType;
    };
    confirmPassword: {
      label: KeyType;
    };
  };
}

export interface SortTranslations<KeyType> {
  actions: {
    refine: {
      actionBtn: KeyType;
    };
    filter: {
      actionBtn: KeyType;
    };
    sort: {
      actionBtn: KeyType;
    };
  };
}

export interface ReviewsTranslations<KeyType> {
  verified: KeyType;
  helpful: KeyType;
  notHelpful: KeyType;
  helpfulCount: KeyType;
  recommendCount: KeyType;
  recommended: KeyType;
  notRecommended: KeyType;
}

export interface SearchTranslations<KeyType> {
  recentSearches: KeyType;
  actions: {
    clear: {
      actionBtn: KeyType;
      accessibility: KeyType;
    };
  };
}

export interface UpdateNameOrEmailTranslations<KeyType> {
  actions: {
    submit: {
      actionBtn: KeyType;
    };
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
    emailAddress: {
      label: KeyType;
      error: EmailErrors<KeyType>;
    };
    password: {
      label: KeyType;
      error: PasswordFormErrors<KeyType>;
    };
  };
}

export interface ZoomCarouselTranslations<KeyType> {
  actions: {
    close: {
      actionBtn: KeyType;
    };
    share: {
      actionBtn: KeyType;
    };
    fullscreen: {
      actionBtn: KeyType;
    };
    zoom: {
      actionBtn: KeyType;
    };
    next: {
      actionBtn: KeyType;
    };
    prev: {
      actionBtn: KeyType;
    };
  };
}

export interface RegistrationTranslations<KeyType> {
  actions: {
    submit: {
      actionBtn: KeyType;
    };
  };
  errors: {
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
    emailAddress: {
      label: KeyType;
      error: EmailErrors<KeyType>;
    };
    password: {
      label: KeyType;
    };
    confirmPassword: {
      label: KeyType;
    };
  };
}

export interface StoreLocatorTranslations<KeyType> {
  searchPlaceholder: KeyType;
  actions: {
    showList: {
      actionBtn: KeyType;
    };
    searchArea: {
      actionBtn: KeyType;
    };
  };
}

export interface ProductIndexTranslations<KeyType> {
  cancel: KeyType;
  filterBy: KeyType;
  noResults: KeyType;
  resetFilters: KeyType;
  loadMore: KeyType;
}

export interface CheckoutTranslations<KeyType> {
  continue: KeyType;
  shipping: {
    select: KeyType;
  };
  summary: {
    total: KeyType;
  };
}

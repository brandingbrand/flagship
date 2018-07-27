/* tslint:disable:max-line-length  ter-max-len */

import { ProjectTranslationKeys } from './types';
import { translationAssets } from '@brandingbrand/fsi18n';

const { emailErrors, passwordErrors } = translationAssets.en;

const commonFormFields = {
  firstName: {
    label: 'First Name',
    error: 'First Name is required'
  },
  lastName: {
    label: 'Last Name',
    error: 'Last Name is required'
  },
  email: {
    label: 'Email'
  }
};

const commonButtons = {
  add: 'Add',
  cancel: 'Cancel',
  save: 'Save',
  ok: 'OK',
  edit: 'Edit',
  delete: 'Delete',
  back: 'Back',
  reset: 'Reset',
  signUp: 'Sign Up',
  signIn: 'Sign In',
  signOut: 'Sign Out',
  contact: 'Contact Us',
  retry: 'Try again?',
  shopByCategory: 'Shop By Category'
};

export const en: ProjectTranslationKeys = {
  formPlaceholders: {
    required: 'Required',
    optional: 'Optional'
  },
  contactInfo: {
    notes: {
      callout: 'Note',
      email: 'Your email address will be your login ID.'
    },
    actions: {
      save: {
        actionBtn: commonButtons.save
      },
      cancel: {
        actionBtn: commonButtons.cancel
      }
    },
    errors: {
      email: emailErrors,
      password: passwordErrors
    },
    form: {
      ...commonFormFields,
      emailConfirmation: {
        label: 'Verify Email'
      },
      password: {
        label: 'Password'
      },
      passwordConfirmation: {
        label: 'Verify Password'
      }
    }
  },
  address: {
    loading: 'Loading your addresses...',
    actions: {
      setAsDefault: {
        isDefault: 'Default',
        actionBtn: 'Set as Default',
        loading: 'Saving address as default',
        error: 'Unable to set default address'
      },
      edit: {
        actionBtn: commonButtons.edit,
        confirmBtn: commonButtons.save,
        cancelBtn: commonButtons.cancel
      },
      delete: {
        actionBtn: commonButtons.delete,
        confirmBtn: commonButtons.ok,
        cancelBtn: commonButtons.cancel,
        confirmationHeader: 'Delete Address',
        confirmation: 'Are you sure you want to delete this address?',
        loading: 'Deleting an address...',
        error: 'Unable to delete address'
      },
      add: {
        actionBtn: 'Add New Address',
        confirmBtn: commonButtons.save,
        cancelBtn: commonButtons.cancel
      }
    },
    form: {
      ...commonFormFields,
      addressName: {
        label: 'Address Nickname',
        error: 'Address Nickname is required'
      },
      phone: {
        label: 'Phone Number',
        error: 'Phone Number is required'
      },
      email: {
        label: 'Email'
      },
      countryCode: {
        label: 'Country',
        error: 'Country is required',
        placeholder: 'Select Country',
        title: 'Select Country'
      },
      address1: {
        label: 'Address 1',
        error: 'Address 1 is required'
      },
      address2: {
        label: 'Address 2',
        placeholder: `Optional (e.g. Apt #, Suite #)`
      },
      city: {
        label: 'City',
        error: 'City is required'
      },
      stateCode: {
        label: 'State',
        error: 'State is required',
        placeholder: 'Select State',
        title: 'Select State'
      },
      postalCode: {
        label: 'Zip/Postal Code',
        error: 'Zip/Postal Code is required'
      }
    }
  },
  item: {
    sku: 'SKU',
    qty: 'Qty',
    actions: {
      addGiftWrap: {
        actionBtn: 'Add Gift Wrap'
      },
      addToCart: {
        actionBtn: 'Add to Cart'
      }
    }
  },
  search: {
    placeholder: 'Search',
    noResults: {
      text: 'We found 0 results for {{keyword}}',
      suggestions: [
        'Try entering different keywords',
        'Try entering more generic keywords',
        'Try browsing by category'
      ],
      actions: {
        contact: {
          actionBtn: commonButtons.contact
        },
        shopByCategory: {
          actionBtn: commonButtons.shopByCategory
        }
      }
    },
    filtered: {
      originalResults: {
        keyword: {
          one: '{{count}} item for {{keyword}}',
          other: '{{count}} items for {{keyword}}'
        },
        noKeyword: {
          one: '{{count}} item',
          other: '{{count}} items'
        }
      },
      correctedResults: {
        originalSearch: {
          keyword: 'Search for {{keyword}} returned 0 matches',
          noKeyword: 'Search return 0 matches'
        },
        newSearch: {
          one: 'Showing 1 result for {{keyword}}',
          other: 'Showing {{count}} results for {{keyword}}'
        }
      }
    }
  },
  account: {
    actions: {
      signIn: {
        headerCallout: commonButtons.signIn,
        headerText: 'To check out fast and secure, see your purchase history, and customize your experience.',
        actionBtn: commonButtons.signIn
      },
      signOut: {
        actionBtn: commonButtons.signOut
      },
      signUp: {
        headerCallout: commonButtons.signUp,
        promptBtnCallout: 'New?',
        promptBtn: commonButtons.signUp,
        actionBtn: 'Create Account',
        contactFormHeader: 'Contact Information',
        shippingFormHeader: 'Primary Shipping Address',
        error: 'There was a problem creating your account. Please try again later.'
      },
      storeAccount: {
        promptText: 'Do you want to allow this app to store your credentials?',
        confirmBtn: commonButtons.ok,
        cancelBtn: 'Don\'t Allow',
        error: 'We were unable to store your credentials.'
      },
      changePassword: {
        headerCallout: 'Change Password',
        headerText: 'Your current password has either expired or been reset. Please enter a new password below.',
        actionBtn: 'Change Password',
        error: 'Unable to change your password. Please try again later.'
      },
      forgotPassword: {
        headerCallout: 'Forgot Password?',
        instructions: 'Enter your email address below to reset your password.',
        promptBtn: 'Forgot your password?',
        actionBtn: 'Reset Password',
        completedBtn: commonButtons.back,
        success: 'A temporary password has been sent to your email address. Please use the password to log in to your account.',
        errors: {
          generic: 'Unable to reset your password. Please try again later.',
          email: emailErrors
        },
        form: {
          email: {
            label: 'Email'
          }
        }
      }
    },
    orderHistory: {
      needHelp: 'Questions about your order?',
      noHistory: 'You don\'t have any recent orders.',
      updateInterval: 'Order status information is updated hourly, however shipment tracking information may not be available from the carrier for 12 to 24 hours after an order has shipped.\n\nIf you are unable to locate your order, or need further assistance, please contact us or call us. You may also sign into your account to acccess your complete order history.',
      errors: {
        generic: 'We were unable to retrieve your order history. Please try again later.'
      },
      actions: {
        callSupport: {
          actionBtn: 'Call {{phone}}'
        },
        contact: {
          actionBtn: commonButtons.contact
        },
        reload: {
          actionBtn: commonButtons.retry
        },
        reset: {
          actionBtn: commonButtons.reset
        },
        trackOrder: {
          actionCallout: 'To view the status of any of your orders',
          actionBtn: 'Track Order',
          description: 'To view the status of any of your recent orders, please fill in the fields below. For Security purposes you are required to provide two pieces of information pertaining to your order.\n\nPlease enter one of the information choices in each field and click the View Orders button.',
          exampleQueries: 'e.g. Internet Confirmation, Order Confirmation, Invoice Number.',
          queryHelp: 'Where can I find these numbers?'
        }
      },
      order: {
        shipTo: 'Ship to',
        date: 'Order Date',
        status: 'Status',
        total: 'Order Total'
      }
    }
  },
  screens: {
    editAddresses: {
      title: 'Edit Addresses'
    },
    editAddress: {
      title: 'Edit {{address}}',
      noId: 'Edit Address'
    },
    newAddress: {
      title: 'New Address'
    },
    editSavedPayments: {
      title: 'Edit Payments'
    },
    account: {
      title: 'Account'
    },
    changePassword: {
      title: 'Change Password'
    },
    forgotPassword: {
      title: 'Forgot Password'
    },
    editPersonal: {
      title: 'Edit Personal Info'
    },
    emailSignUp: {
      title: 'Email Sign Up'
    },
    more: {
      title: 'More'
    },
    viewOrders: {
      title: 'View Orders'
    },
    trackOrder: {
      title: 'Track Order'
    },
    register: {
      title: 'Sign Up'
    },
    contactUs: {
      title: 'Contact Us'
    },
    allCategories: {
      title: 'All Categories'
    },
    productDetail: {
      title: 'Product Details',
      reviewsTitle: 'Details',
      recentlyViewed: 'Recently Viewed',
      loadMore: 'Load More',
      qa: {
        time: '{{time}} ago',
        answer: {
          one: 'answer',
          other: 'answers'
        },
        noQuestions: 'No questions have been asked yet.'
      }
    },
    pushOptIn: {
      title: 'Push Notifications',
      header: 'Be the First',
      description: 'to know about deals, exclusives, and more.',
      actions: {
        optIn: {
          confirmBtn: 'Allow Notifications',
          cancelBtn: 'Maybe Later'
        }
      }
    },
    shop: {
      title: 'Shop',
      shopByCategoryBtn: commonButtons.shopByCategory,
      shopTopBtn: 'Shop Top Categories',
      shopAllBtn: 'Shop All Categories',
      viewAllBtn: 'View All'
    }
  },
  cart: {
    loading: '{{verb}} your cart...',
    cartCount: 'Cart ({{count}})',
    notes: {
      missingItems: 'If you feel that you are missing items from your cart, make sure you sign in to your account to retrieve any saved orders.'
    },
    emptyCart: 'Your cart is empty',
    emptyCartDetails: 'If you see something you would like to add to your cart when shopping, tap Add to Cart.',
    actions: {
      continueShopping: {
        actionBtn: 'Continue Shopping'
      },
      checkout: {
        actionBtn: 'Checkout'
      }
    }
  },
  payment: {
    lastFour: 'Card ending with {{lastFour}}',
    expiration: 'Expires {{month}}/{{year}}',
    noSavedPayments: 'No saved payments',
    actions: {
      delete: {
        actionBtn: commonButtons.delete,
        confirmBtn: commonButtons.ok,
        cancelBtn: commonButtons.cancel,
        confirmationHeader: 'Delete Payment Method',
        confirmationText: 'Are you sure you want to delete this payment method?',
        loading: 'Deleting payment method...',
        error: 'Unable to delete payment'
      }
    }
  },
  emailSignUp: {
    actions: {
      subscribe: {
        actionText: commonButtons.signUp,
        closeBtn: 'Done',
        confirmationCallout: 'Thank You!',
        confirmationText: 'You are now signed up to receive email offers!',
        error: 'An error occurred. Please try your request again later.'
      }
    },
    form: {
      email: {
        label: commonFormFields.email.label,
        error: emailErrors.invalid
      }
    }
  }
};

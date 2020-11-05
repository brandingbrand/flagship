import { EmailErrors, FSTranslationKeys, PasswordFormErrors } from '../types';

export const passwordErrors: PasswordFormErrors = {
  tooShort: 'Password should have at least {{minCharacters}} characters',
  invalid: 'Password is missing or invalid',
  mismatch: 'Passwords must match'
};

export const emailErrors: EmailErrors = {
  missing: 'Email is required',
  mismatch: 'Email addresses do not match',
  invalid: 'Please enter a valid email address'
};

export const keys: FSTranslationKeys = {
  flagship: {
    alertDefaults: {
      ok: 'OK',
      cancel: 'Cancel'
    },
    addressForm: {
      firstName: 'First Name',
      firstNameError: 'Please enter the first name',
      lastName: 'Last Name',
      lastNameError: 'Please enter the last name',
      address1: 'Address Line 1',
      address1Error: 'Please enter the address',
      address2: 'Address Line 2',
      city: 'City',
      cityError: 'Please enter the city',
      postal: 'Zip Code',
      postalError: 'Please enter a valid zip code',
      state: 'State',
      stateError: 'Please enter the state',
      phone: 'Phone',
      phoneError: 'Please enter a valid phone number',
      email: 'Email',
      emailError: 'Please enter a valid email address',
      poBox: 'Check if this is P.O Box',
      submit: 'Submit'
    },
    cart: {
      isEmpty: 'Empty Cart',
      itemsInCart: 'Items In Your Cart',
      error: 'Quantity and VariantID must be defined to add to cart',
      moveToWishlist: 'Move to Wishlist',
      outOfStock: 'Out of Stock',
      actions: {
        add: {
          actionBtn: 'Add to Cart'
        },
        remove: {
          actionBtn: 'Remove'
        }
      },
      digitalWallet: {
        appleError: 'Apple Pay was unable to complete your request.'
      },
      item: {
        unitPrice: 'Unit Price',
        totalPrice: 'Total Price'
      },
      summary: {
        subtotal: {
          defaultValue: 'TBD',
          text: 'Subtotal'
        },
        tax: {
          defaultValue: 'TBD',
          text: 'Estimated Tax'
        },
        shipping: {
          defaultValue: 'TBD',
          text: 'Estimated Shipping'
        },
        total: {
          defaultValue: 'TBD',
          text: 'Estimated Total'
        }
      }
    },
    filterListDefaults: {
      clearAll: 'Clear All',
      done: 'Done',
      all: 'All',
      reset: 'RESET',
      apply: 'APPLY',
      hintToggle: 'Toggles Filter',
      hintBack: 'Go back one filter level'
    },
    feedback: {
      actions: {
        submit: {
          actionBtn: 'Submit Feedback',
          success: 'Thank you for your feedback.',
          failure: 'An error has occurred. Please try again later.',
          cancelBtn: 'Close'
        }
      },
      title: 'Report a Site Issue',
      form: {
        email: {
          label: 'Email',
          placeholder: 'john.doe@example.com',
          error: 'Please provide a valid email address'
        },
        feedback: {
          label: 'How can we improve your experience on this site?',
          error: 'Please provide feedback about your visit'
        }
      }
    },
    changePassword: {
      actions: {
        submit: {
          actionBtn: 'Submit'
        }
      },
      form: {
        errors: {
          password: passwordErrors
        },
        currentPassword: {
          label: '*Current Password'
        },
        newPassword: {
          label: '*New Password'
        },
        confirmPassword: {
          label: '*Confirm Password'
        }
      }
    },
    sort: {
      actions: {
        refine: {
          actionBtn: 'Refine'
        },
        filter: {
          actionBtn: 'Filter'
        },
        sort: {
          actionBtn: 'Sort'
        }
      }
    },
    reviews: {
      indicatorDefault: 'out of 5 stars',
      verified: 'Verified Purchase',
      helpful: 'Helpful',
      notHelpful: 'Not Helpful',
      helpfulCount: {
        zero: '',
        one: 'One person found this helpful',
        other: '{{count}} people found this helpful'
      },
      recommendCount: '{{recommendPercent}}% of respondents would recommend this to a friend',
      recommended: 'Yes, I recommend this product.',
      notRecommended: 'No, I do not reccommend this product.',
      syndicatedLabel: 'Originally posted on {{site}}'
    },
    search: {
      recentSearches: 'RECENT SEARCHES',
      actions: {
        clear: {
          actionBtn: 'Clear',
          accessibility: 'Clear Recent Search'
        },
        search: {
          accessibilityLabel: 'Search and return results for {{value}}'
        }
      }
    },
    updateNameOrEmail: {
      actions: {
        submit: {
          actionBtn: 'Submit'
        }
      },
      form: {
        firstName: {
          label: '*First Name',
          error: 'Please enter your first name'
        },
        lastName: {
          label: '*Last Name',
          error: 'Please enter your last name'
        },
        emailAddress: {
          label: '*Email Address',
          error: emailErrors
        },
        password: {
          label: '*Password',
          error: passwordErrors
        }
      }
    },
    zoomCarousel: {
      actions: {
        close: {
          actionBtn: 'Close (Esc)'
        },
        share: {
          actionBtn: 'Share'
        },
        fullscreen: {
          actionBtn: 'Toggle fullscreen'
        },
        zoom: {
          actionBtn: 'Zoom in/out'
        },
        prev: {
          actionBtn: 'Previous (arrow left)'
        },
        next: {
          actionBtn: 'Next (arrow right)'
        },
        focus: {
          actionBtn: 'Focus item in carousel'
        }
      }
    },
    promoForm: {
      enterPromo: 'Enter Promo Code',
      error: 'Please enter a valid promo code'
    },
    registration: {
      actions: {
        submit: {
          actionBtn: 'Submit'
        }
      },
      errors: {
        password: passwordErrors
      },
      form: {
        firstName: {
          label: '*First Name',
          error: 'Please enter your first name'
        },
        lastName: {
          label: '*Last Name',
          error: 'Please enter your last name'
        },
        emailAddress: {
          label: '*Email Address',
          error: emailErrors
        },
        password: {
          label: '*Password'
        },
        confirmPassword: {
          label: '*Confirm Password'
        }
      }
    },
    storeLocator: {
      searchPlaceholder: 'Search by City, State, or Zip',
      actions: {
        showList: {
          actionBtn: 'Show List'
        },
        searchArea: {
          actionBtn: 'Search This Area'
        }
      }
    },
    moreText: {
      readMore: 'Read More',
      readLess: 'Read Less'
    },
    productIndex: {
      cancel: 'Cancel',
      filterBy: 'Filter By',
      noResults: 'Sorry, no items matched your search.',
      resetFilters: 'RESET FILTER',
      loadMore: 'Load More',
      addToBag: 'Add To Bag'
    },
    checkout: {
      continue: 'Continue',
      shipping: {
        select: 'Select a Shipping Method'
      },
      summary: {
        total: 'Total'
      },
      creditCardForm: {
        name: 'Name',
        nameError: 'Please Enter Your Name',
        numberLabel: 'Card Number',
        numberPlaceholder: 'Credit Card Number',
        numberError: 'invalid card number entered',
        cscPlaceholder: 'CSC',
        cscError: 'Invalid CSC',
        expirationLabel: 'Exp. Date',
        expirationPlaceholder: 'Exp. Date (MM/YY)',
        expirationError: 'Invalid MM/YY'
      }
    },
    applePayButton: {
      text: 'Pay With Apple Pay'
    },
    payPalButton: {
      defaultTitle: 'Checkout',
      defaultTagLine: 'The safer, easier way to pay'
    },
    step: {
      announcements: {
        stepCompleted: 'Step Completed.'
      }
    },
    selector: {
      close: 'Close',
      select: 'Select'
    },
    multiCarousel: {
      prevBtn: 'Show previous',
      nextBtn: 'Show next'
    },
    shareButton: {
      text: 'Click To Share',
      copied: 'URL copied to clipboard',
      notCopied: 'Unable to copy the URL to the clipboard',
      notSupported: 'Message sharing is not supported by your browser.'
    },
    loginForm: {
      email: 'Email',
      emailReq: 'Email is required',
      emailNotValid: ' is not an valid email',
      emailError: 'Please enter a valid email',
      password: 'Password',
      passwordError: 'Please enter your password',
      submit: 'Submit'
    },
    emailForm: {
      placeholder: 'Email',
      error: 'Required Field'
    },
    button: {
      apply: 'Apply'
    }
  }
};

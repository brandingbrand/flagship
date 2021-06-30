export function createElement() {
  return {
    setAttribute: function() {},
    pathname: '',
    style: {},
    nodeType: 1
  };
};

export function querySelector() {
  return null;
};

export function getElementById() {
  return {
    setAttribute: function() {},
    pathname: '',
    style: {}
  };
};

export const body = document.body || {
  appendChild: function() {}
};

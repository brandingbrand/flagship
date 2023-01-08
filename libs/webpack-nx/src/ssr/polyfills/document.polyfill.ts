export = {
  createElement: () => ({
    setAttribute: () => {},
    pathname: '',
    style: {},
    nodeType: 1,
    classList: new Set(),
  }),
  querySelector: () => null,
  getElementById: () => ({
    setAttribute: () => {},
    pathname: '',
    style: {},
  }),
  body: {
    appendChild: () => {},
  },
  head: {
    querySelectorAll: () => [],
    append: () => {},
  },
  addEventListener: () => {},
  getElementsByClassName: () => [],
};

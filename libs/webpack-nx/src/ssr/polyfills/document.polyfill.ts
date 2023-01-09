export = {
  createElement: () => ({
    setAttribute: () => {},
    pathname: '',
    style: {},
    nodeType: 1,
    classList: new Set(),
    sheet: {
      rules: [] as string[],
      insertRule(rule: string, index?: number) {
        if (index !== undefined) {
          this.rules[index] = rule;
        } else {
          this.rules.push(rule);
        }
      },
    },
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

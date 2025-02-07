module.exports = function ({types: t}) {
  return {
    visitor: {
      JSXElement(path) {
        const openingElement = path.node.openingElement;

        const fsHideAttribute = openingElement.attributes.find(
          attr => t.isJSXAttribute(attr) && attr.name.name === 'data-hide',
        );

        if (fsHideAttribute) {
          const conditional = fsHideAttribute.value.expression;

          openingElement.attributes = openingElement.attributes.filter(
            attr => !(t.isJSXAttribute(attr) && attr.name.name === 'data-hide'),
          );

          path.replaceWith(
            t.logicalExpression(
              '||',
              conditional,
              t.jsxElement(
                t.jsxOpeningElement(
                  openingElement.name,
                  openingElement.attributes,
                ),
                path.node.closingElement,
                path.node.children,
              ),
            ),
          );
        }
      },
    },
  };
};

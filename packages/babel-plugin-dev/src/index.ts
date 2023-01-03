import { join } from 'path';

export default (api: any) => {
  const {
    types: t
  } = api;

  const isRootComponent = (path: any) => {
    return path.parent.type !== "JSXElement" && path.node.openingElement.name.name !== "Dev";
  };

  const isScreenComponent = (state: any) => {
    const screensDir = join(state.opts.project, state.opts.screens);

    if (!!state.opts.devScreens) {
      const devScreensDir = join(state.opts.project, state.opts.screens, state.opts.devScreens);
      return state.filename.includes(screensDir) && !state.filename.includes(devScreensDir);
    } else {
      return state.filename.includes(screensDir)
    }
  }

  return {
    visitor: {
      Program(path: any, state: any) {
        if (isScreenComponent(state)) {
          const identifier = t.identifier("Dev");
          const importSpecifier = t.importDefaultSpecifier(identifier);
          const importDeclaration = t.importDeclaration([importSpecifier], t.stringLiteral("@brandingbrand/kernel-component-dev"));

          path.unshiftContainer("body", importDeclaration);

          if (!!state.opts.devScreens) {
            const DevScreensIdentifier = t.identifier('DevScreens');
            const DevScreensSpecifier = t.importDefaultSpecifier(DevScreensIdentifier);
            const DevScreensImportDeclaration = t.importDeclaration([DevScreensSpecifier], t.stringLiteral(`./${state.opts.devScreens}`));
            path.unshiftContainer("body", DevScreensImportDeclaration);
          }
        }
      },
      JSXElement(path: any, state: any) {
        if (isRootComponent(path) && isScreenComponent(state)) {
          const versionIdentifier = t.jsxIdentifier("version");
          const versionAttribute = t.jsxAttribute(versionIdentifier, t.stringLiteral(state.opts.version ?? ''));

          const projectDevMenusIdentifier = t.jsxIdentifier("projectDevMenus");
          const projectDevMenusExpression = t.jsxExpressionContainer(!!state.opts.devScreens ? t.identifier('DevScreens') : t.arrayExpression());
          const projectDevMenusAttribute = t.jsxAttribute(projectDevMenusIdentifier, projectDevMenusExpression);

          path.replaceWith(t.jsxElement(t.jsxOpeningElement(t.jsxIdentifier("Dev"), [versionAttribute, projectDevMenusAttribute]), t.jsxClosingElement(t.jsxIdentifier("Dev")), [path.node]));
        }
      }
    }
  };
};

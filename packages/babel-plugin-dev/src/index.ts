import  PathModule from 'path';

export default (api: any) => {
  const {
    types: t
  } = api;

  const isRootComponent = (path: any) => {
    return path.parent.type !== "JSXElement" && path.node.openingElement.name.name !== "DevMenuWrapper";
  };

  const isScreenComponent = (state: any) => {
    const screensDir = PathModule.join(state.opts.project, state.opts.screensDirectory);

    if (!!state.opts.projectDevMenusDirectory) {
      const projectDevMenusDir = PathModule.join(state.opts.project, state.opts.screensDirectory, state.opts.projectDevMenusDirectory);
      return state.filename.includes(screensDir) && !state.filename.includes(projectDevMenusDir);
    } else {
      return state.filename.includes(screensDir)
    }
  }

  return {
    visitor: {
      Program(path: any, state: any) {
        if (isScreenComponent(state)) {
          const identifier = t.identifier("DevMenuWrapper");
          const importSpecifier = t.importSpecifier(identifier, identifier);
          const importDeclaration = t.importDeclaration([importSpecifier], t.stringLiteral("fsdev"));

          path.unshiftContainer("body", importDeclaration);

          if (!!state.opts.projectDevMenusDirectory) {
            const projectDevMenusIdentifier = t.identifier('ProjectDevMenus');
            const projectDevMenusSpecifier = t.importDefaultSpecifier(projectDevMenusIdentifier);
            const projectDevMenusImportDeclaration = t.importDeclaration([projectDevMenusSpecifier], t.stringLiteral(`./${state.opts.projectDevMenusDirectory}`));
            path.unshiftContainer("body", projectDevMenusImportDeclaration);
          }
        }
      },
      JSXElement(path: any, state: any) {
        if (isRootComponent(path) && isScreenComponent(state)) {
          const versionIdentifier = t.jsxIdentifier("version");
          const versionAttribute = t.jsxAttribute(versionIdentifier, t.stringLiteral(state.opts.version ?? ''));

          const projectDevMenusIdentifier = t.jsxIdentifier("projectDevMenus");
          const projectDevMenusExpression = t.jsxExpressionContainer(!!state.opts.projectDevMenusDirectory ? t.identifier('ProjectDevMenus') : t.arrayExpression());
          const projectDevMenusAttribute = t.jsxAttribute(projectDevMenusIdentifier, projectDevMenusExpression);

          path.replaceWith(t.jsxElement(t.jsxOpeningElement(t.jsxIdentifier("DevMenuWrapper"), [versionAttribute, projectDevMenusAttribute]), t.jsxClosingElement(t.jsxIdentifier("DevMenuWrapper")), [path.node]));
        }
      }
    }
  };
};
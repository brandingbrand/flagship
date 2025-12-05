import * as path from 'path';
import * as fs from 'fs';
import * as fsp from 'fs/promises';

import * as TS from 'typescript';

const args = process.argv.slice(2);
const newVersion = args[0]!;

// ensure new version follows `0.xx` format
if (!newVersion || !/^0\.\d+$/.test(newVersion)) {
  throw new Error(
    `Invalid version format: ${newVersion}. Expected format is '0.x' (e.g., '0.81')`,
  );
}

function findNode<T extends TS.Node>(
  node: TS.Node,
  predicate: (n: TS.Node) => n is T,
): T | undefined {
  if (predicate(node)) return node;
  let result: T | undefined;
  TS.forEachChild(node, child => {
    if (!result) result = findNode(child, predicate);
  });
  return result;
}

const stripTypeCasts = (node: TS.Node) => {
  let expression = node;
  while (
    (expression && TS.isAsExpression(expression)) ||
    TS.isSatisfiesExpression(expression)
  ) {
    expression = expression.expression;
  }
  return expression;
};

async function updateTSFile(
  filePath: string,
  targetName: string,
  getInsertion: (
    sourceFile: TS.SourceFile,
    content: string,
  ) => {pos: number; str: string; exists: boolean},
) {
  try {
    const content = await fsp.readFile(filePath, 'utf-8');
    const sourceFile = TS.createSourceFile(
      filePath,
      content,
      TS.ScriptTarget.Latest,
      true,
    );

    const {pos, str, exists} = getInsertion(sourceFile, content);

    if (exists) {
      console.log(`Version ${newVersion} already exists in ${targetName}.`);
    } else if (pos > -1) {
      const newContent = content.slice(0, pos) + str + content.slice(pos);
      await fsp.writeFile(filePath, newContent);
      console.log(`Updated ${targetName} with version ${newVersion}`);
    } else {
      console.error(`Could not find ${targetName}.`);
    }
  } catch (error) {
    console.error(`Error updating ${targetName}:`, error);
    process.exit(1);
  }
}

function updateConfigTypes() {
  return updateTSFile(
    path.resolve(process.cwd(), './packages/cli-kit/src/@types/config.ts'),
    "AlignDepsOptions['profile'] union type",
    sourceFile => {
      const typeAlias = findNode(
        sourceFile,
        (n): n is TS.TypeAliasDeclaration =>
          TS.isTypeAliasDeclaration(n) && n.name.text === 'AlignDepsOptions',
      );
      const profile =
        typeAlias &&
        TS.isTypeLiteralNode(typeAlias.type) &&
        typeAlias.type.members.find(
          (m): m is TS.PropertySignature =>
            TS.isPropertySignature(m) &&
            TS.isIdentifier(m.name) &&
            m.name.text === 'profile',
        );

      if (!profile || !profile.type || !TS.isUnionTypeNode(profile.type)) {
        return {pos: -1, str: '', exists: false};
      }

      const exists = profile.type.types.some(
        t =>
          TS.isLiteralTypeNode(t) &&
          TS.isStringLiteral(t.literal) &&
          t.literal.text === newVersion,
      );

      return {
        pos: exists
          ? -1
          : profile.type.types[profile.type.types.length - 1]!.end,
        str: `\n    | '${newVersion}'`,
        exists,
      };
    },
  );
}

function updateMessagingConstants() {
  return updateTSFile(
    path.resolve(process.cwd(), './packages/cli/src/ui/constants/messaging.ts'),
    'RN_PROFILE_CHOICES array',
    (sourceFile, content) => {
      const varDecl = findNode(
        sourceFile,
        (n): n is TS.VariableDeclaration =>
          TS.isVariableDeclaration(n) &&
          TS.isIdentifier(n.name) &&
          n.name.text === 'constants',
      );
      const objLit =
        varDecl?.initializer && stripTypeCasts(varDecl.initializer);
      const prop =
        objLit &&
        TS.isObjectLiteralExpression(objLit) &&
        objLit.properties.find(
          (p): p is TS.PropertyAssignment =>
            TS.isPropertyAssignment(p) &&
            TS.isIdentifier(p.name) &&
            p.name.text === 'RN_PROFILE_CHOICES',
        );
      const arrLit =
        prop && prop.initializer && stripTypeCasts(prop.initializer);

      if (!arrLit || !TS.isArrayLiteralExpression(arrLit)) {
        return {pos: -1, str: '', exists: false};
      }

      const exists = arrLit.elements.some(
        e => TS.isStringLiteral(e) && e.text === newVersion,
      );
      if (exists) return {pos: -1, str: '', exists: true};

      const last = arrLit.elements[arrLit.elements.length - 1]!;
      const commaMatch = content.slice(last.end, arrLit.end).match(/^\s*,/);

      return {
        pos: commaMatch ? last.end + commaMatch[0].length : last.end,
        str: commaMatch ? `\n    '${newVersion}',` : `,\n    '${newVersion}',`,
        exists: false,
      };
    },
  );
}

async function createShellDependenciesProfile() {
  const profilePath = path.resolve(
    process.cwd(),
    `./packages/plugin-verify-dependencies/src/profile/${newVersion}.ts`,
  );
  const relPath = path.relative(process.cwd(), profilePath);
  if (fs.existsSync(profilePath)) {
    console.log(
      `Dependency profile for version ${newVersion} already exists at ${relPath}`,
    );
    return;
  }

  const lastVersionNum = parseInt(newVersion.split('.')[1]!, 10) - 1;
  const lastVersion = `0.${lastVersionNum}`;
  const lastVersionProfileIdent = `profile${lastVersion.replaceAll('.', '')}`;

  if (
    !fs.existsSync(
      path.resolve(
        process.cwd(),
        `./packages/plugin-verify-dependencies/src/profile/${lastVersion}.ts`,
      ),
    )
  ) {
    console.warn('-------------------------------');
    console.warn(
      `WARNING: Base dependency profile for version '${lastVersion}' does not exist. Avoid skipping react-native versions when adding new version support.`,
    );
    console.warn('-------------------------------');
  }

  const content = `import type {DependencyProfile} from '../types';

import {default as ${lastVersionProfileIdent}} from './${lastVersion}';

export default {
  ...${lastVersionProfileIdent},
} satisfies Record<string, DependencyProfile>;
`;

  await fsp.writeFile(profilePath, content, 'utf-8');
  console.log(`Created shell dependency profile at ${relPath}`);
}

async function updateDependencyProfilesIndex() {
  const indexPath = path.resolve(
    process.cwd(),
    './packages/plugin-verify-dependencies/src/profile/index.ts',
  );

  const newVersionProfileIdent = `profile${newVersion.replaceAll('.', '')}`;

  await updateTSFile(indexPath, 'Defined Profiles', (sourceFile, content) => {
    const lastImport = [...sourceFile.statements]
      .reverse()
      .find(TS.isImportDeclaration);

    if (!lastImport) {
      return {pos: 0, str: '', exists: false};
    }

    const importPath = `./${newVersion}`;
    const exists = sourceFile.statements.some(
      s =>
        TS.isImportDeclaration(s) &&
        TS.isStringLiteral(s.moduleSpecifier) &&
        s.moduleSpecifier.text === importPath,
    );

    return {
      pos: exists ? -1 : lastImport.end,
      str: `\nimport ${newVersionProfileIdent} from '${importPath}';`,
      exists,
    };
  });

  await updateTSFile(
    indexPath,
    'Defined Profiles Object',
    (sourceFile, content) => {
      const varDecl = findNode(
        sourceFile,
        (n): n is TS.VariableDeclaration =>
          TS.isVariableDeclaration(n) &&
          TS.isIdentifier(n.name) &&
          n.name.text === 'profiles',
      );
      const objLit =
        varDecl?.initializer && stripTypeCasts(varDecl.initializer);

      console.log('VAR DECL', varDecl, objLit, objLit);
      if (!objLit || !TS.isObjectLiteralExpression(objLit)) {
        return {pos: -1, str: '', exists: false};
      }

      const exists = objLit.properties.some(
        p =>
          TS.isPropertyAssignment(p) &&
          TS.isStringLiteral(p.name) &&
          p.name.text === newVersion,
      );

      if (exists) return {pos: -1, str: '', exists: true};

      const last = objLit.properties[objLit.properties.length - 1]!;
      const commaMatch = content.slice(last.end, objLit.end).match(/^\s*,/);
      const versionNum = newVersion.replaceAll('.', '');

      console.log('WE GOT HEREEEEE', last, commaMatch);
      return {
        pos: last.end + (commaMatch ? commaMatch[0].length : 0),
        str: `${commaMatch ? '' : ','}\n  '${newVersion}': ${newVersionProfileIdent},`,
        exists: false,
      };
    },
  );
}

(async function () {
  console.log();
  console.log(
    `Performing necessary basic codemods for react-native@${newVersion}...`,
  );
  console.log();
  await updateConfigTypes();
  await updateMessagingConstants();
  await createShellDependenciesProfile();
  await updateDependencyProfilesIndex();
  console.log();
  console.log('Updates complete!');
})();

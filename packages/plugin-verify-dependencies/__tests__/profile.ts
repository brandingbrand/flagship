import * as fs from 'fs';
import * as path from 'path';

import {profiles} from '../src/profile';

describe('dependency profiles', () => {
  const entries = Object.entries(profiles);

  it('contains at least one profile', () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  it('covers every react-native template version exactly', () => {
    const templatesDir = path.join(
      path.dirname(
        require.resolve('@brandingbrand/code-templates/package.json'),
      ),
      'react-native',
    );
    const templateVersions = fs
      .readdirSync(templatesDir, {withFileTypes: true})
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .sort();

    expect(Object.keys(profiles).sort()).toEqual(templateVersions);
  });

  it.each(entries)(
    'profile %s pins react-native to its own version',
    (version, profile) => {
      expect(profile['react-native']).toBeDefined();
      expect(profile['react-native']!.version).toMatch(
        new RegExp(`^\\^${version.replace('.', '\\.')}\\.`),
      );
    },
  );

  it.each(entries)(
    'profile %s pins @react-native scoped packages to its own version',
    (version, profile) => {
      const scoped = Object.entries(profile).filter(([name]) =>
        name.startsWith('@react-native/'),
      );

      for (const [name, spec] of scoped) {
        expect({name, version: spec.version}).toEqual({
          name,
          version: expect.stringMatching(
            new RegExp(`^\\^${version.replace('.', '\\.')}\\.`),
          ),
        });
      }
    },
  );
});

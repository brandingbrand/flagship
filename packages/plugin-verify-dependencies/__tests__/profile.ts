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
    'profile %s pins react exactly, with no range operator',
    (_version, profile) => {
      // Every React Native minor is built and tested against one patch of
      // react, and the community template pins it exactly for that reason.
      // A range here lets a consumer resolve a react the minor was never
      // built against, and `verify-dependencies` will not flag it because
      // the installed version still satisfies the range.
      expect(profile.react).toBeDefined();
      expect(profile.react!.version).toMatch(/^\d+\.\d+\.\d+$/);
    },
  );

  it.each(entries)(
    'profile %s pins @react-native scoped packages to its own version',
    (version, profile) => {
      const scoped = Object.entries(profile).filter(([name]) =>
        name.startsWith('@react-native/'),
      );

      // 0.72 predates the scoped @react-native/* packages; every profile
      // after it must track at least one so this check cannot pass vacuously.
      if (parseInt(version.split('.')[1]!, 10) >= 73) {
        expect(scoped.length).toBeGreaterThan(0);
      }

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

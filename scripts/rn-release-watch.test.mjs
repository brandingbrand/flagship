import {test} from 'node:test';
import assert from 'node:assert/strict';
import {
  computeHighestAdopted,
  computePendingMinors,
  evaluateRelease,
  findExistingIssue,
  buildIssueBody,
  run,
} from './rn-release-watch.mjs';

test('computeHighestAdopted picks the highest adopted template', () => {
  const dirs = [
    '0.72',
    '0.73',
    '0.74',
    '0.75',
    '0.76',
    '0.77',
    '0.78',
    '0.79',
    '0.80',
    '0.81',
    '0.82',
    '0.83',
  ];
  assert.deepEqual(computeHighestAdopted(dirs), {
    major: 0,
    minor: 83,
    label: '0.83',
  });
});

test('computeHighestAdopted ignores non-version entries in the template dir', () => {
  const dirs = ['0.72', '0.73', 'README.md', '.DS_Store'];
  assert.deepEqual(computeHighestAdopted(dirs), {
    major: 0,
    minor: 73,
    label: '0.73',
  });
});

test('computeHighestAdopted throws when no adopted versions are found', () => {
  assert.throws(() => computeHighestAdopted(['README.md']));
});

test('computePendingMinors returns every published dot-zero minor above the highest adopted, ascending', () => {
  const highest = {major: 0, minor: 83, label: '0.83'};
  const npmTime = {
    created: '2015-03-26T22:43:20.000Z',
    modified: '2026-07-27T00:00:00.000Z',
    '0.83.0': '2026-01-01T00:00:00.000Z',
    '0.83.1': '2026-01-15T00:00:00.000Z',
    '0.84.0': '2026-02-11T00:00:00.000Z',
    '0.85.0': '2026-04-01T00:00:00.000Z',
    '0.85.2': '2026-04-20T00:00:00.000Z',
    '0.86.0': '2026-06-01T00:00:00.000Z',
  };
  const pending = computePendingMinors({highest, npmTime, npmVersions: {}});
  assert.deepEqual(
    pending.map(minor => minor.label),
    ['0.84', '0.85', '0.86'],
  );
});

test('computePendingMinors catches a jump straight to a new major', () => {
  const highest = {major: 0, minor: 83, label: '0.83'};
  const npmTime = {
    '0.83.0': '2026-01-01T00:00:00.000Z',
    '1.0.0': '2026-05-01T00:00:00.000Z',
  };
  const pending = computePendingMinors({highest, npmTime, npmVersions: {}});
  assert.deepEqual(
    pending.map(minor => minor.label),
    ['1.0'],
  );
});

test('computePendingMinors returns nothing when the highest adopted minor is already current', () => {
  const highest = {major: 0, minor: 83, label: '0.83'};
  const npmTime = {'0.83.0': '2026-01-01T00:00:00.000Z'};
  assert.deepEqual(
    computePendingMinors({highest, npmTime, npmVersions: {}}),
    [],
  );
});

test('computePendingMinors excludes npm-deprecated dot-zero versions', () => {
  // Real npm data: react-native@1000.0.0 was "accidentally published" in
  // 2024 and is marked deprecated -- it must never be picked up as the
  // highest pending minor.
  const highest = {major: 0, minor: 83, label: '0.83'};
  const npmTime = {
    '0.83.0': '2026-01-01T00:00:00.000Z',
    '0.84.0': '2026-02-11T00:00:00.000Z',
    '1000.0.0': '2024-01-31T22:02:17.187Z',
  };
  const npmVersions = {
    '1000.0.0': {
      deprecated:
        'This version of React Native was accidentally published and should not be used in production',
    },
  };
  const pending = computePendingMinors({highest, npmTime, npmVersions});
  assert.deepEqual(
    pending.map(minor => minor.label),
    ['0.84'],
  );
});

test('evaluateRelease: reports age in days', () => {
  const releasedAt = '2026-02-11T00:00:00Z';
  const now = new Date('2026-07-27T00:00:00Z');
  const result = evaluateRelease({releasedAt, now});
  assert.equal(result.ageDays, 166);
});

test('evaluateRelease: freshly published (0 days old)', () => {
  const now = new Date('2026-07-27T00:00:00Z');
  const result = evaluateRelease({releasedAt: now.toISOString(), now});
  assert.equal(result.ageDays, 0);
});

test('findExistingIssue: matches an issue with the exact title', () => {
  const existingIssues = [
    {title: 'Something unrelated', html_url: 'https://example.com/1'},
    {title: 'RN 0.84 adoption tracking', html_url: 'https://example.com/2'},
  ];
  const found = findExistingIssue({
    existingIssues,
    title: 'RN 0.84 adoption tracking',
  });
  assert.equal(found?.html_url, 'https://example.com/2');
});

test('findExistingIssue: no match when the title differs', () => {
  const existingIssues = [{title: 'RN 0.83 adoption tracking'}];
  const found = findExistingIssue({
    existingIssues,
    title: 'RN 0.84 adoption tracking',
  });
  assert.equal(found, null);
});

test('findExistingIssue: no match against an empty issue list', () => {
  assert.equal(
    findExistingIssue({existingIssues: [], title: 'RN 0.84 adoption tracking'}),
    null,
  );
});

test('buildIssueBody: links the adoption skill, the maintainer guide and the upstream template diff', () => {
  const body = buildIssueBody({
    minorLabel: '0.84',
    dotZeroVersion: '0.84.0',
    releasedAt: '2026-02-11T16:04:19.627Z',
    highest: {major: 0, minor: 83, label: '0.83'},
    repository: 'brandingbrand/flagship',
  });
  assert.match(
    body,
    /\[`\.agents\/skills\/upgrade-rn-version\/SKILL\.md`\]\(https:\/\/github\.com\/brandingbrand\/flagship\/blob\/HEAD\/\.agents\/skills\/upgrade-rn-version\/SKILL\.md\)/,
  );
  assert.match(
    body,
    /\[maintainer guide\]\(https:\/\/brandingbrand\.github\.io\/flagship\/maintain\/add-rn-version\/\)/,
  );
  assert.match(
    body,
    /https:\/\/react-native-community\.github\.io\/upgrade-helper\/\?from=0\.83\.0&to=0\.84\.0/,
  );
  assert.doesNotMatch(body, /yarn add-rn-version/);
});

test('buildIssueBody: puts the skill ahead of the maintainer guide and says which governs', () => {
  const body = buildIssueBody({
    minorLabel: '0.84',
    dotZeroVersion: '0.84.0',
    releasedAt: '2026-02-11T16:04:19.627Z',
    highest: {major: 0, minor: 83, label: '0.83'},
    repository: 'brandingbrand/flagship',
  });
  assert.ok(
    body.indexOf('SKILL.md') < body.indexOf('maintainer guide'),
    'the skill must be the first procedure the reader meets',
  );
  assert.match(body, /the procedure above governs/);
});

test('run(): end-to-end dry run files one issue per pending minor, ascending, deduped', async () => {
  const requestedUrls = [];
  const fetchImpl = async url => {
    requestedUrls.push(String(url));
    if (String(url).startsWith('https://registry.npmjs.org/react-native')) {
      return {
        ok: true,
        json: async () => ({
          time: {
            '0.83.0': '2026-01-01T00:00:00.000Z',
            '0.84.0': '2026-02-11T00:00:00.000Z',
            '0.85.0': '2026-04-01T00:00:00.000Z',
            '0.86.0': '2026-06-01T00:00:00.000Z',
          },
          versions: {},
        }),
      };
    }
    if (String(url).startsWith('https://api.github.com/search/issues')) {
      return {
        ok: true,
        json: async () => ({
          items: [{title: 'RN 0.85 adoption tracking', html_url: 'https://example.com/existing'}],
        }),
      };
    }
    throw new Error(`run() made an unexpected request: ${url}`);
  };

  process.env.GITHUB_TOKEN = 'test-token';
  process.env.GITHUB_REPOSITORY = 'brandingbrand/flagship';
  try {
    const result = await run({
      dryRun: true,
      log: () => {},
      now: new Date('2026-07-27T00:00:00Z'),
      fetchImpl,
      readTemplateDirNames: () => ['0.82', '0.83'],
    });

    assert.deepEqual(
      result.filed.map(entry => entry.label),
      ['0.84', '0.86'],
    );
    assert.deepEqual(
      result.skipped.map(entry => entry.label),
      ['0.85'],
    );
    assert.equal(result.skipped[0].reason, 'duplicate');
    assert.match(
      result.filed[0].body,
      /React Native 0\.84\.0 shipped on 2026-02-11T00:00:00\.000Z\./,
    );
    assert.deepEqual(requestedUrls, [
      'https://registry.npmjs.org/react-native',
      'https://api.github.com/search/issues?q=repo%3Abrandingbrand%2Fflagship%20is%3Aissue%20label%3Arn-adoption',
    ]);
  } finally {
    delete process.env.GITHUB_TOKEN;
    delete process.env.GITHUB_REPOSITORY;
  }
});

test('run(): no pending minors returns empty result without hitting the search API', async () => {
  const requestedUrls = [];
  const fetchImpl = async url => {
    requestedUrls.push(String(url));
    return {
      ok: true,
      json: async () => ({
        time: {'0.83.0': '2026-01-01T00:00:00.000Z'},
        versions: {},
      }),
    };
  };

  process.env.GITHUB_TOKEN = 'test-token';
  process.env.GITHUB_REPOSITORY = 'brandingbrand/flagship';
  try {
    const result = await run({
      dryRun: true,
      log: () => {},
      now: new Date('2026-07-27T00:00:00Z'),
      fetchImpl,
      readTemplateDirNames: () => ['0.82', '0.83'],
    });
    assert.deepEqual(result, {filed: [], skipped: []});
    assert.deepEqual(requestedUrls, ['https://registry.npmjs.org/react-native']);
  } finally {
    delete process.env.GITHUB_TOKEN;
    delete process.env.GITHUB_REPOSITORY;
  }
});

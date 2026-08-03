#!/usr/bin/env node
// Watches npm for every React Native minor whose dot-zero release has been
// published but isn't adopted yet, and files one `rn-adoption` tracking
// issue per pending minor (ascending, deduped against existing issues).
// Adoption itself stays manual (`yarn add-rn-version <version>`) -- this
// only detects and files the issues.

import {readdirSync} from 'node:fs';

const TEMPLATE_DIR = new URL(
  '../packages/templates/react-native/',
  import.meta.url,
);

const MAINTAINER_GUIDE_URL =
  'https://brandingbrand.github.io/flagship/maintain/add-rn-version/';

const SKILL_PATH = '.agents/skills/upgrade-rn-version/SKILL.md';

/**
 * Given the directory names under packages/templates/react-native, return
 * the highest adopted React Native minor.
 */
export function computeHighestAdopted(templateDirNames) {
  const adopted = templateDirNames
    .filter(name => /^\d+\.\d+$/.test(name))
    .map(name => name.split('.').map(Number))
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  if (adopted.length === 0) {
    throw new Error('No adopted react-native template versions found.');
  }

  const [major, minor] = adopted[adopted.length - 1];
  return {major, minor, label: `${major}.${minor}`};
}

/**
 * Given the highest adopted minor and the npm packument's `time` map, return
 * every published dot-zero minor above it, ascending. Compares (major,
 * minor) tuples rather than assuming a fixed major, so a jump straight to a
 * new major (e.g. 1.0) is caught instead of silently missed.
 *
 * `npmVersions` is the packument's `versions` map -- entries npm marks
 * `deprecated` are excluded. react-native@1000.0.0 (published 2024-01-31,
 * "accidentally published and should not be used in production") is real
 * data that would otherwise be picked up as the "highest" pending minor.
 */
export function computePendingMinors({highest, npmTime, npmVersions}) {
  const pending = [];
  for (const [version, releasedAt] of Object.entries(npmTime)) {
    const match = /^(\d+)\.(\d+)\.0$/.exec(version);
    if (!match) {
      continue;
    }
    if (npmVersions[version]?.deprecated) {
      continue;
    }
    const major = Number(match[1]);
    const minor = Number(match[2]);
    if (
      major > highest.major ||
      (major === highest.major && minor > highest.minor)
    ) {
      pending.push({
        major,
        minor,
        label: `${major}.${minor}`,
        version,
        releasedAt,
      });
    }
  }
  return pending.sort((a, b) => a.major - b.major || a.minor - b.minor);
}

/**
 * Pure date-math, for logging only -- there is no maturity wait gating
 * whether a pending minor is eligible.
 */
export function evaluateRelease({releasedAt, now}) {
  const ageDays = Math.floor(
    (now.getTime() - new Date(releasedAt).getTime()) / 86_400_000,
  );
  return {ageDays};
}

/**
 * Pure duplicate check: does an open-or-closed issue with this exact title
 * already exist?
 */
export function findExistingIssue({existingIssues, title}) {
  return existingIssues.find(issue => issue.title === title) ?? null;
}

export function buildIssueBody({
  minorLabel,
  dotZeroVersion,
  releasedAt,
  highest,
  repository,
}) {
  const diffUrl = `https://react-native-community.github.io/upgrade-helper/?from=${highest.label}.0&to=${dotZeroVersion}`;
  const skillUrl = `https://github.com/${repository}/blob/HEAD/${SKILL_PATH}`;
  return [
    `React Native ${dotZeroVersion} shipped on ${releasedAt}.`,
    '',
    `This repo currently ships native templates through ${highest.label} (\`packages/templates/react-native\`); ${minorLabel} is not yet supported.`,
    '',
    `The adoption procedure is [\`${SKILL_PATH}\`](${skillUrl}). Read it in full and follow it; it is the process of record and it names which trees an adoption may not touch.`,
    '',
    `The [maintainer guide](${MAINTAINER_GUIDE_URL}) is human-facing background on the same process. Where the two differ, the procedure above governs.`,
    '',
    `This issue only tracks that ${minorLabel} is ready to adopt.`,
    '',
    `Upstream template diff: ${diffUrl}`,
    '',
    '_Filed automatically by `.github/workflows/rn-release-watch.yml`._',
  ].join('\n');
}

async function githubRequest(
  path,
  {token, method = 'GET', body, fetchImpl = fetch} = {},
) {
  const res = await fetchImpl(`https://api.github.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'rn-release-watch',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    throw new Error(
      `GitHub API ${method} ${path} failed: ${res.status} ${res.statusText}`,
    );
  }
  return res.json();
}

export async function run({
  dryRun = false,
  log = console.log,
  now = new Date(),
  fetchImpl = fetch,
  readTemplateDirNames = () => readdirSync(TEMPLATE_DIR),
} = {}) {
  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY; // "owner/repo"
  if (!token || !repository) {
    throw new Error('GITHUB_TOKEN and GITHUB_REPOSITORY must be set.');
  }
  const [owner, repo] = repository.split('/');

  const templateDirNames = readTemplateDirNames();
  const highest = computeHighestAdopted(templateDirNames);
  log(`Highest adopted RN minor: ${highest.label}`);

  const npmRes = await fetchImpl('https://registry.npmjs.org/react-native');
  if (!npmRes.ok) {
    throw new Error(
      `npm registry lookup failed: ${npmRes.status} ${npmRes.statusText}`,
    );
  }
  const {time: npmTime, versions: npmVersions} = await npmRes.json();

  const pending = computePendingMinors({highest, npmTime, npmVersions});
  if (pending.length === 0) {
    log('No published RN minor above the highest adopted; nothing to do.');
    return {filed: [], skipped: []};
  }
  log(
    `Pending minors above ${highest.label}: ${pending
      .map(minor => minor.label)
      .join(', ')}`,
  );

  const searchResult = await githubRequest(
    `/search/issues?q=${encodeURIComponent(
      `repo:${owner}/${repo} is:issue label:rn-adoption`,
    )}`,
    {token, fetchImpl},
  );
  const existingIssues = searchResult.items;

  const filed = [];
  const skipped = [];
  for (const minor of pending) {
    const title = `RN ${minor.label} adoption tracking`;
    const existing = findExistingIssue({existingIssues, title});
    if (existing) {
      log(
        `Tracking issue already exists for ${minor.label}: ${existing.html_url}`,
      );
      skipped.push({
        label: minor.label,
        reason: 'duplicate',
        url: existing.html_url,
      });
      continue;
    }

    const {ageDays} = evaluateRelease({releasedAt: minor.releasedAt, now});
    log(`${minor.version} published ${minor.releasedAt} (${ageDays} days old).`);

    const body = buildIssueBody({
      minorLabel: minor.label,
      dotZeroVersion: minor.version,
      releasedAt: minor.releasedAt,
      highest,
      repository,
    });

    if (dryRun) {
      log(`[dry run] Would file issue "${title}":\n${body}`);
      filed.push({label: minor.label, reason: 'dry-run', title, body});
      continue;
    }

    const created = await githubRequest(`/repos/${owner}/${repo}/issues`, {
      token,
      method: 'POST',
      body: {title, body, labels: ['rn-adoption']},
      fetchImpl,
    });
    log(`Filed ${created.html_url}`);
    filed.push({label: minor.label, url: created.html_url});
  }

  return {filed, skipped};
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dryRun = process.env.DRY_RUN === 'true';
  run({dryRun}).catch(err => {
    console.error(err);
    process.exitCode = 1;
  });
}

# AGENTS.md

Orients any coding agent (Claude, Copilot, Cursor, and others) working in this repository. This is a public file. Nothing internal belongs here: no dispatch process, no named reviewers, no links to private threads or docs.

## What this repo is

Flagship Code: a React Native app framework. A CLI, per-version native templates, and dependency-verification tooling for mobile commerce apps.

## Before you touch anything

- Install and verify with `yarn install`, `yarn build`, `yarn lint`, `yarn test` (Yarn 4.12 via the committed `yarnPath`, Node 22).
- Every user-facing change needs a changeset (`.changeset/`) declaring every affected package and its bump type.
- Read the version's template and the maintainer docs before changing anything native. Native behavior changes between React Native versions; do not assume a pattern from one version holds in another.

## Working conventions

- Open pull requests against `develop`, not `main` (releases cut from `main` via Changesets).
- Conventional Commits (`type(scope): subject`), one logical change per commit.
- Pull requests open as drafts; mark ready only when the gates applicable to the change are green.
- Match existing conventions: the profile file structure, workflow style in `.github/workflows/`, and commit scopes from recent history.

## Skills

Task-specific procedures live in `SKILL.md` files under `.agents/skills/`. Read the relevant one in full before starting the task it covers.

- **Adopting a new React Native minor:** [`.agents/skills/upgrade-rn-version/SKILL.md`](.agents/skills/upgrade-rn-version/SKILL.md).

## Ground rules

- Never hand-edit harvested template content under `packages/templates/react-native/`; it must stay byte-identical to the upstream harvest.
- Never guess the supported-version list; this repo derives it from the `packages/templates/react-native/` directory listing at build time, not from a manifest or from this doc.
- No placeholder implementations, no commented-out assertions, no partially-filled dependency profiles.

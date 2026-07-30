---
name: upgrade-rn-version
description: Adopt a new stable React Native minor into Flagship Code. One version per pull request, each proven by a real native build of the example app before the next.
---

# Upgrade RN Version

Flagship Code supports a React Native minor by carrying three things together: a native template, a dependency profile, and CLI registration. This skill covers adopting a new minor.

## How to follow this skill

Every command below is written to run verbatim from the repository root. Run them as written.

- When this skill names a source of truth, read it. Do not infer a value from a neighbouring file, a previous version, or a sibling profile.
- Do not conclude that a step would pass. Run it and read the output.
- Do not substitute an equivalent command, a different directory, or one platform for another.
- If a step cannot be run, stop and report which step and why. A step you cannot run is a blocker, not a judgement call.

## When to use this

A pending React Native minor needs adopting: a stable release above the newest version in `packages/templates/react-native/`. There is usually an open `rn-adoption` tracking issue for it.

## Ground truth at build time

Do not trust cached version numbers in this doc. Re-derive at build time:
- Pending minors are stable React Native releases (`npm view react-native versions --json`, filtered to `X.Y.0`, never dist-tags) above the highest directory name in `packages/templates/react-native/`. Exclude anything npm marks `deprecated` (the guard against the accidental `react-native@1000.0.0` publish, which otherwise looks like the newest pending minor).
- The currently-adopted minors are that directory listing itself. It is the support manifest; there is no separate manifest file.
- Latest patch per minor and its pairings (React, TypeScript, community CLI) come from that patch's own upstream `package.json`. Read it, do not assume.

## Adopting one minor (one PR per minor, ascending)

Never adopt more than one version in a PR, never stack one adoption on another's unmerged branch, and never start the next version until the current one has merged.

1. **Premise check.** Confirm `./scripts/add-rn-version` and the `PR Compile` and `PR Test` workflows already exist and work (throwaway-branch dry run). If tooling is missing or broken, that is a blocker on the tooling itself. Stop and report it; do not build or repair tooling as part of an adoption.
2. **Harvest.** Run `./scripts/add-rn-version 0.XX`. This pulls the upstream `@react-native-community/template` (android and ios only) into `packages/templates/react-native/0.XX/` and codemods: CLI registration (`packages/cli-kit/src/@types/config.ts`, `packages/cli/src/ui/constants/messaging.ts`), a shell dependency profile (`packages/plugin-verify-dependencies/src/profile/0.XX.ts` plus registration in `index.ts`), and the root `package.json` `react-native` pin. It does not touch the root `react` pin. Step 4 covers that; the script having run is not evidence the root is aligned.
3. **Fill the profile.** Spread the previous minor's profile, then reconcile every template-derived entry against this minor's own template. Do not assume an inherited value is still correct.
   - **Source of truth:** this minor's `@react-native-community/template` `package.json` (`npm pack @react-native-community/template@<patch>`). Diff it against the previous minor's, or read the same diff in the upgrade helper, to see what moved.
   - **What to write:** copy the template's version string verbatim, range operator included. An exact pin upstream (`"A.B.C"`) means an exact pin in the profile (`'A.B.C'`); a range (`"^A.B.C"`) stays that range. The operator is part of the pairing: React Native is tested against one patch of its `react`, and widening it lets a consumer resolve a `react` this minor was never built against.
   - **One exception:** `react-native` and the four `@react-native/*` entries are written `^0.XX.0`, the minor floor rather than the harvested patch. The profile-version test requires that literal form, because a profile must accept any patch of its own minor.
   - A tracked key that disagrees with the template is a bug, regardless of which minor introduced it. Inheritance carries stale pins forward silently, and some predate the minor you are adopting. Fix it in your minor and note it in the PR, or file it; do not propagate it.
   - Do not add tracking for packages prior profiles did not track (ecosystem-native libs like screens, gesture-handler, reanimated are not profile-tracked yet; see step 6).
   - Earlier profiles are not the spec. The template is.
4. **Align the workspace.** The example and the repository root both carry React pins and they must agree. A root `react` range that admits a patch other than the example's exact pin resolves to two copies of React, and the example then fails at runtime rather than at build time.

   ```sh
   yarn workspace @brandingbrand/code-example flagship-code align-deps --profile 0.XX --fix
   yarn install
   ```

   Then set the root `package.json` `react` and `react-native` entries to the same strings this minor's profile carries, and run `yarn install` again. Never hand-edit the example's pins; the profile drives those.

   Prove there is exactly one React before going further:

   ```sh
   yarn why react
   ```

   More than one resolved version is a failure. Fix the disagreeing pin and re-run. Do not continue with two.
5. **Compile the example on both platforms.** Run all four commands. These are the commands CI runs, so a failure here is a failure there.

   ```sh
   yarn workspace @brandingbrand/code-example prebuild --build internal --env prod --platform android --verbose
   cd apps/example/android && ./gradlew assembleDebug && cd ../../..
   yarn workspace @brandingbrand/code-example prebuild --build internal --env prod --platform ios --verbose
   cd apps/example/ios && xcodebuild -workspace app.xcworkspace -scheme app -configuration Debug -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' CODE_SIGNING_ALLOWED=NO build && cd ../../..
   ```

   A passing test suite is not evidence that these pass, and no other step in the gate substitutes for them. A version is not adopted until it has compiled as a real app on both platforms.
6. **Ecosystem-native pin breaks.** If the example's compile fails because a non-profile-tracked dependency (screens, gesture-handler, reanimated, safe-area-context, async-storage, webview, community CLI) is incompatible with the new version, bump that one dependency's pin in the example (not the profile mechanism) and record why. The compile is what surfaces such a break instead of shipping a stale pin. Automating these pairings is separate, larger work, out of scope for an adoption PR.
7. **Full local gate.** Every command below, green, run in this order:

   ```sh
   yarn install
   yarn build
   yarn lint
   FLAGSHIP_CODE_TEST_RN_VERSION=0.XX yarn test
   ```

   Plain `yarn test` runs the plugin suites against the default 0.72 template; the environment variable points them at the version you are adding, so the tests actually exercise it. The two native builds in step 5 are part of this gate and are not implied by these four commands.
8. **Changeset.** One file, message `add support for react-native 0.XX`, minor bump on every package the adoption touched (typically `code-plugin-verify-dependencies`, `code-templates`, `code-cli-kit`, `code-cli`, `code-plugin-transform-template`, `code-preset-react-native`).
9. **PR.** Draft from the first commit against `develop`. Mark ready once every item in the definition of done is satisfied, and request review from the repository's code owners. Carry the gate evidence in the PR description: the commands run, their results, and a link to the `PR Compile` run.

### Definition of done, per adoption PR

- [ ] Template at `packages/templates/react-native/0.XX/`, byte-identical to the upstream harvest. No local edits to harvested content.
- [ ] Profile `0.XX` registered; the profile-version assertion passes (a profile's `react-native` pin must match its own version. An unfilled shell profile otherwise passes every other check while pinning nothing real).
- [ ] Plugin test matrix covers `0.XX` (it derives its version list from the template directory, so this follows from the template add).
- [ ] `apps/example` and the root `package.json` agree on `react` and `react-native`, and `yarn why react` reports one resolved version.
- [ ] The `PR Compile` workflow has run on this PR and both its `android` and `ios` jobs are green. Link the run in the PR description. A local build does not substitute for it, and neither does an expectation that it would pass.
- [ ] Changeset present, correct packages and bump type.
- [ ] No placeholder implementations, no commented-out assertions, no partially-filled dependency profile.

### Anti-fake-test rules

- Never weaken or delete an assertion to make a gate pass.
- Assert real outcomes (file contents, exit codes, a successful native build), not that an internal function was called.
- A shell profile compiling is not evidence of correctness; that is exactly what the profile-version assertion exists to catch.

### If a gate will not go green

Two focused attempts, then stop. Do not weaken the gate, skip the test, or merge around it. Record what was tried and the exact failure in the PR (kept as a draft) rather than forcing it through.

## Writing rules

Commit messages, PR titles, and PR bodies are professional open-source contributions: what changed, why, and how it was verified. Conventional Commits, one logical change per commit. No AI attribution of any kind. The PR body carries the gate evidence.

## Reference

- Maintainer guide (human-facing detail): https://brandingbrand.github.io/flagship/maintain/add-rn-version/
- React Native releases and support policy: https://github.com/reactwg/react-native-releases
- Community template: https://www.npmjs.com/package/@react-native-community/template
- Community CLI (major 20): https://github.com/react-native-community/cli
- Upgrade diff generator: https://react-native-community.github.io/upgrade-helper/

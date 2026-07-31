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

1. **Premise check.** Run `yarn install` before anything else. The harvest script's codemods run through `tsx`, so against an uninstalled workspace they fail with `Cannot find module 'typescript'`; that is a missing install, not a broken script, and it is not a premise failure. Then confirm `./scripts/add-rn-version` and the `PR Compile` and `PR Test` workflows already exist and work (throwaway-branch dry run). If tooling is genuinely missing or broken, that is a blocker on the tooling itself. Stop and report it; do not build or repair tooling as part of an adoption.
2. **Harvest.** Run `./scripts/add-rn-version 0.XX`. This pulls the upstream `@react-native-community/template` (android and ios only) into `packages/templates/react-native/0.XX/` and codemods: CLI registration (`packages/cli-kit/src/@types/config.ts`, `packages/cli/src/ui/constants/messaging.ts`), a shell dependency profile (`packages/plugin-verify-dependencies/src/profile/0.XX.ts` plus registration in `index.ts`), and the root `package.json` `react-native` pin. It does not touch the root `react` pin. Step 4 covers that; the script having run is not evidence the root is aligned.
3. **Fill the profile.** Spread the previous minor's profile, then reconcile every template-derived entry against this minor's own template. Do not assume an inherited value is still correct.
   - **Source of truth:** this minor's `@react-native-community/template` `package.json` (`npm pack @react-native-community/template@<patch>`). Diff it against the previous minor's, or read the same diff in the upgrade helper, to see what moved.
   - **What to write:** copy the template's version string verbatim, range operator included. An exact pin upstream (`"A.B.C"`) means an exact pin in the profile (`'A.B.C'`); a range (`"^A.B.C"`) stays that range. The operator is part of the pairing: React Native is tested against one patch of its `react`, and widening it lets a consumer resolve a `react` this minor was never built against.
   - **One exception:** `react-native`, and every `@react-native/*` entry the previous profile tracks, are written `^0.XX.0`: the minor floor rather than the harvested patch. Take that set from the previous profile rather than from a list, because which scoped packages the template ships changes between minors. The profile-version test requires that literal form, because a profile must accept any patch of its own minor.
   - A tracked key that disagrees with the template is a bug, regardless of which minor introduced it. Inheritance carries stale pins forward silently, and some predate the minor you are adopting. Fix it in your minor and note it in the PR, or file it; do not propagate it.
   - Do not add tracking for packages prior profiles did not track (ecosystem-native libs like screens, gesture-handler, reanimated are not profile-tracked yet; see step 6).
   - Earlier profiles are not the spec. The template is.
4. **Align the workspace.** The example and the repository root both carry React pins and they must agree. A root `react` range that admits a patch other than the example's exact pin resolves to two copies of React, and the example then fails at runtime rather than at build time.

   ```sh
   yarn workspace @brandingbrand/code-example flagship-code align-deps --profile 0.XX --fix
   yarn install
   ```

   Then set the existing `react` and `react-native` entries in the root `package.json` to the same strings this minor's profile carries, and run `yarn install` again. Edit the entries already declared there; do not add a new dependency block for them. Never hand-edit the example's pins; the profile drives those.

   Prove there is exactly one React before going further:

   ```sh
   yarn why react
   ```

   More than one resolved version is a failure. Fix the disagreeing pin and re-run. Do not continue with two.
5. **Compile the example on both platforms.** The iOS build runs `pod install` through prebuild; the Android build needs a JDK and the Android SDK. Your local toolchain has to match what `.github/workflows/pr-compile.yml` provisions: read its `setup-node`, `setup-ruby`, and `setup-java` steps and match the versions declared there rather than any version named in this document. A missing toolchain, or one on a different major version, is an environment blocker to report. It is not an adoption failure, and it is not something to install your way around.

   Run all four commands. These are the commands CI runs, so a failure here is a failure there.

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
   FLAGSHIP_CODE_TEST_RN_VERSION=0.XX yarn test --force
   ```

   Plain `yarn test` runs the plugin suites against the default 0.72 template; the environment variable points them at the version you are adding. Two things let that command pass without testing your version, so a green run here is not the proof:

   - If `packages/templates/react-native/0.XX/` does not exist, the test environment resolves down to the nearest lower minor and passes against that one instead. Nothing reports the substitution.
   - `test` is a cached task and the variable is not part of its cache key, so a run following a plain `yarn test` can replay the earlier result. `--force` is what prevents that.

   The proof is the `test-templates (0.XX)` job on the pull request, which cannot exist unless the template directory does. The two native builds in step 5 are part of this gate and are not implied by these four commands.
8. **Changeset.** One file, message `add support for react-native 0.XX`, minor bump on the packages an adoption touches: `code-plugin-verify-dependencies`, `code-templates`, `code-cli-kit`, `code-cli`. Read the previous minor's changeset rather than this list if the two disagree. Declare another package only if this adoption actually modified it; do not declare one because it seems related.
9. **PR.** Draft from the first commit against `develop`. Mark ready once every item in the definition of done is satisfied, and request review from the repository's code owners. Carry the gate evidence in the PR description: the commands run, their results, and a link to the `PR Compile` run.

### Out of bounds, and when to stop

An adoption adds a version and aligns pins to it. It never changes the machinery that consumes them. These are not edited during an adoption:

- `scripts/`, the adoption tooling itself
- `packages/jest-config/`, the test harness, including how it resolves a template version
- `.github/workflows/`
- Plugin source and plugin tests. The dependency profiles under `plugin-verify-dependencies` are version data and are in scope; the plugin's own code and tests are not.
- Changesets configuration, publishing, release workflows
- Harvested template content under `packages/templates/react-native/`

Stop the adoption and report it if you hit one of the following three, and only these three:

1. `prebuild` warns `cannot find keyword ... in file path ...`.
2. The version appears to need its own directory under `packages/templates/supporting-files/`. That tree is version-partitioned and resolves down to the nearest lower version, so a missing directory does not error; it silently supplies older files.
3. The version appears to need new transform sets in `plugin-transform-template`.

Each of those means the native template has moved beyond what the current tooling handles. That is a tooling change, which an adoption does not make. Anything else that fails is covered by the two-attempt rule in *If a gate will not go green*, not by stopping here.

Stopping means: leave the pull request as a draft, record the step and the exact output in its description, and change no files beyond the ones this skill names. It does not mean repairing the tooling, editing harvested content, or working around the failure.

### Definition of done, per adoption PR

- [ ] Template at `packages/templates/react-native/0.XX/`, byte-identical to the upstream harvest. No local edits to harvested content.
- [ ] Profile `0.XX` registered; the profile-version assertion passes (a profile's `react-native` pin must match its own version. An unfilled shell profile otherwise passes every other check while pinning nothing real).
- [ ] The `test-templates (0.XX)` job exists on this pull request and is green. It appears only once `packages/templates/react-native/0.XX/` exists, because `PR Test` derives its matrix from that directory listing. A local run with `FLAGSHIP_CODE_TEST_RN_VERSION` set does not substitute for it.
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

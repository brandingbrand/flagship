# Upgrading to a new React Native minor

Use this when a new React Native minor (`0.XX.0`) needs to be adopted into Flagship — either
because `rn-release-watch` filed an adoption issue, or on request.

## Ground truth at build time

Don't trust cached version numbers in this file or anywhere else — re-derive at build time:

- **Currently-adopted minors** = the directory listing of `packages/templates/react-native/`
  itself. It IS the support manifest; there is no separate manifest file.
- **Pending minors** = stable React Native releases (`npm view react-native versions --json`,
  filtered to `X.Y.0`, excluding anything npm marks `deprecated`) above the highest directory
  name in `packages/templates/react-native/`.

## Premise check

Before touching version-specific files, confirm `./scripts/add-rn-version` and the CI gates
below already work — dry-run it on a throwaway branch. If the tooling itself is broken or
missing, that's the blocker: stop and report it rather than hand-writing what the tool should
have generated.

## Adopting a new minor (0.XX)

1. **Harvest the template.** Run `yarn add-rn-version 0.XX` (wraps `./scripts/add-rn-version`)
   to generate `packages/templates/react-native/0.XX/` from the upstream RN template. No local
   edits to harvested content — if something needs to change, it needs a codemod (see
   `scripts/add-rn-version-codemods.ts`), not a hand patch.
2. **Register the dependency profile.** Add
   `packages/plugin-verify-dependencies/src/profile/0.XX.ts`, spreading the previous minor's
   profile and bumping `react-native` (and its companion packages — babel preset, metro config,
   eslint config, typescript config) to `^0.XX.0`, per the shape in `0.83.ts`. The
   profile-version assertion requires a profile's `react-native` pin to match its own filename
   version — an unfilled shell profile otherwise passes every other check while pinning nothing
   real.
3. **Plugin test matrix.** No manual step — it derives its version list from the template
   directory, so adding the template in step 1 covers this automatically.
4. **Pin the example app.** Bump `react-native` to `0.XX` in `apps/example/package.json` and the
   root `package.json`. Both Android and iOS must prebuild and compile in CI.
5. **Changeset.** Add one covering the correct packages and bump type.

## Gate order

install → build → lint → test → prebuild → native build (both platforms).

## Definition of done

- [ ] Template at `packages/templates/react-native/0.XX/`, byte-identical to the upstream
      harvest — no local edits to harvested content.
- [ ] Profile `0.XX` registered; the profile-version assertion passes.
- [ ] Plugin test matrix covers `0.XX` (automatic from the template add).
- [ ] `apps/example` and root `package.json` pin `react-native` at `0.XX`; Android and iOS both
      prebuild and compile in CI.
- [ ] Changeset present, correct packages and bump type.
- [ ] No placeholder implementations, no commented-out assertions, no partially-filled
      dependency profile.

## Multiple pending minors

Adopt ascending, one draft PR per minor, each based on the previous minor's branch — don't
collapse several minors into one PR.

## Detection (context, not action)

`.github/workflows/rn-release-watch.yml` runs weekly and files one `rn-adoption` issue per
pending minor (ascending, deduped against existing issues) via `scripts/rn-release-watch.mjs`.
It only detects and files — adoption via this skill stays manual.

# @brandingbrand/code-app-env

## 3.0.0

### Major Changes

- 69f129e: Rename `AsyncStorage` dev screen component to `AsyncStorageDevScreen`

  **BREAKING CHANGE:**

  The `AsyncStorageDevScreen` component has been renamed from `AsyncStorage` to better differentiate it from the underlying `AsyncStorage` package. Please update any imports or references to use the new name `AsyncStorageDevScreen` from `@brandingbrand/code-app-env/screens`.

- 660298d: Update sensitive info dev screen to support ^5.6.0

  **BREAKING CHANGE:**

  The `react-native-sensitive-info` package has updated to version `5.6.0`, which includes breaking changes to its API and types. This update modifies the Sensitive Info Dev Screen to accommodate these changes, including updates to how items are deleted and retrieved. Projects running `react-native-sensitive-info@<5.6.0` may continue to use `@brandingbrand/code-app-env@^2.0.0`.

  No migration steps for the `SensitiveInfo` dev screen are necessary, however `createSensitiveInfoDevScreen` is no longer required. If your app is using the default `keychainService`, you may use `SensitiveInfoDevScreen` directly from `@brandingbrand/code-app-env/screens`.

### Patch Changes

- 69f129e: Expose dev menu screen components to help devs build custom screens

## 2.0.0

### Major Changes

- aa15344: Migrate to react-native-safe-area-context for RN81+

  **BREAKING CHANGE:**

  This release adds a new necessary peer dependency: `react-native-safe-area-context`.

  The React Native dev team has deprecated the old `SafeAreaView` component in favor of this recommended library.

### Patch Changes

- 39e4507: list `@react-native-async-storage/async-storage` and `react-native-sensitive-info` as optional peer dependencies
- 745e2fc: fix Android compilation error for RN 0.80 version

## 1.0.0

### Major Changes

- fb1f5d5: add dev menu package with babel and metro plugins

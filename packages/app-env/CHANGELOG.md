# @brandingbrand/code-app-env

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

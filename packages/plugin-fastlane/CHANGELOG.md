# @brandingbrand/code-plugin-fastlane

## 4.1.0

### Minor Changes

- 88686c6: new firebase increment option to reset build version to 1 if version mismatch during lane increment_build_firebase
  default behavior on iOS is to reset if new version found
  default behavior on Android is to just increment

## 4.0.0-alpha-20250306142323

### Major Changes

- react native <0.79 support

### Patch Changes

- Updated dependencies
  - @brandingbrand/code-cli-kit@14.0.0-alpha-20250306142323

## 4.0.0-alpha-20250303215025

### Major Changes

- react native <v0.79 support

### Patch Changes

- Updated dependencies
  - @brandingbrand/code-cli-kit@14.0.0-alpha-20250303215025

## 4.0.0-alpha-20250303201558

### Major Changes

- react native <0.79 support

### Patch Changes

- Updated dependencies
  - @brandingbrand/code-cli-kit@14.0.0-alpha-20250303201558

## 4.0.0-alpha-20250303200100

### Major Changes

- react native <v0.79 support

### Patch Changes

- Updated dependencies
  - @brandingbrand/code-cli-kit@14.0.0-alpha-20250303200100

## 4.0.0-alpha-20250303195416

### Major Changes

- react native <v0.79 support

### Patch Changes

- Updated dependencies
  - @brandingbrand/code-cli-kit@14.0.0-alpha-20250303195416

## 3.1.0

### Minor Changes

- Add Lanes for Firebase App Distributation Support based on build config
  New Lanes:
  - increment_build_appcenter - increment build version based on last App Center version
  - increment_build_firebase - increment build version based on last Firebase version
  - distribute (iOS) - build and upload to App Center and/or Firebase
  - distribute_package (Android) - build and upload APK to App Center and/or Firebase
  - distribute_bundle (Android) - build and upload AAB to App Center and/or Firebase

## 3.0.1

### Patch Changes

- cece852: peer dependency alignment

## 3.0.0

### Major Changes

- 1ddf4fc: Flagship Code™ v13 rewrite

### Patch Changes

- b5ce895: add increment build function to bundle lane when build number does not exist
- Updated dependencies [2160de2]
- Updated dependencies [1ddf4fc]
- Updated dependencies [2160de2]
- Updated dependencies [152c6de]
- Updated dependencies [2160de2]
- Updated dependencies [51344be]
- Updated dependencies [e085e57]
- Updated dependencies [cd5a724]
  - @brandingbrand/code-cli-kit@13.0.0

## 3.0.0-alpha.5

### Patch Changes

- Updated dependencies [152c6de]
  - @brandingbrand/code-cli-kit@13.0.0-alpha.5

## 3.0.0-alpha.4

### Patch Changes

- Updated dependencies [51344be]
  - @brandingbrand/code-cli-kit@13.0.0-alpha.4

## 3.0.0-alpha.3

### Patch Changes

- Updated dependencies
  - @brandingbrand/code-cli-kit@13.0.0-alpha.3

## 3.0.0-alpha.2

### Patch Changes

- b5ce895: add increment build function to bundle lane when build number does not exist
- Updated dependencies [e085e57]
  - @brandingbrand/code-cli-kit@13.0.0-alpha.2

## 3.0.0-alpha.1

### Patch Changes

- Updated dependencies
- Updated dependencies
- Updated dependencies
  - @brandingbrand/code-cli-kit@13.0.0-alpha.1

## 3.0.0-alpha.0

### Major Changes

- Flagship Code™ v13 rewrite

### Patch Changes

- Updated dependencies
  - @brandingbrand/code-cli-kit@13.0.0-alpha.0

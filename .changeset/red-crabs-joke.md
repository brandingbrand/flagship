---
"@brandingbrand/code-app-env": major
---

Update sensitive info dev screen to support ^5.6.0

**BREAKING CHANGE:**

The `react-native-sensitive-info` package has updated to version `5.6.0`, which includes breaking changes to its API and types. This update modifies the Sensitive Info Dev Screen to accommodate these changes, including updates to how items are deleted and retrieved. Projects running `rest-native-sensitive-info@<5.6.0` may continue to use `@brandingbrand/code-app-env@^2.0.0`.

No migration steps for the `SensitiveInfo` dev screen are necessary, however `createSensitiveInfoDevScreen` is no longer required. If your app is using the default `keychainService`, you may use `SensitiveInfoDevScreen` directly from `@brandingbrand/code-app-env/screens`.

---
title: Troubleshooting
description: Troubleshooting Development Environment Issues
layout: ../../../layouts/docs.astro
lang: en
---
# Troubleshooting
## Quick Start
Confirm your development environment is set up for React Native CLI by reviewing the [React Native Docs for version 0.70](https://reactnative.dev/docs/0.70/environment-setup).

Please create a [new issue](https://github.com/brandingbrand/flagship/issues/new) if you believe you are encountering a bug.

## iOS 
As a first step to troubleshooting iOS, we recommend you clear your Xcode Derived Data. To clear it, enter the following in your terminal: `rm -rf ~/Library/Developer/Xcode/DerivedData`.

## Android
### White Text
> *Note: This will be resolved in the next FS12 release (0.0.11)*

If you are upgrading from a previous version of FS to FS12, all text elements in Android that do not have a value for their color will be white when the device is in dark mode. To resolve this, patch the template style values XML file so that the application defaults to light mode, regardless of the device’s current theme.

### Java Vesion
It's possible OS updates have caused this issue when reported; however, if a Java version issue is encountered while building the Android application, you can resolve it by making sure you set the JAVA_HOME path equal to the one used by Android Studio in your path file.

Open and edit your .zshrc file `code .zshrc` (or .bashrc if using Linux, or WSL)
Ensure the file contains the following line for Java Version

```
export JAVA_HOME="/Applications/Android Studio.app/Contents/jre/Contents/Home"
```

### Command Line Tools
If you receive an error message regarding command line tools, such as the following:
```
> Cannot run program "/Users/User/Library/Android/sdk/cmdline-tools/latest/bin/sdkmanager": error=2, No such file or directory
```

It’s likely you need to install the Android Command-line Tools within Android Studio.

- Open Android Studio
- Click on the more actions drop-down in the Welcome Screen.
- Select SDK Manager
- View Appearance & Behavior > System Settings > Android SDK
- Make sure Android SDK Command-line Tools (latest) is selected and installed
- Click on Apply / Ok

If you note that you already have Command-line Tools installed via Android Studio, you should confirm that your path file correctly lists necessary Android development tools.

- Open and edit your .zshrc file `code .zshrc` (or .bashrc if using Linux, or WSL)
- Make sure the file contains the following lines for Android Studio.

```
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

---
title: Introduction
description: Introduction to Kernel
layout: ../../layouts/docs.astro
lang: en
---

## Kernel

[**Kernel**](https://github.com/brandingbrand/flagship/tree/feat/flagship-12) is a configuration as code (CaC) toolkit which focuses on naitve code generation for React Native leveraging simplicity, extensibility and typesafety.

The core foundation is based upon [**React Native**](https://reactnative.dev/) and [**TypeScript**](https://typescriptlang.org/). To manage this foundation we created this toolkit - CaC is the process of managing services via machine-readable definition files.

## Bare-bones or Expo

There are 2 major developmental directions to go in when creating a new React Native; stick with the basic bare-bones approach or the fully-managed Expo SDK.

The bare-bones approach, while simplistic, means that you have to manage and persist 3 platforms worth of code: React Native, iOS and Android. This approach becomes more complicated when managing a lot third party native dependencies that manipulate native code. Maintaining native code changes with React Native code changes can often be difficult when updating or removing these dependencies. React Native is also in a aggressive growing stage with new releases being published often - these updates often include making changes to native code which may conflict with changes already created. If you maintain multiple React Native apps, these upgrades need to be made in each app.

The Expo SDK approach provides a very simple out-of-the-box experience to manage a React Native app. It does provide a way to manipulate native files but can often be difficult for a developer to understand. The iOS and Android directories are hidden to an extent which can make it sometimes difficult to debug your application. This route is "sort-of" a vendor lock-in approach - I say "sort-of" because you can eject from the Expo SDK which leads you back to the bare-bones approach. This approach is also 2 levels removed from native apps i.e. React Native -> Expo - when React Native updates the update needs to propagate through Expo before being used.

While both approaches have large followings and popularity these approaches were either too minimalistic or too extreme.

## Okay... what's the solution?

Kernel aims to solve 2 problems: typesafe build + runtime configurations and native code generation. To manage these 2 challenges a typesafe idempotnent CaC toolkit was created. This toolkit can be broken down into 3 models: core, cli and plugins.

The core sdk is contains utility functions, executors and a template. Utility functions are foundational functions that executors and more complex functions are built upon to manipulate or generate native code. Executors are complex functions that are executed at different native-specific lifecycles.

The cli sdk is a command line interface that listens for options that conditionally run executors.

Plugins are published or local native-specific scripts i.e. iOS and/or Android, that manipulate or generate native code for a specific third-party SDK. These plugins are run generically based upon a priority list captured in the _package.json_.

## Opt-in / Opt-out

At any time in the phase of your React Native project you can opt-in to using Kernel; opting-in is as easy creating a typesafe configuration file + required plugins and adding the _ios_ and _android_ directories to your _.gitignore_.

If you are already using Kernel - at any time you can easily opt-out from continuuing using Kernel; opting-out from Kernel is as easy as removing your configuration folder and removing _ios_ and _android_ directories from your _.gitignore_.

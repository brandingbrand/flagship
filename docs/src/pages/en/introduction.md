---
title: Introduction
description: Introduction to Flagship Code
layout: ../../layouts/docs.astro
lang: en
---

# Flagship Code™

[**Flagship Code™**](https://github.com/brandingbrand/flagship/tree/feat/flagship-12) is a configuration as code (CaC) toolkit focusing on native code generation for React Native, leveraging simplicity, extensibility, and type safety. The core foundation is based on [**React Native**](https://reactnative.dev/) and [**TypeScript**](https://typescriptlang.org/). To manage this core foundation, we created this toolkit.


> CaC is the process of configuring services via machine-readable definition files. Our configuration files are typesafe JavaScript objects represented in TypeScript files.



> Native code generation is everything from React Native essentials to third-party dependencies that require native code changes.


This toolkit can be broken into three models: Core, CLI, and Plugins.

### Core

The core SDK contains utility functions, executors, and a template. Utility functions are foundational functions that executors and more complex functions are built upon to manipulate or generate native code.

### CLI

The CLI SDK is a command line interface that listens for options that conditionally run executors.

> Executors are complex functions that are executed at different native-specific lifecycles.

### Plugins

Plugins are published or local native-specific scripts (e.g., iOS and/or Android) that manipulate or generate native code for a specific third-party SDK. These plugins are run generically based on a priority list captured in the package.json file.

## Usage

At any time in the phase of your React Native project, you can opt-in to using Flagship Code™; opting in is as easy as creating a typesafe configuration file + required plugins and adding the ios and android directories to your `.gitignore`.

If you are already using Flagship Code™ - at any time, you can easily opt out from continuing to use Flagship Code™; opting out from Flagship Code™ is as easy as removing your configuration folder and ios and Android directories from your `.gitignore`.

Head over to the [**Integration**](/en/usage/integration) section for more detailed information.

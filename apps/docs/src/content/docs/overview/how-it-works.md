---
title: How It Works
---

## Architectural Overview

This guide is not required to use Flagship Code, it's simply an explanation of what it does and how it works.

### Dependencies

Flagship Code relies on two fundamental dependencies, namely `@brandingbrand/code-cli` and `@brandingbrand/code-cli-kit`, each serving distinct yet complementary roles within the ecosystem. The necessity of incorporating both packages into the product architecture may raise initial inquiries, but their respective functionalities underscore their significance.

#### cli

The `@brandingbrand/code-cli` package forms the command-line interface (CLI) component of Flagship Code, responsible for interpreting command-line arguments and executing corresponding actions to generate native projects. This pivotal component serves as the interface through which developers interact with Flagship Code, facilitating seamless project initialization and configuration.

#### cli-kit

Complementing the CLI functionality, the `@brandingbrand/code-cli-kit` package plays a pivotal role in the ecosystem by exposing shared modules and types essential for configuring native code. While the CLI handles command-line interactions, the CLI Kit package facilitates the configuration process by providing standardized modules and types utilized by both the CLI and plugin packages. This modular approach enhances code maintainability and extensibility, ensuring a cohesive development experience across different facets of Flagship Code.

#### Native Template Compatibility

Furthermore, the CLI package hosts the native template, which closely mirrors the renowned React Native TypeScript template. This strategic alignment with [React Native's template](https://github.com/facebook/react-native) structure ensures compatibility with the latest stable version of React Native, fostering a seamless integration experience for developers leveraging Flagship Code.

#### Integration and Workflow

In practice, the CLI parses command-line arguments and orchestrates actions to transform native code using the capabilities provided by the CLI Kit package. This symbiotic relationship between the CLI and CLI Kit packages forms the backbone of Flagship Code's functionality, enabling efficient native code generation and configuration in alignment with project requirements and industry standards.

#### Plugin Integration

While the core CLI and CLI Kit offer essential functionalities for configuring native projects, they may not cover every requirement, especially when integrating third-party services with unique native code needs. In such cases, plugins play a pivotal role in customizing and extending Flagship Code's capabilities to accommodate iOS and Android project configurations.

Plugins serve as a flexible mechanism to tailor Flagship Code to specific project needs, enabling seamless updates and enhancements to native codebases. Integrated as development dependencies, plugins are seamlessly invoked by the CLI, facilitating the integration of additional functionalities and native code adaptations. This modular approach empowers developers to incorporate third-party integrations efficiently while maintaining the integrity and coherence of their native projects.

### Configuration

Flagship Code operates on three distinct types of configurations: flagship-code, build, and env configurations, each serving a crucial role in the project scaffolding and runtime environment management.

#### flagship-code

The flagship-code configuration serves as the cornerstone of project scaffolding, offering comprehensive flexibility in defining essential paths and plugin integration. This configuration encompasses crucial parameters such as the build path, environment path, plugins path, and a customizable list of plugins. Its versatility allows for tailored project structuring, accommodating multiple build and environment configurations as dictated by project requirements.

#### build

The build configuration delineates the specifications for native iOS and Android builds through a TypeScript object interface. This encompasses a spectrum of requirements ranging from platform-specific settings to code-signing provisions. Different build configurations may be established to cater to various deployment scenarios, including internal testing, ad-hoc distribution, and store submissions, ensuring adaptability to diverse development environments.

#### env

The environment configuration articulates the runtime environment in a type-safe manner, accessible as a TypeScript object. This configuration seamlessly integrates with Flagship Code's preconfigured app implementation, facilitating robust runtime environment management. Leveraging this configuration, developers can ensure consistency and reliability across different runtime scenarios, enhancing overall code maintainability and deployment predictability.

---
title: Roadmap
description: Roadmap
layout: ../../layouts/docs.astro
lang: en
---

## Roadmap
The following is a list of areas we are working on improving. This list is non-exhaustive and may increase or decrease with time. We encourage developers to open [**issues**](https://github.com/brandingbrand/flagship/issues) as necessary to report bugs, encourage changes, and help us establish best practices for idempotent React Native code generation.

### Items
- Plist Explicit Helper Utilities
- XML Explicit Helper Utilities
- Test Fixtures
- Multi-tenant Apps

### Details
#### Plist Explicit Helper Utilities

Per Apple, <span class="italic">"An information property list file is a structured text file that contains essential configuration information for a bundled executable. The file itself is typically encoded using the Unicode UTF-8 encoding and structured using XML. The root XML node is a dictionary, whose contents are a set of keys and values describing different aspects of the bundle. The system uses these keys and values to obtain information about your app and how it is configured. As a result, all bundled executables (plug-ins, frameworks, and apps) are expected to have an information property list file."</span>, [**source**](https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/AboutInformationPropertyListFiles.html). This mends very well with JavaScript objects since Plist content is dictionary based. Currently we use `simple-list` to parse and write the Plist file contents. This works well for ambiguous objects; however, this does not work well for well-typed objects. Our goals is to have a strictly defined interface for the Plist that can be extended upon to also allow _any_ types for potential unknown objects. This would help generate useful iOS configs such as a urlScheme with `CFBundleURLSchemes`.

#### XML Explicit Helper Utilities

XML based content mends well with JavaScript because it follows a parent child relationship. XML files can be parsed and written with the `xml2js` library. It would be useful to generate a strict extensible interface for XML based files i.e. AndroidManifest.xml. This would allow us to generate helper modules that are much safer than just updating XML with ambiguous objects.

#### Test Fixtures

Currently unit test fixtures fulfill only what is needed per unit test which has its benefits. The problem is that they may get out-of-sync with the base template. All functionality should have unit tests based around the foundational React Native TypeScript template. Every unit test should instead be based upon copying over the template in the `before*` jest hook and remove these contents on the `after*` hook. This would greatly solve a lot of the mocking done with paths. Instead we could just mock the `cwd` to be where the copied fixture is located.

#### Multi-tenant Apps

The current structure of the environment configuration files mends well with multi-tenant apps. Each app may have its individual environment entities. 
Currently, Plugins are defined on a project basis not on tenant basis; we could expand upon these plugins to allow for a `skip` attribute that would be configured per environment. This would allow particular tenants to opt out of plugins.

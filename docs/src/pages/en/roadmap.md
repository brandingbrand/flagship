---
title: Roadmap
description: Roadmap
layout: ../../layouts/docs.astro
lang: en
---

## Roadmap

No piece of software is perfect or exempt for improvements. There are a few areas right now that are on our Roadmap that can be improved. These improvements will provide continual benefits to developers and end-users.

### Items
- Plist explicit helper utilities
- XML explicity helper utilities
- Unit test fixtures
- Multi-tenant gaps

#### Plist

Per Apple, <span class="italic">"An information property list file is a structured text file that contains essential configuration information for a bundled executable. The file itself is typically encoded using the Unicode UTF-8 encoding and the contents are structured using XML. The root XML node is a dictionary, whose contents are a set of keys and values describing different aspects of the bundle. The system uses these keys and values to obtain information about your app and how it is configured. As a result, all bundled executables (plug-ins, frameworks, and apps) are expected to have an information property list file."</span>, [**source**](https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/AboutInformationPropertyListFiles.html). This mends very well with javascript objects since Plist content is dictionary based. Currently we use `simple-list` to parse and write the Plist file contents. This works well for ambiguous objects. This does not work well for well-typed objects - we would like to have a strictly defined interface for the Plist that can be extended upon to also allow _any_ types for potential unknown objects. This would help generate useful iOS configs such as a urlScheme with `CFBundleURLSchemes`.

#### XML

XML based content mends well with javascript because it follows a parent child relationship. XML files can be parsed and written with the `xml2js` library. It would be useful to generate a strict extensible interface for xml based files i.e. AndroidManifest.xml. This would allow us to generate helper modules that are much safer than just updating XML with ambiguous objects.

#### Unit Test Fixtures

Currently unit test fixtures fulfill only what is needed per unit test which has it's benefits. The problem is that they may get out-of-sync with the base template. All functionality should have unit tests based around the foundational React Native typescript template. Every unit test should instead be based upon copying over the template in the `before*` jest hook and remove these contents on the `after*` hook. This would greatly solve a lot of the mocking done with paths. Instead we could just mock the `cwd` to be where the copied fixture is located.

#### Multi-tenant Gaps

The current structure of the envs mends well with multi-tenant apps; each app would have it's own env entities. Plugins are defined on a project basis not on tenant basis; we could expand upon these plugins to allow for a `skip` attribute that would be configured per environment. This would allow particular tenants to opt out of plugins.

### Final Points

This list will shrink and grow as time goes on and as more lessons are learned. We encourage developers to open [**issues**](https://github.com/brandingbrand/flagship/issues) as necessary to encourage changes and motivate best practices.

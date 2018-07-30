# FSComponents

FSComponents is Flagship's React Native component libraries.

* [Storybook](#storybook)
* [Individual Component Guides](#individual-component-guides)
  * [Form](#form)
    * [Basic Info](#basic-info)
    * [Label Positions](#label-positions)
    * [Active, Inactive, and Error Colors](#active,-inactive,-and-error-colors)

## Storybook

A great way to see some of the components and options that FSComponents offers is to visit Flagship's
[Storybook](http://brandingbrand.github.io/flagship/storybook) on our
[wiki](https://brandingbrand.github.io/flagship/).

It is often helpful to run a development version of storybook on your local system to interactively
 develop and test changes to the components in a controlled environment with a rapid re-compile
 time. To run:

1. Verify that yarn is installed on your computer. If you are not sure if it is, type “which yarn”
  into your terminal. If the terminal does not output a path, [install yarn](https://yarnpkg.com/lang/en/).
2. Clone flagship
3. `cd flagship`
4. `yarn` to install all required dependencies
5. `yarn dev:storybook` to compile and run local version that will watch for and update according to
 changes. The default port is 9001.

## Individual Component Guides

 Below you will find some guidance and advice on using some of our most-used and most-customizable
 components.

### Form

#### Basic Info

Flagship's Form component utilizes the [t-comb-form-native](https://github.com/gcanti/tcomb-form-native)
 library for its excellent validation capablities. As such, each form instance requires [types](https://github.com/gcanti/tcomb-form-native#types)
 to be passed in via the Form's `fieldsTypes` property. [T-comb-form options](https://github.com/gcanti/tcomb-form-native#rendering-options)
 are passed in via our Form component's  individual  `fieldsOptions`, `fieldsStyleConfig`, `style`,
  and `templates` props, respectively.

__Important Note__: T-comb-form-native instances are immutable, which means attempts to dynamically
update them can result in unexpected behaviors. Consult the
  `Disable a field based on another field's value` section in t-comb-form-native's
   [api guide](https://github.com/gcanti/tcomb-form-native#api) and t-comb's
   [updating immutable instances](https://github.com/gcanti/tcomb/blob/master/docs/API.md#updating-immutable-instances)
    for more info.

#### Label Positions

Our basic form component can be configured to display the textbox (other structures in development)
 field labels above, inline with, or floating in the textbox, or hidden altogether. The default
  position is inline - the other options can be configured through the `labelPosition` property which
   accepts the enums `FormLabelPosition.Above`, `FormLabelPosition.Floating`,
    `FormLabelPosition.Hidden`, and `FormLabelPosition.Inline`, respectively.

The labelPosition templates are implemented as templates. Templates in t-comb-form native must be
 functional components. Because we need each field to ultimately be a stateful component in order to
  display activity and errors, these functional components return our stateful textbox field
   component and passes it `locals` and `labelPosition` as props. The constructor conditionally generates
    styles values from the locals stylesheet based on the labelPosition prop.

These labelPosition templates are passed into the templates field in the options object between the
 default templates (t-comb form) and the `templates` prop templates to ensure that
 1. If we have not configured a custom template, the default t-comb form templates will be used
 2. If a user inputs a field template, that field template will overwrite ours.

```javascript
    const _options = {
      stylesheet: { ...stylesheet, ...fieldsStyleConfig },
      fields: fieldsOptions,
      templates: { ...defaultTemplates, ...LabelMap[labelPosition], ...templates }
    };
```

In order to ensure that our customized form label positions were still overwritable by an individual
 user's `fieldsStyleConfig` or `template` choices

### Active, Inactive, and Error Colors

Our form component changes color and style when active, inactive, and when the validator has found
 an error. The default colors are black (#000000), grey (#cccccc), and red (#d0021b), but they can
  be changed through the `activeColor`, `errorColor`, and `inactiveColor` props. On render, the form
   component dynamically generates a stylesheet with the correct colors.

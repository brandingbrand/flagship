# FSLocator

![image](https://user-images.githubusercontent.com/2915629/29043612-de4b50ce-7b89-11e7-9305-9f1cddb9f9fe.png)

Configurable store locator component for React and React Native projects.

## Table of Contents

* [Configuration Options](#configuration-options)
* [Developer Notes](#developer-notes)
  * [Maps](#maps)
  * [Location Item Components](#location-item-components)
* [Running the Test Project](#running-the-test-project)
  * [For Web](#for-web)
* [Contributing](#contributing)
* [External Links](#external-links)

## Configuration Options

|Name|Required?|Description|Default|
|----|---------|-----------|-------|
|brandId|yes|An ID corresponding to a brand in Branding Brand's store locator management system||
|searchBarProps|no|A collection of properties to be passed to the [search bar component](https://github.com/brandingbrand/flagship/blob/master/packages/fscomponents/src/components/SearchBar.tsx)||
|locationItemProps|no|A collection of properties to be passed to the [location item component](https://github.com/brandingbrand/flagship/blob/master/packages/fscomponents/src/components/LocationItem.tsx)||
|style|no|A [React Native StyleSheet](https://facebook.github.io/react-native/docs/style.html) for styling the locator component||
|listStyle|no|A [React Native StyleSheet](https://facebook.github.io/react-native/docs/style.html) for styling the location results list.||
|format|no|A string specifying the layout of the locator component. Valid options are `list` which renders a list view only, `mapVertical` which renders a map and list in vertical orientation, and `mapHorizontal` which renders a map and list in horizontal orientation.|list|
|geoOptions|no|Geolocation options used for finding current location. [React Native Geolocation](https://facebook.github.io/react-native/docs/geolocation.html)|enableHighAccuracy=true, timeout=10000, maximumAge=10000, distanceFilter=100|

## Developer Notes

### Maps

FSLocator uses the [react-native-maps](https://github.com/airbnb/react-native-maps) components by
Airbnb for native maps. The library utilizes the appropriate maps application for the OS -- Apple
Maps for iOS and typically Google Maps for Android.

The web view utilizes [google-map-react](https://github.com/istarkov/google-map-react) which is a
React wrapper for the Google Maps API. The Google API key as well as the implementation resides in
`/src/components/MapView.web.tsx` as of this writing.

### Location Item Components

For reusability purposes, the LocationItem components which are used to display location results are
located in the [FSComponents package](https://github.com/brandingbrand/flagship/blob/master/packages/fscomponents/src/components/LocationItem.tsx).

There are a number of available configurations for the location items. For example, templates are
available with and without a detail button, phone button, and navigate button. The
desired template should be specified by way of the "format" property in locationItemProps passed
to the Locator component:

```jsx
<Locator
  brandId="254"
  locationItemProps={{
    style: S.item,
    format: '5',
    navIcon: navIcon,
    phoneIcon: phoneIcon
  }}
  ...
```

## Contributing

Please see the [Contributing Guidelines](https://github.com/brandingbrand/flagship/blob/master/CONTRIBUTING.md).

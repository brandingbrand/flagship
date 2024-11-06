# Code App Router

**Code App Router** is a powerful, flexible routing and navigation library for React Native applications. Built on top of [React Native Navigation](https://github.com/wix/react-native-navigation), it simplifies route and modal management, supports bottom tabs, nested stacks, and provides easy access to URL-based navigation. This library also offers robust TypeScript support with custom route types, guards, and an intuitive API for deep linking and dynamic navigation.

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [API Overview](#api-overview)
- [Components](#components)
  - [App Router](#app-router)
  - [Route Types](#route-types)
- [Hooks](#hooks)
  - [useRoute](#useroute)
  - [useNavigator](#usenavigator)
  - [useModal](#usemodal)
- [Advanced Features](#advanced-features)
  - [Route Guards](#route-guards)
  - [Deep Linking with useLinking](#deep-linking-with-uselinking)
- [Examples](#examples)

---

## Installation

```bash
yarn add @brandingbrand/code-app-router
```

Ensure you have `react-native-navigation`, `react` and `react-native` installed as peer dependencies.

```bash
yarn add react react-native react-native-navigation
```

## Getting Started

After installing, you can integrate Code App Router by setting up routes and configuring the navigation provider.

### Step 1: Define Your Routes

Define your routes using the provided route types (`BottomTabRoute`, `ComponentRoute`, `ActionRoute`).

```typescript
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import {Route} from '@brandingbrand/code-app-router';

const routes: Route[] = [
  {
    name: 'Home',
    path: '/',
    Component: HomeScreen,
    type: 'bottomtab',
    options: {
      bottomTab: {text: 'Home'},
    },
    stackId: 'mainStack',
  },
  {
    name: 'Profile',
    path: '/profile',
    Component: ProfileScreen,
    type: 'component',
  },
];
```

### Step 2: Register Routes and Initialize the App Router

```typescript
import {register} from '@brandingbrand/code-app-router';
import routes from './routes';

register({
  routes,
  onAppLaunched: async () => {
    console.log('App launched');
  },
  Provider: MyCustomProvider, // Optional
});
```

### Step 3: Use Navigation Hooks

The library provides hooks like `useNavigator`, `useRoute`, and `useModal` for simplified navigation management.

```typescript
import {useNavigator, useRoute} from '@brandingbrand/code-app-router';

function MyComponent() {
  const navigator = useNavigator();
  const route = useRoute();

  const goToProfile = () => navigator.push('/profile');
}
```

## API Overview

### `register({ routes, onAppLaunched, Provider })`

Registers routes and configures the root layout of the application.

- **`routes`**: Array of route definitions.
- **`onAppLaunched`** (optional): Callback invoked when the app is launched.
- **`Provider`** (optional): React component to wrap the entire app, useful for providing context or global state.

---

## Components

### App Router

`AppRouter` is a central configuration object that manages routes, guards, navigation options, and modal handling.

### Route Types

- **BottomTabRoute**: Represents a route that is part of a bottom tab navigation. Requires `options.bottomTab` for tab configuration.
- **ComponentRoute**: A route that renders a React component.
- **ActionRoute**: A route that performs an action instead of rendering a component.

## Hooks

### `useRoute`

Provides access to the current route context, including matched route data and URL parameters.

```typescript
const route = useRoute();
console.log(route.path); // Access the current path
```

### `useNavigator`

Provides navigation methods (`open`, `push`, `pop`, etc.) to manage the navigation stack.

```typescript
const navigator = useNavigator();
navigator.push('/profile');
```

### `useModal`

A hook for managing modal state within the context of `ModalContext.Provider`. Returns data, `resolve`, and `reject` functions to manage modal flow.

```typescript
const {data, resolve, reject} = useModal<MyDataType, MyResultType>();
```

---

## Advanced Features

### Route Guards

Guards are asynchronous functions that can control navigation by redirecting or canceling based on conditions like authentication or data fetching.

```typescript
const authGuard = async (to, from, {cancel, redirect}) => {
  if (!isUserAuthenticated()) {
    redirect('/login');
  }
};

const routes = [
  {
    path: '/profile',
    name: 'Profile',
    Component: ProfileScreen,
    guards: [authGuard],
  },
];
```

### Deep Linking with `useLinking`

Automatically handles incoming deep links and navigates to the appropriate screen.

```typescript
import {useLinking} from '@brandingbrand/code-app-router';

function App() {
  useLinking(); // Sets up deep linking
}
```

---

## Examples

### Open a New Screen

```typescript
function HomeScreen() {
  const navigator = useNavigator();

  const goToSettings = () => {
    navigator.push('/settings');
  };

  return (
    <Button onPress={goToSettings} title="Go to Settings" />
  );
}
```

### Display a Modal

```typescript
function MyComponent() {
  const navigator = useNavigator();

  const showMyModal = async () => {
    const result = await navigator.showModal(MyModalComponent, { someProp: 'value' });
    console.log('Modal result:', result);
  };

  return <Button onPress={showMyModal} title="Show Modal" />;
}
```

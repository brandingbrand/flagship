# Code App Router

**Code App Router** is a routing and navigation library for React Native applications built on top of [React Native Navigation](https://github.com/wix/react-native-navigation). This library provides an intuitive API for managing stacks, bottom tabs, modals, deep linking, and routing guards. It’s TypeScript-friendly, with custom route types and guards, making it flexible and easy to use.

## Table of Contents

- [Installation](#installation)
- [Setup and Configuration](#setup-and-configuration)
- [API Overview](#api-overview)
  - [Router Configuration](#router-configuration)
  - [Hooks](#hooks)
- [Defining Routes](#defining-routes)
- [Advanced Features](#advanced-features)
  - [Route Guards](#route-guards)
  - [Deep Linking](#deep-linking)
- [Examples](#examples)
- [License](#license)

---

## Installation

Install `@brandingbrand/code-app-router`:

```bash
yarn add @brandingbrand/code-app-router
```

Ensure `react-native-navigation`, `react`, and `react-native` are installed as peer dependencies:

```bash
yarn add react react-native react-native-navigation
```

## Setup and Configuration

To integrate Code App Router, define routes, configure the router, and use provided hooks for navigation.

### Step 1: Define Routes

Define your routes by specifying paths, components, and optional navigation configurations:

```typescript
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';

const routes = [
  {
    name: 'Home',
    path: '/',
    Component: HomeScreen,
    type: 'bottomtab',
    options: {bottomTab: {text: 'Home'}},
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

### Step 2: Register Routes and Initialize Router

Use the `register` function to set up routes and configure the root layout:

```typescript
import {register} from '@brandingbrand/code-app-router';
import routes from './routes';

register({
  routes,
  onAppLaunched: async () => {
    console.log('App launched');
  },
  Provider: MyCustomProvider, // Optional context provider
  setRoot: async layout => {
    // Custom logic to conditionally set the root layout
    await Navigation.setRoot(layout);
  },
});
```

## API Overview

### Router Configuration

#### `register({ routes, onAppLaunched, Provider, setRoot })`

Registers routes, configures the root layout, and initializes the app router.

- **`routes`**: Array of route definitions.
- **`onAppLaunched`** (optional): Callback to run when the app launches.
- **`Provider`** (optional): A React component for context (e.g., global state).
- **`setRoot`** (optional): Callback to set the root layout manually, useful for conditional root setup.

### Hooks

Code App Router provides various hooks for navigation and route handling:

- **`useRoute`**: Accesses the current route context, including matched route data and URL parameters.
- **`useNavigator`**: Offers navigation methods such as `open`, `push`, `pop`, `popToRoot`, `popTo`, `setStackRoot`, and `showModal`.
- **`useModal`**: Manages modal state within the context of `ModalContext.Provider`, providing `resolve` and `reject` functions to control modal flow.
- **`useLinking`**: Sets up deep linking by listening to URL changes and navigating based on the URL.
- **`useComponentId`**: Retrieves the component ID from `ComponentIdContext`, used within navigation stacks.
- **`usePathParams`**: Retrieves URL path parameters for the current route.
- **`useQueryParams`**: Retrieves query parameters from the URL.
- **`useRouteData`**: Accesses data specific to the current route.

### Example Usage of Hooks

```typescript
import { useNavigator, useRoute, useModal } from '@brandingbrand/code-app-router';

function MyComponent() {
  const navigator = useNavigator();
  const route = useRoute();
  const { resolve, reject } = useModal<MyModalDataType, MyResultType>();

  const goToProfile = () => navigator.push('/profile');

  return (
    <Button onPress={goToProfile} title="Go to Profile" />
  );
}
```

## Defining Routes

Define routes using `BottomTabRoute`, `ComponentRoute`, and `ActionRoute` types:

- **BottomTabRoute**: Represents a route in a bottom tab navigation, with a `bottomTab` option in its config.
- **ComponentRoute**: Represents a typical route that renders a React component.
- **ActionRoute**: A route that performs an action instead of rendering a component, used for non-visual navigation actions.

## Advanced Features

### Route Guards

Guards are asynchronous functions that can redirect or cancel navigation based on conditions (e.g., authentication or data loading):

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

The `useLinking` hook listens for URL changes and navigates based on the URL.

```typescript
import {useLinking} from '@brandingbrand/code-app-router';

function App() {
  useLinking(); // Enables automatic deep linking handling
}
```

## Examples

### Navigate to a New Screen

```typescript
import {useNavigator} from '@brandingbrand/code-app-router';

function HomeScreen() {
  const navigator = useNavigator();

  const goToSettings = () => navigator.push('/settings');

  return <Button onPress={goToSettings} title="Go to Settings" />;
}
```

### Display a Modal

```typescript
import {useNavigator} from '@brandingbrand/code-app-router';

function MyComponent() {
  const navigator = useNavigator();

  const showMyModal = async () => {
    const result = await navigator.showModal(MyModalComponent, { someProp: 'value' });
    console.log('Modal result:', result);
  };

  return <Button onPress={showMyModal} title="Show Modal" />;
}
```

### Fetching Path and Query Parameters

```typescript
import { usePathParams, useQueryParams } from '@brandingbrand/code-app-router';

function SearchResults() {
  const pathParams = usePathParams();
  const queryParams = useQueryParams();

  return (
    <div>
      <p>Path Parameter: {pathParams.id}</p>
      <p>Query Parameter: {queryParams.search}</p>
    </div>
  );
}
```

### Customizing Root Setup with `setRoot`

Using `setRoot` to apply custom root layout logic:

```typescript
register({
  routes,
  setRoot: async layout => {
    // Custom logic before setting the root
    if (user.isAuthenticated) {
      await Navigation.setRoot(layout);
    } else {
      await Navigation.setRoot({
        stack: {
          children: [{component: {name: 'LoginScreen'}}],
        },
      });
    }
  },
});
```

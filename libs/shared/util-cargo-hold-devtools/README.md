# Cargo Hold Devtools

Based on [NgRx Store Devtools](https://github.com/ngrx/platform/tree/master/modules/store-devtools)

## Usage

```ts
import {
  Store,
  combineActionReducers,
  createActionCreator,
  matches,
  on,
} from '@brandingbrand/cargo-hold';
import { addDevtools } from '@brandingbrand/cargo-hold-devtools';

// Create Store as normal
const store = new Store({ count: 0 });

// Add Devtools after creating Store
addDevtools(store);

/**
 * Use Cargo Hold
 */
const add = createActionCreator({
  actionKey: 'add',
});

const subtract = createActionCreator({
  actionKey: 'subtract',
});

store.registerReducer(
  combineActionReducers(
    on(matches(add), () => ({ count }) => ({ count: count + 1 })),
    on(matches(subtract), () => ({ count }) => ({ count: count - 1 }))
  )
);

store.dispatch(add.create());
store.dispatch(add.create());
store.dispatch(subtract.create());
store.dispatch(subtract.create());
store.dispatch(add.create());
```

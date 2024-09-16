import React from 'react';

import {ModalData, RouteMatch} from './types';

/**
 * React context to provide a unique component identifier.
 *
 * @type {React.Context<string | null>}
 */
export const ComponentIdContext = React.createContext<string | null>(null);

// Assign a display name to the ComponentIdContext for easier debugging in development
// eslint-disable-next-line no-undef
if (__DEV__) {
  ComponentIdContext.displayName = 'ComponentIdContext';
}

/**
 * React context to provide routing information, such as the matched route, URL, and associated data.
 *
 * @type {React.Context<RouteMatch | null>}
 */
export const RouteContext = React.createContext<RouteMatch | null>(null);

// Assign a display name to the RouteContext for easier debugging in development
// eslint-disable-next-line no-undef
if (__DEV__) {
  RouteContext.displayName = 'RouteContext';
}

/**
 * Context for managing modal data and actions, such as resolve and reject.
 *
 * This context is designed to be used with modal components that require dynamic
 * data types. The `ModalData` type is parameterized with `unknown` to allow any
 * type of data to be passed and returned, ensuring type safety and flexibility.
 *
 * @type {React.Context<ModalData<unknown, unknown> | null>}
 */
export const ModalContext = React.createContext<ModalData<
  unknown,
  unknown
> | null>(null);

// Assign a display name to the ModalContext for easier debugging in development
// eslint-disable-next-line no-undef
if (__DEV__) {
  ModalContext.displayName = 'ModalContext';
}

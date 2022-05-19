import type { Layout, OptionsTopBarTitle } from 'react-native-navigation';

import type {
  History,
  Location,
  LocationDescriptor,
  TransitionPromptHook,
  UnregisterCallback,
} from 'history';

import type { ActivatedRoute } from '../types';

export type ResolverListener = (route: ActivatedRoute) => void;
export type LoadingListener = (loading: boolean) => void;

export type RequiredTitle = string | (OptionsTopBarTitle & { text: string });

export interface HistoryOptions {
  basename?: string;
}

export interface FSRouterHistory extends History {
  open: ((location: LocationDescriptor) => void) & ((path: string, state?: unknown) => void);

  push: ((location: LocationDescriptor) => void) & ((path: string, state?: unknown) => void);

  pushTo: (path: string, screenId: string) => void;

  replace: ((location: LocationDescriptor) => void) & ((path: string, state?: unknown) => void);

  pop: () => void;
  popTo: (screenId: string) => void;
  popToRoot: () => void;

  goBack: () => void;
  goForward: () => void;
  go: (n: number) => void;

  observeLoading: (listener: LoadingListener) => UnregisterCallback;
  registerResolver: (id: string, listener: ResolverListener) => UnregisterCallback;

  updateTitle: (title: RequiredTitle, componentId?: string) => void;
}

export type Blocker = TransitionPromptHook | boolean | string;
export type StackedLocation = Readonly<Location> & { readonly stack: number };

export interface NativeLocation extends Location {
  layout: Layout;
}

export interface Stack {
  readonly id: string;
  readonly children: Array<Readonly<NativeLocation>>;
}

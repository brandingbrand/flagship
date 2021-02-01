import type {
  History,
  Location,
  LocationDescriptor,
  TransitionPromptHook,
  UnregisterCallback
} from 'history';

import type { ActivatedRoute } from '../types';

export type ResolverListener = (route: ActivatedRoute) => void;
export type LoadingListener = (loading: boolean) => void;

export interface FSRouterHistory extends History {
  open(path: string, state?: unknown): void;
  open(location: LocationDescriptor): void;

  push(path: string, state?: unknown): void;
  push(location: LocationDescriptor): void;

  replace(path: string, state?: unknown): void;
  replace(location: LocationDescriptor): void;

  pop(): void;

  goBack(): void;
  goForward(): void;
  go(n: number): void;

  observeLoading(listener: LoadingListener): UnregisterCallback;
  registerResolver(listener: ResolverListener): UnregisterCallback;
}

export type Blocker = string | boolean | TransitionPromptHook;
export type StackedLocation = Readonly<Location> & { readonly stack: number };
export interface Stack {
  readonly id: string;
  readonly children: Readonly<Location>[];
}

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

export interface RouterHistory extends History {
  open(path: string, state?: unknown): Promise<void>;
  open(location: LocationDescriptor): Promise<void>;

  push(path: string, state?: unknown): Promise<void>;
  push(location: LocationDescriptor): Promise<void>;

  replace(path: string, state?: unknown): Promise<void>;
  replace(location: LocationDescriptor): Promise<void>;

  pop(): Promise<void>;

  goBack(): Promise<void>;
  goForward(): Promise<void>;
  go(n: number): Promise<void>;

  observeLoading(listener: LoadingListener): UnregisterCallback;
  registerResolver(path: string, listener: ResolverListener): UnregisterCallback;
}

export type Blocker = string | boolean | TransitionPromptHook;
export type StackedLocation = Location & { stack: number };
export interface Stack {
  id: string;
  children: Location[];
}

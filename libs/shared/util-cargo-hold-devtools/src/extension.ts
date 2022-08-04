import type { AnyAction } from '@brandingbrand/cargo-hold';
import { UpdateReducersAction } from '@brandingbrand/cargo-hold';
import { Inject, InjectionToken } from '@brandingbrand/fslinker';

import {
  EMPTY,
  Observable,
  catchError,
  concatMap,
  debounceTime,
  filter,
  of as just,
  map,
  share,
  switchMap,
  take,
  takeUntil,
  timeout,
} from 'rxjs';

import * as DevtoolsActions from './actions';
import type { SerializationOptions } from './config';
import { STORE_DEVTOOLS_CONFIG, StoreDevtoolsConfig } from './config';
import { DevtoolsDispatcher } from './devtools-dispatcher';
import type { LiftedAction, LiftedState } from './reducer';
import {
  extensionAction,
  isActionFiltered,
  isLiftedAction,
  sanitizeAction,
  sanitizeActions,
  sanitizeState,
  sanitizeStates,
  shouldFilterActions,
  unliftState,
} from './utils';

export interface ExtensionLiftedAction {
  type: string;
  action: AnyAction;
  timestamp: number;
}

export interface ReduxDevtoolsExtensionConnection {
  subscribe: (listener: (change: ExternalAction) => void) => void;
  unsubscribe: () => void;
  send: (action: ExtensionLiftedAction, state: unknown) => void;
  init: (state?: unknown) => void;
  error: (anyErr: unknown) => void;
}
export interface ReduxDevtoolsExtensionConfig {
  features?: boolean | object;
  name: string | undefined;
  maxAge?: number;
  autoPause?: boolean;
  serialize?: SerializationOptions | boolean;
}

export interface ReduxDevtoolsExtension {
  connect: (options: ReduxDevtoolsExtensionConfig) => ReduxDevtoolsExtensionConnection;
  send: (action: unknown, state: unknown, options: ReduxDevtoolsExtensionConfig) => void;
}

export const ExtensionActionTypes = {
  START: 'START',
  DISPATCH: 'DISPATCH',
  STOP: 'STOP',
  ACTION: 'ACTION',
};

export const REDUX_DEVTOOLS_EXTENSION = new InjectionToken<ReduxDevtoolsExtension>(
  '@brandingbrand/cargo-hold-devtools Redux Devtools Extension'
);

interface ExternalAction {
  type: string;
  payload?: any;
}

export class DevtoolsExtension {
  constructor(
    @Inject(REDUX_DEVTOOLS_EXTENSION) devtoolsExtension: ReduxDevtoolsExtension,
    @Inject(STORE_DEVTOOLS_CONFIG) private readonly config: StoreDevtoolsConfig,
    private readonly dispatcher: DevtoolsDispatcher
  ) {
    this.devtoolsExtension = devtoolsExtension;
    this.createActionStreams();
  }

  private readonly devtoolsExtension: ReduxDevtoolsExtension;
  private extensionConnection!: ReduxDevtoolsExtensionConnection;

  public liftedActions$!: Observable<AnyAction>;
  public actions$!: Observable<DevtoolsActions.All>;
  public start$!: Observable<ExternalAction>;

  private createChangesObservable(): Observable<ExternalAction> {
    if (this.devtoolsExtension === undefined) {
      return EMPTY;
    }

    return new Observable((subscriber) => {
      const connection = this.devtoolsExtension.connect(this.getExtensionConfig(this.config));
      this.extensionConnection = connection;
      connection.init();

      connection.subscribe((change) => {
        subscriber.next(change);
      });

      return connection.unsubscribe.bind(connection);
    });
  }

  private createActionStreams(): void {
    // Listens to all changes
    const changes$ = this.createChangesObservable().pipe(share());

    // Listen for the start action
    const start$ = changes$.pipe(filter((change) => change.type === ExtensionActionTypes.START));

    // Listen for the stop action
    const stop$ = changes$.pipe(filter((change) => change.type === ExtensionActionTypes.STOP));

    // Listen for lifted actions
    const liftedActions$ = changes$.pipe(
      filter((change) => change.type === ExtensionActionTypes.DISPATCH),
      map((change) => this.unwrapAction(change.payload)),
      concatMap((action) => {
        if (action.type === DevtoolsActions.ImportState.type) {
          // State imports may happen in two situations:
          // 1. Explicitly by user
          // 2. User activated the "persist state accross reloads" option
          //    and now the state is imported during reload.
          // Because of option 2, we need to give possible
          // lazy loaded reducers time to instantiate.
          // As soon as there is no UPDATE action within 1 second,
          // it is assumed that all reducers are loaded.
          return this.dispatcher.action$.pipe(
            filter((action) => action.type === UpdateReducersAction.type),
            timeout(1000),
            debounceTime(1000),
            map(() => action),
            catchError(() => just(action)),
            take(1)
          );
        }
        return just(action);
      })
    );

    // Listen for unlifted actions
    const actions$ = changes$.pipe(
      filter((change) => change.type === ExtensionActionTypes.ACTION),
      map((change) => this.unwrapAction(change.payload))
    );

    const actionsUntilStop$ = actions$.pipe(takeUntil(stop$));
    const liftedUntilStop$ = liftedActions$.pipe(takeUntil(stop$));
    this.start$ = start$;

    // Only take the action sources between the start/stop events
    this.actions$ = this.start$.pipe(switchMap(() => actionsUntilStop$));
    this.liftedActions$ = this.start$.pipe(switchMap(() => liftedUntilStop$));
  }

  private unwrapAction(action: AnyAction | string): DevtoolsActions.All {
    // eslint-disable-next-line no-eval
    return typeof action === 'string' ? eval(`(${action})`) : action;
  }

  private getExtensionConfig(config: StoreDevtoolsConfig): ReduxDevtoolsExtensionConfig {
    const extensionOptions: ReduxDevtoolsExtensionConfig = {
      name: config.name,
      features: config.features,
      serialize: config.serialize,
      autoPause: config.autoPause ?? false,
      // The action/state sanitizers are not added to the config
      // because sanitation is done in this class already.
      // It is done before sending it to the devtools extension for consistency:
      // - If we call extensionConnection.send(...),
      //   the extension would call the sanitizers.
      // - If we call devtoolsExtension.send(...) (aka full state update),
      //   the extension would NOT call the sanitizers, so we have to do it ourselves.
    };
    if (config.maxAge !== false /* support === 0 */) {
      extensionOptions.maxAge = config.maxAge;
    }
    return extensionOptions;
  }

  private sendToReduxDevtools(send: Function): void {
    try {
      send();
    } catch (error: any) {
      console.warn('@ngrx/store-devtools: something went wrong inside the redux devtools', error);
    }
  }

  public notify(action: LiftedAction, state: LiftedState): void {
    if (this.devtoolsExtension === undefined) {
      return;
    }
    // Check to see if the action requires a full update of the liftedState.
    // If it is a simple action generated by the user's app and the recording
    // is not locked/paused, only send the action and the current state (fast).
    //
    // A full liftedState update (slow: serializes the entire liftedState) is
    // only required when:
    //   a) redux-devtools-extension fires the @@Init action (ignored by
    //      @brandingbrand/cargo-hold-devtools)
    //   b) an action is generated by a cargo hold module (e.g. @brandingbrand/cargo-hold-effects/init
    //      or @brandingbrand/cargo-hold/update-reducers)
    //   c) the state has been recomputed due to time-traveling
    //   d) any action that is not a PerformAction to err on the side of
    //      caution.

    if (isLiftedAction(action)) {
      if (state.isLocked || state.isPaused) {
        return;
      }

      const currentState = unliftState(state);
      if (
        shouldFilterActions(this.config) &&
        isActionFiltered(
          currentState,
          action,
          this.config.predicate,
          this.config.actionsSafelist,
          this.config.actionsBlocklist
        )
      ) {
        return;
      }
      const sanitizedState = this.config.stateSanitizer
        ? sanitizeState(this.config.stateSanitizer, currentState, state.currentStateIndex)
        : currentState;
      const sanitizedAction = this.config.actionSanitizer
        ? sanitizeAction(this.config.actionSanitizer, action, state.nextActionId)
        : action;

      this.sendToReduxDevtools(() => {
        this.extensionConnection.send(extensionAction(sanitizedAction), sanitizedState);
      });
    } else {
      // Requires full state update
      const sanitizedLiftedState = {
        ...state,
        stagedActionIds: state.stagedActionIds,
        actionsById: this.config.actionSanitizer
          ? sanitizeActions(this.config.actionSanitizer, state.actionsById)
          : state.actionsById,
        computedStates: this.config.stateSanitizer
          ? sanitizeStates(this.config.stateSanitizer, state.computedStates)
          : state.computedStates,
      };

      this.sendToReduxDevtools(() => {
        this.devtoolsExtension.send(
          null,
          sanitizedLiftedState,
          this.getExtensionConfig(this.config)
        );
      });
    }
  }
}

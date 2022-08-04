import type { ActionBus, AnyAction } from '@brandingbrand/cargo-hold';
import { IStore } from '@brandingbrand/cargo-hold';
import { Inject } from '@brandingbrand/fslinker';

import type { Observable, Observer, Subscription } from 'rxjs';
import { ReplaySubject, queueScheduler } from 'rxjs';
import { map, observeOn, scan, withLatestFrom } from 'rxjs/operators';

import * as Actions from './actions';
import { STORE_DEVTOOLS_CONFIG, StoreDevtoolsConfig } from './config';
import { DevtoolsDispatcher } from './devtools-dispatcher';
import { DevtoolsExtension } from './extension';
import type { LiftedAction, LiftedState } from './reducer';
import { liftInitialState, liftReducerWith } from './reducer';
import {
  filterLiftedState,
  isLiftedAction,
  liftAction,
  shouldFilterActions,
  unliftState,
} from './utils';

export class StoreDevtools implements Observer<Actions.All> {
  constructor(
    cargoHold: IStore,
    dispatcher: DevtoolsDispatcher,
    extension: DevtoolsExtension,
    @Inject(STORE_DEVTOOLS_CONFIG) config: StoreDevtoolsConfig
  ) {
    const liftedInitialState = liftInitialState(cargoHold.initialState);
    const liftReducer = liftReducerWith(cargoHold.initialState, liftedInitialState, config);

    const liftedAction$ = cargoHold.action$.pipe(map(liftAction)).pipe(observeOn(queueScheduler));
    const liftedReducer$ = cargoHold.reducer$.pipe(map(liftReducer));

    const liftedStateSubject = new ReplaySubject<LiftedState>(1);

    const liftedStateSubscription = liftedAction$
      .pipe(
        withLatestFrom(liftedReducer$),
        scan(
          ({ state: liftedState }, [action, reducer]) => {
            let reducedLiftedState = reducer(action)(liftedState);
            // On full state update
            // If we have actions filters, we must filter completely our lifted state to be sync with the extension
            if (!isLiftedAction(action) && shouldFilterActions(config)) {
              reducedLiftedState = filterLiftedState(
                reducedLiftedState,
                config.predicate,
                config.actionsSafelist,
                config.actionsBlocklist
              );
            }
            // Extension should be sent the sanitized lifted state
            extension.notify(action, reducedLiftedState);
            return { state: reducedLiftedState, action };
          },
          { state: liftedInitialState, action: null as LiftedAction | null }
        )
      )
      .subscribe(({ state }) => {
        liftedStateSubject.next(state);
      });

    const dispatchSubscription = extension.actions$.subscribe((action) => {
      cargoHold.dispatch(action);
    });

    const extensionStartSubscription = extension.start$.subscribe(() => {
      this.refresh();
    });

    const liftedState$ = liftedStateSubject.asObservable();
    const state$ = liftedState$.pipe(map(unliftState));

    this.extensionStartSubscription = extensionStartSubscription;
    this.dispatchSubscription = dispatchSubscription;
    this.stateSubscription = liftedStateSubscription;
    this.dispatcher = dispatcher;
    this.liftedState = liftedState$;
    this.state = state$;
  }

  private readonly stateSubscription: Subscription;
  private readonly dispatchSubscription: Subscription;
  private readonly extensionStartSubscription: Subscription;
  public dispatcher: ActionBus;
  public liftedState: Observable<LiftedState>;
  public state: Observable<unknown>;

  public dispatch(action: Actions.All): void {
    this.dispatcher.dispatch(action);
  }

  public next(action: Actions.All): void {
    this.dispatcher.dispatch(action);
  }

  public error(error: unknown): void {}

  public complete(): void {}

  public performAction(action: AnyAction): void {
    this.dispatch(Actions.PerformAction.create(action, Number(Date.now())));
  }

  public refresh(): void {
    this.dispatch(Actions.Refresh.create());
  }

  public reset(): void {
    this.dispatch(Actions.Reset.create(Number(Date.now())));
  }

  public rollback(): void {
    this.dispatch(Actions.Rollback.create(Number(Date.now())));
  }

  public commit(): void {
    this.dispatch(Actions.Commit.create(Number(Date.now())));
  }

  public sweep(): void {
    this.dispatch(Actions.Sweep.create());
  }

  public toggleAction(id: number): void {
    this.dispatch(Actions.ToggleAction.create(id));
  }

  public jumpToAction(actionId: number): void {
    this.dispatch(Actions.JumpToAction.create(actionId));
  }

  public jumpToState(index: number): void {
    this.dispatch(Actions.JumpToState.create(index));
  }

  public importState(nextLiftedState: unknown): void {
    this.dispatch(Actions.ImportState.create(nextLiftedState));
  }

  public lockChanges(status: boolean): void {
    this.dispatch(Actions.LockChanges.create(status));
  }

  public pauseRecording(status: boolean): void {
    this.dispatch(Actions.PauseRecording.create(status));
  }
}

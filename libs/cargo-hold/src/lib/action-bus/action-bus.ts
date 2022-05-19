import type { Observable } from 'rxjs';
import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import type { PAYLOAD } from '../internal/tokens';

import type { TypeGuard } from './action';
import type { Action, ActionHandler, AnyAction, AnyActionSpecifier } from './action-bus.types';

export class ActionBus {
  protected readonly subscriptions = new Subscription();
  protected readonly _action$ = new Subject<AnyAction>();

  constructor() {}

  public get action$(): Observable<AnyAction> {
    return this._action$.asObservable();
  }

  public dispatch = (action: AnyAction): void => {
    this._action$.next(action);
  };

  public registerHandler = <Specifier extends AnyActionSpecifier>(
    guard: TypeGuard<AnyActionSpecifier, Specifier>,
    handler: ActionHandler<
      Action<Specifier['type'], NonNullable<Specifier[typeof PAYLOAD]>, Specifier['subtype']>
    >
  ): Subscription => {
    const subscription = this._action$
      .pipe(
        filter(
          (
            value
          ): value is Action<
            Specifier['type'],
            NonNullable<Specifier[typeof PAYLOAD]>,
            Specifier['subtype']
          > => guard(value)
        )
      )
      .subscribe(handler);
    this.subscriptions.add(subscription);
    return subscription;
  };

  public dispose = (): void => {
    this.subscriptions.unsubscribe();
    this._action$.complete();
  };
}

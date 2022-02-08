import type { PAYLOAD } from '../internal/tokens';
import type { AnyAction, ActionHandler, Action, AnyActionSpecifier } from './action-bus.types';
import type { TypeGuard } from './action';

import { Subject, Subscription, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

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
  ): void => {
    this.subscriptions.add(
      this._action$
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
        .subscribe(handler)
    );
  };

  public dispose = (): void => {
    this.subscriptions.unsubscribe();
    this._action$.complete();
  };
}

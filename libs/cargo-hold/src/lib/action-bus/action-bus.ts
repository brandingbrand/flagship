import type { Observable } from 'rxjs';
import { Subject, Subscription } from 'rxjs';

import type { PAYLOAD } from '../internal/tokens';

import type { TypeGuard } from './action';
import { createHandler } from './action';
import type {
  Action,
  ActionHandler,
  AnyAction,
  AnyActionHandler,
  AnyActionSpecifier,
  Dispatch,
} from './action-bus.types';

export class ActionBus {
  protected readonly subscriptions = new Subscription();
  protected readonly _action$ = new Subject<AnyAction>();

  constructor() {}

  public get action$(): Observable<AnyAction> {
    return this._action$.asObservable();
  }

  public dispatch: Dispatch = (action) => {
    this._action$.next(action);
  };

  public registerHandler(handler: AnyActionHandler): Subscription;
  public registerHandler<Specifier extends AnyActionSpecifier>(
    guard: TypeGuard<AnyActionSpecifier, Specifier>,
    handler: ActionHandler<
      Action<Specifier['type'], NonNullable<Specifier[typeof PAYLOAD]>, Specifier['subtype']>
    >
  ): Subscription;
  public registerHandler<Specifier extends AnyActionSpecifier>(
    guardOrActionHandler: AnyActionHandler | TypeGuard<AnyActionSpecifier, Specifier>,
    handler?: ActionHandler<
      Action<Specifier['type'], NonNullable<Specifier[typeof PAYLOAD]>, Specifier['subtype']>
    >
  ): Subscription {
    if (handler) {
      const guard = guardOrActionHandler as TypeGuard<AnyActionSpecifier, Specifier>;
      const actionHandler = createHandler(guard, handler);
      const subscription = actionHandler(this._action$);
      this.subscriptions.add(subscription);
      return subscription;
    }

    const actionHandler = guardOrActionHandler as AnyActionHandler;
    const subscription = actionHandler(this._action$);
    this.subscriptions.add(subscription);
    return subscription;
  }

  public dispose = (): void => {
    this.subscriptions.unsubscribe();
    this._action$.complete();
  };
}

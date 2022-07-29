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

/**
 * Action buses provide a way to subscribe to actions dispatched anywhere.
 */
export class ActionBus {
  private readonly internalAction$ = new Subject<AnyAction>();
  protected readonly subscriptions = new Subscription();

  /**
   * Getter for observable actions
   *
   * @return Action observable
   */
  public get action$(): Observable<AnyAction> {
    return this.internalAction$.asObservable();
  }

  /**
   * Dispatches an action into the action bus
   *
   * @param action The action to dispatch
   */
  public dispatch: Dispatch = (action) => {
    this.internalAction$.next(action);
  };

  /**
   * Registers a handler to this action bus
   *
   * @param handler handler that gets registered
   */
  public registerHandler(handler: AnyActionHandler): Subscription;

  /**
   * Registers a handler to this action bus
   *
   * @param guard type guard to filter actions
   * @param handler handler that gets registered
   */
  public registerHandler<ActionType extends AnyAction>(
    guard: TypeGuard<AnyAction, ActionType>,
    handler: ActionHandler<
      Action<ActionType['type'], NonNullable<ActionType[typeof PAYLOAD]>, ActionType['subtype']>
    >
  ): Subscription;
  public registerHandler<ActionType extends AnyAction>(
    guardOrActionHandler: AnyActionHandler | TypeGuard<AnyAction, ActionType>,
    handler?: ActionHandler<
      Action<ActionType['type'], NonNullable<ActionType[typeof PAYLOAD]>, ActionType['subtype']>
    >
  ): Subscription {
    if (handler) {
      const guard = guardOrActionHandler as TypeGuard<AnyActionSpecifier, ActionType>;
      const actionHandler = createHandler(guard, handler);
      const subscription = actionHandler(this.internalAction$);
      this.subscriptions.add(subscription);
      return subscription;
    }

    const actionHandler = guardOrActionHandler as AnyActionHandler;
    const subscription = actionHandler(this.internalAction$);
    this.subscriptions.add(subscription);
    return subscription;
  }

  /**
   * Releases all subscriptions before destroying the action bus
   *
   */
  public dispose = (): void => {
    this.subscriptions.unsubscribe();
    this.internalAction$.complete();
  };
}

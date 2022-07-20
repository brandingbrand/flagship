import type { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import type { PAYLOAD } from '../internal/tokens';
import type { NonEmptyArray } from '../internal/util/functional/non-empty-array.types';

import type {
  Action,
  ActionCreator,
  ActionHandler,
  AnyAction,
  AnyActionSpecifier,
} from './action-bus.types';

export type TypeGuard<A, B extends A> = (val: A) => val is B;

export interface CreateActionOptions<
  ActionKey extends string,
  Subtype extends string | undefined,
  Payload,
  Params extends unknown[]
> {
  actionKey: ActionKey;
  subtype?: Subtype;
  source?: string | symbol;
  metadata?: Record<string, unknown>;
  callback?: (...params: Params) => Payload;
}

export const createActionCreator = <
  ActionKey extends string,
  Subtype extends string | undefined,
  Payload,
  Params extends unknown[] = []
>(
  options: CreateActionOptions<ActionKey, Subtype, Payload, Params>
): ActionCreator<ActionKey, Subtype, Payload, Params> => ({
  type: options.actionKey,
  subtype: options.subtype,
  source: options.source,
  filterMetadata: options.metadata,
  create: (...params) => ({
    type: options.actionKey,
    subtype: options.subtype,
    source: options.source,
    filterMetadata: options.metadata,
    payload: options.callback ? options.callback(...params) : ({} as Payload),
  }),
});

export const createHandler =
  <ActionType extends AnyAction>(
    guard: TypeGuard<AnyAction, ActionType>,
    handler: ActionHandler<
      Action<ActionType['type'], NonNullable<ActionType[typeof PAYLOAD]>, ActionType['subtype']>
    >
  ) =>
  (action$: Observable<AnyAction>) =>
    action$
      .pipe(
        filter(
          (
            value
          ): value is Action<
            ActionType['type'],
            NonNullable<ActionType[typeof PAYLOAD]>,
            ActionType['subtype']
          > => guard(value)
        )
      )
      .subscribe(handler);

export const ofType = <ActionType extends AnyActionSpecifier>(
  ...selectActions: NonEmptyArray<ActionType>
) =>
  filter(
    (
      action: AnyAction
    ): action is Action<
      ActionType['type'],
      NonNullable<ActionType[typeof PAYLOAD]>,
      ActionType['subtype']
    > => selectActions.some((selectAction) => selectAction.type === action.type)
  );

export const notOfType = (...selectActions: NonEmptyArray<AnyActionSpecifier>) =>
  filter((action: AnyAction) =>
    selectActions.every((selectAction) => selectAction.type !== action.type)
  );

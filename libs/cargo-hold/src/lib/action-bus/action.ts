import type { PAYLOAD } from '../internal/tokens';
import type {
  Action,
  ActionCreator,
  ActionSpecifier,
  AnyActionSpecifier,
} from './action-bus.types';

import { filter } from 'rxjs/operators';

import { NonEmptyArray } from '../internal/util/functional/non-empty-array.types';

export type TypeGuard<A, B extends A> = (val: A) => val is B;

export type CreateActionOptions<
  ActionKey extends string,
  Subtype extends string | undefined,
  Payload,
  Params extends unknown[]
> = {
  actionKey: ActionKey;
  subtype?: Subtype;
  source?: string | symbol;
  callback?: (...params: Params) => Payload;
};

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
  create: (...params) => ({
    type: options.actionKey,
    subtype: options.subtype,
    source: options.source,
    payload: options.callback ? options.callback(...params) : ({} as Payload),
  }),
});

export const ofType = <ActionType extends AnyActionSpecifier>(
  ...selectActions: NonEmptyArray<ActionType>
) => {
  return filter(
    (
      action: ActionSpecifier<string, any, unknown>
    ): action is Action<
      ActionType['type'],
      NonNullable<ActionType[typeof PAYLOAD]>,
      ActionType['subtype']
    > => selectActions.some((selectAction) => selectAction.type === action.type)
  );
};

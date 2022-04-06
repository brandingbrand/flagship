import type { Action } from '../../action-bus';

type BaseAsyncAction<ActionKey extends string, TransitionKey extends string, PayloadType> = Action<
  ActionKey,
  PayloadType,
  TransitionKey
>;

export type AsyncLoadAction<ActionKey extends string, SuccessOrIdleType> = BaseAsyncAction<
  ActionKey,
  'async:load',
  SuccessOrIdleType
>;
export type AsyncFailAction<ActionKey extends string, FailureType> = BaseAsyncAction<
  ActionKey,
  'async:fail',
  FailureType
>;
export type AsyncSucceedAction<ActionKey extends string, SuccessType> = BaseAsyncAction<
  ActionKey,
  'async:succeed',
  SuccessType
>;
export type AsyncInitAction<ActionKey extends string, SuccessOrIdleType> = BaseAsyncAction<
  ActionKey,
  'async:init',
  SuccessOrIdleType
>;
export type AsyncRevertAction<ActionKey extends string, SuccessOrIdleType> = BaseAsyncAction<
  ActionKey,
  'async:revert',
  SuccessOrIdleType
>;

export type AsyncAction<
  ActionKey extends string,
  SuccessType,
  FailureType,
  IdleType = SuccessType
> =
  | AsyncInitAction<ActionKey, SuccessType | IdleType>
  | AsyncLoadAction<ActionKey, SuccessType | IdleType>
  | AsyncFailAction<ActionKey, FailureType>
  | AsyncSucceedAction<ActionKey, SuccessType>
  | AsyncRevertAction<ActionKey, SuccessType | IdleType>;

export type AsyncSubtypes = AsyncAction<string, unknown, unknown>['subtype'];

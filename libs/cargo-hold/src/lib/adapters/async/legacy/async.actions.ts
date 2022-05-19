import type { ActionCreator } from '../../../action-bus';
import { createActionCreator } from '../../../action-bus';

/**
 * AsyncActionCreators are utilities to both filter reducers/effects and then trigger those reducers
 * and effects upon dispatch.
 *
 * @deprecated Use builder-based async functions.
 */
export interface AsyncActionCreators<
  ActionKey extends string,
  Payload,
  FailPayload,
  EmptyPayload = Payload
> {
  init: ActionCreator<
    ActionKey,
    'async:init',
    EmptyPayload | Payload,
    [payload: EmptyPayload | Payload]
  >;
  load: ActionCreator<
    ActionKey,
    'async:load',
    EmptyPayload | Payload,
    [payload: EmptyPayload | Payload]
  >;
  loadMore: ActionCreator<ActionKey, 'async:load-more', Payload, [payload: Payload]>;
  succeed: ActionCreator<ActionKey, 'async:succeed', Payload, [payload: Payload]>;
  fail: ActionCreator<ActionKey, 'async:fail', FailPayload, [failure: FailPayload]>;
  revert: ActionCreator<
    ActionKey,
    'async:revert',
    EmptyPayload | Payload,
    [payload: EmptyPayload | Payload]
  >;
}

/**
 *
 * @param actionKey The key by which you want to call async actions to set state.
 * @param source Optional source to emit with the actions to "lock in" these actions to target
 * specific reducers.
 * @param metadata
 * @return `AsyncActionCreators` - init, load, succeed, fail, & revert.
 * @deprecated Use builder-based async functions.
 */
export const createAsyncActionCreators = <
  ActionKey extends string,
  Payload,
  FailPayload,
  EmptyPayload = Payload
>(
  actionKey: ActionKey,
  source?: string | symbol,
  metadata?: Record<string, unknown>
): AsyncActionCreators<ActionKey, Payload, FailPayload, EmptyPayload> => ({
  init: createActionCreator({
    actionKey,
    subtype: 'async:init',
    source,
    metadata,
    callback: (payload) => payload,
  }),
  load: createActionCreator({
    actionKey,
    subtype: 'async:load',
    source,
    metadata,
    callback: (payload) => payload,
  }),
  loadMore: createActionCreator({
    actionKey,
    subtype: 'async:load-more',
    source,
    metadata,
    callback: (payload) => payload,
  }),
  succeed: createActionCreator({
    actionKey,
    subtype: 'async:succeed',
    source,
    metadata,
    callback: (payload) => payload,
  }),
  fail: createActionCreator({
    actionKey,
    subtype: 'async:fail',
    source,
    metadata,
    callback: (failure) => failure,
  }),
  revert: createActionCreator({
    actionKey,
    subtype: 'async:revert',
    source,
    metadata,
    callback: (payload) => payload,
  }),
});

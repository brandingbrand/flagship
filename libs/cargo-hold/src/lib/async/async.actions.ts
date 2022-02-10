import { ActionCreator, createActionCreator } from '../action-bus';

/**
 * AsyncActionCreators are utilities to both filter reducers/effects and then trigger those reducers
 * and effects upon dispatch.
 */
export type AsyncActionCreators<ActionKey extends string, Payload, FailPayload> = {
  init: ActionCreator<ActionKey, 'async:init', Payload | undefined, [payload: Payload | undefined]>;
  load: ActionCreator<ActionKey, 'async:load', Payload | undefined, [payload: Payload | undefined]>;
  loadMore: ActionCreator<ActionKey, 'async:load-more', Payload, [payload: Payload]>;
  succeed: ActionCreator<ActionKey, 'async:succeed', Payload, [payload: Payload]>;
  fail: ActionCreator<ActionKey, 'async:fail', FailPayload, [failure: FailPayload]>;
  revert: ActionCreator<
    ActionKey,
    'async:revert',
    Payload | undefined,
    [payload: Payload | undefined]
  >;
};

/**
 *
 * @param actionKey The key by which you want to call async actions to set state.
 * @param source Optional source to emit with the actions to "lock in" these actions to target
 * specific reducers.
 * @returns `AsyncActionCreators` - init, load, succeed, fail, & revert.
 */
export const createAsyncActionCreators = <ActionKey extends string, Payload, FailPayload>(
  actionKey: ActionKey,
  source?: string | symbol
): AsyncActionCreators<ActionKey, Payload, FailPayload> => ({
  init: createActionCreator({
    actionKey,
    subtype: 'async:init',
    source,
    callback: (payload) => payload,
  }),
  load: createActionCreator({
    actionKey,
    subtype: 'async:load',
    source,
    callback: (payload) => payload,
  }),
  loadMore: createActionCreator({
    actionKey,
    subtype: 'async:load-more',
    source,
    callback: (payload) => payload,
  }),
  succeed: createActionCreator({
    actionKey,
    subtype: 'async:succeed',
    source,
    callback: (payload) => payload,
  }),
  fail: createActionCreator({
    actionKey,
    subtype: 'async:fail',
    source,
    callback: (failure) => failure,
  }),
  revert: createActionCreator({
    actionKey,
    subtype: 'async:revert',
    source,
    callback: (payload) => payload,
  }),
});

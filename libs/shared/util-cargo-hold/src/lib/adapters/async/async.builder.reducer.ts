import { branch, pipe } from '@brandingbrand/standard-compose';
import { withLens } from '@brandingbrand/standard-lens';

import type { Action, ActionCreator } from '../../action-bus';
import type { AnyActionReducer, StateReducer } from '../../store';
import { combineActionReducers, matches, on } from '../../store';

import {
  buildFailActionCreator,
  buildInitActionCreator,
  buildLoadingActionCreator,
  buildLoadingMoreActionCreator,
  buildRevertActionCreator,
  buildSucceedActionCreator,
} from './async.builder.actions';
import type {
  WithActionKey,
  WithIdleType,
  WithLensInstance,
  WithPayloadTypes,
  WithSuccessType,
} from './async.builder.types';
import {
  createFailureState,
  createIdleState,
  createLoadingMoreState,
  createLoadingState,
  createSuccessState,
} from './async.stateCreators';
import type {
  AsyncIdleState,
  AsyncLoadingMoreState,
  AsyncLoadingState,
  AsyncState,
  AsyncSuccessState,
} from './async.types';

/**
 * Given a payload it will return a state reducer that gives us an idle state of that payload.
 *
 * @param _builder
 * @return
 */
export const buildInitStateReducer =
  <IdleType>(_builder: WithIdleType<IdleType>) =>
  (payload: IdleType) =>
  () =>
    createIdleState(payload);

/**
 * Given a payload it will return a state reducer that gives us a loading state of that payload.
 *
 * @param _builder
 * @return
 */
export const buildLoadingStateReducer =
  <SuccessType, IdleType>(_builder: WithIdleType<IdleType> & WithSuccessType<SuccessType>) =>
  (payload: IdleType | SuccessType) =>
  () =>
    createLoadingState(payload);

/**
 * Given a payload it will return a state reducer that gives us a loading more state
 * of that payload.
 *
 * @param _builder
 * @return
 */
export const buildLoadingMoreStateReducer =
  <SuccessType>(_builder: WithSuccessType<SuccessType>) =>
  (payload: SuccessType) =>
  () =>
    createLoadingMoreState(payload);

/**
 * Given a payload it will return a state reducer that gives us a success state of that payload.
 *
 * @param _builder
 * @return
 */
export const buildSuccessStateReducer =
  <SuccessType>(_builder: WithSuccessType<SuccessType>) =>
  (payload: SuccessType) =>
  () =>
    createSuccessState(payload);

/**
 * Given a failure it will return a state reducer that gives us a failure state.
 *
 * @param _builder
 * @return
 */
export const buildFailureStateReducer =
  <SuccessType, FailureType, IdleType>(
    _builder: WithPayloadTypes<SuccessType, FailureType, IdleType>
  ) =>
  (failure: FailureType) =>
  (state: AsyncState<SuccessType, FailureType, IdleType>) =>
    createFailureState(state.payload, failure);

/**
 * Given a payload it will return a state reducer that reverts to the given payload but leaving
 * the status the same.
 *
 * @param _builder
 * @return
 */
export const buildRevertStateReducer =
  <SuccessType, FailureType, IdleType>(
    _builder: WithPayloadTypes<SuccessType, FailureType, IdleType>
  ) =>
  (payload: IdleType | SuccessType): StateReducer<AsyncState<SuccessType, FailureType, IdleType>> =>
  (state: AsyncState<SuccessType, FailureType, IdleType>) =>
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- fixes a nuanced type issue.
    ({
      ...state,
      payload,
    } as AsyncState<SuccessType, FailureType, IdleType>);

const makeActionReducer = <
  ActionKeyType extends string,
  SubtypeType extends string | undefined,
  PayloadType,
  StateType,
  ParamsType extends unknown[]
>(
  actionCreator: ActionCreator<ActionKeyType, SubtypeType, PayloadType, ParamsType>,
  stateReducer: (payload: PayloadType) => StateReducer<StateType>
): AnyActionReducer<StateType> =>
  on(matches(actionCreator), (action) => stateReducer(action.payload));

/**
 * Given a builder this makes an action reducer that results in an idle state.
 *
 * @param builder A builder with an action key and an idle type.
 * @return
 */
export const buildInitActionReducer = <ActionKeyType extends string, IdleType>(
  builder: WithActionKey<ActionKeyType> & WithIdleType<IdleType>
): AnyActionReducer<AsyncIdleState<IdleType>> =>
  pipe(
    builder,
    // buildInitActionCreator will take WithMetadata and do the right thing.
    branch(buildInitActionCreator, buildInitStateReducer),
    ([actionCreator, stateReducerCreator]) => makeActionReducer(actionCreator, stateReducerCreator)
  );

/**
 * Given a builder this makes an action reducer that results in a loading state.
 *
 * @param builder A builder with an action key and a loading type.
 * @return
 */
export const buildLoadingActionReducer = <ActionKeyType extends string, SuccessType, IdleType>(
  builder: WithActionKey<ActionKeyType> & WithIdleType<IdleType> & WithSuccessType<SuccessType>
): AnyActionReducer<AsyncLoadingState<IdleType | SuccessType>> =>
  pipe(
    builder,
    branch(buildLoadingActionCreator, buildLoadingStateReducer),
    ([actionCreator, stateReducerCreator]) =>
      on(
        matches(actionCreator),
        (action) =>
          stateReducerCreator(action.payload) as () => AsyncLoadingState<IdleType | SuccessType>
      )
  );
/**
 * Given a builder this makes an action reducer that results in a loading more state.
 *
 * @param builder A builder with an action key and a loading more type.
 * @return
 */
export const buildLoadingMoreActionReducer = <ActionKeyType extends string, SuccessType>(
  builder: WithActionKey<ActionKeyType> & WithSuccessType<SuccessType>
): AnyActionReducer<AsyncLoadingMoreState<SuccessType>> =>
  pipe(
    builder,
    branch(buildLoadingMoreActionCreator, buildLoadingMoreStateReducer),
    ([actionCreator, stateReducerCreator]) => makeActionReducer(actionCreator, stateReducerCreator)
  );

/**
 * Given a builder this makes an action reducer that results in a success state.
 *
 * @param builder A builder with an action key and a success type.
 * @return
 */
export const buildSuccessActionReducer = <ActionKeyType extends string, SuccessType>(
  builder: WithActionKey<ActionKeyType> & WithSuccessType<SuccessType>
): AnyActionReducer<AsyncSuccessState<SuccessType>> =>
  pipe(
    builder,
    branch(buildSucceedActionCreator, buildSuccessStateReducer),
    ([actionCreator, stateReducerCreator]) => makeActionReducer(actionCreator, stateReducerCreator)
  );

/**
 * Given a builder this makes an action reducer that results in a failure state.
 *
 * @param builder A builder with an action key and payload types.
 * @return
 */
export const buildFailureActionReducer = <
  ActionKeyType extends string,
  SuccessType,
  FailureType,
  IdleType
>(
  builder: WithActionKey<ActionKeyType> & WithPayloadTypes<SuccessType, FailureType, IdleType>
): AnyActionReducer<AsyncState<SuccessType, FailureType, IdleType>> =>
  pipe(
    builder,
    branch(buildFailActionCreator, buildFailureStateReducer),
    ([actionCreator, stateReducerCreator]) =>
      on(
        matches(actionCreator),
        (action) => (state) =>
          stateReducerCreator(action.payload)(state) as AsyncState<
            SuccessType,
            FailureType,
            IdleType
          >
      )
  );

/**
 * Given a builder this makes an action reducer that results in a reverted payload.
 *
 * @param builder A builder with an action key and payload types.
 * @return
 */
export const buildRevertActionReducer = <
  ActionKeyType extends string,
  SuccessType,
  FailureType,
  IdleType
>(
  builder: WithActionKey<ActionKeyType> & WithPayloadTypes<SuccessType, FailureType, IdleType>
): AnyActionReducer<AsyncState<SuccessType, FailureType, IdleType>> =>
  pipe(
    builder,
    branch(buildRevertActionCreator, buildRevertStateReducer),
    ([actionCreator, stateReducerCreator]) =>
      on(matches(actionCreator), (action) => stateReducerCreator(action.payload))
  );

/**
 * Given a builder it makes an action reducer that looks for all of the async actions
 * and performs the appropriate state change.
 *
 * @param builder A builder with an action key an payload types.
 * @return
 */
export const buildCombinedReducers = <
  ActionKeyType extends string,
  SuccessType,
  FailureType,
  IdleType
>(
  builder: WithActionKey<ActionKeyType> & WithPayloadTypes<SuccessType, FailureType, IdleType>
): AnyActionReducer<AsyncState<SuccessType, FailureType, IdleType>> =>
  pipe(
    builder,
    branch(
      buildInitActionReducer,
      buildLoadingActionReducer,
      buildLoadingMoreActionReducer,
      buildSuccessActionReducer,
      buildFailureActionReducer,
      buildRevertActionReducer
    ),
    (actionReducers) =>
      combineActionReducers(
        ...(actionReducers as Array<
          AnyActionReducer<AsyncState<SuccessType, FailureType, IdleType>>
        >)
      )
  );

/**
 * Returns an action reducer from buildCombinedReducers, but run in a lens so that it handles
 * a larger data structure.
 *
 * @param builder
 * @return
 */
export const buildCombinedLensedReducers =
  <ActionKeyType extends string, SuccessType, FailureType, IdleType, OuterStructureType>(
    builder: WithActionKey<ActionKeyType> &
      WithLensInstance<IdleType, SuccessType, FailureType, OuterStructureType> &
      WithPayloadTypes<SuccessType, FailureType, IdleType>
  ): AnyActionReducer<OuterStructureType> =>
  (action) =>
    withLens(builder.lens)(buildCombinedReducers(builder)(action));

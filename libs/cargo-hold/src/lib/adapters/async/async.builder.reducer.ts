import { branch, pipe } from '@brandingbrand/standard-compose';
import { withLens } from '@brandingbrand/standard-lens';

import type { ActionCreator } from '../../action-bus';
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

export const buildInitStateReducer =
  <IdleType>(_builder: WithIdleType<IdleType>) =>
  (payload: IdleType) =>
  () =>
    createIdleState(payload);

export const buildLoadingStateReducer =
  <SuccessType, IdleType>(_builder: WithIdleType<IdleType> & WithSuccessType<SuccessType>) =>
  (payload: IdleType | SuccessType) =>
  () =>
    createLoadingState(payload);

export const buildLoadingMoreStateReducer =
  <SuccessType>(_builder: WithSuccessType<SuccessType>) =>
  (payload: SuccessType) =>
  () =>
    createLoadingMoreState(payload);

export const buildSuccessStateReducer =
  <SuccessType>(_builder: WithSuccessType<SuccessType>) =>
  (payload: SuccessType) =>
  () =>
    createSuccessState(payload);

export const buildFailureStateReducer =
  <SuccessType, FailureType, IdleType>(
    _builder: WithPayloadTypes<SuccessType, FailureType, IdleType>
  ) =>
  (failure: FailureType) =>
  (state: AsyncState<SuccessType, FailureType, IdleType>) =>
    createFailureState(state.payload, failure);

export const buildRevertStateReducer =
  <SuccessType, FailureType, IdleType>(
    _builder: WithPayloadTypes<SuccessType, FailureType, IdleType>
  ) =>
  (payload: IdleType | SuccessType): StateReducer<AsyncState<SuccessType, FailureType, IdleType>> =>
  (state: AsyncState<SuccessType, FailureType, IdleType>) =>
    ({
      ...state,
      payload,
    } as AsyncState<SuccessType, FailureType, IdleType>);

const makeActionReducer = <
  ActionKey extends string,
  Subtype extends string | undefined,
  PayloadType,
  StateType,
  ParamsType extends unknown[]
>(
  actionCreator: ActionCreator<ActionKey, Subtype, PayloadType, ParamsType>,
  stateReducer: (payload: PayloadType) => StateReducer<StateType>
) => on(matches(actionCreator), (action) => stateReducer(action.payload));

export const buildInitActionReducer = <ActionKey extends string, IdleType>(
  builder: WithActionKey<ActionKey> & WithIdleType<IdleType>
): AnyActionReducer<AsyncIdleState<IdleType>> =>
  pipe(
    builder,
    branch(buildInitActionCreator, buildInitStateReducer),
    ([actionCreator, stateReducerCreator]) => makeActionReducer(actionCreator, stateReducerCreator)
  );

export const buildLoadingActionReducer = <ActionKey extends string, SuccessType, IdleType>(
  builder: WithActionKey<ActionKey> & WithIdleType<IdleType> & WithSuccessType<SuccessType>
): AnyActionReducer<AsyncLoadingState<IdleType | SuccessType>> =>
  pipe(
    builder,
    branch(buildLoadingActionCreator, buildLoadingStateReducer),
    ([actionCreator, stateReducerCreator]) =>
      on(
        matches(actionCreator),
        // slight coercion necessary as TS isn't picking up the union quite properly
        (action) =>
          stateReducerCreator(action.payload) as () => AsyncLoadingState<IdleType | SuccessType>
      )
  );

export const buildLoadingMoreActionReducer = <ActionKey extends string, SuccessType>(
  builder: WithActionKey<ActionKey> & WithSuccessType<SuccessType>
): AnyActionReducer<AsyncLoadingMoreState<SuccessType>> =>
  pipe(
    builder,
    branch(buildLoadingMoreActionCreator, buildLoadingMoreStateReducer),
    ([actionCreator, stateReducerCreator]) => makeActionReducer(actionCreator, stateReducerCreator)
  );

export const buildSuccessActionReducer = <ActionKey extends string, SuccessType>(
  builder: WithActionKey<ActionKey> & WithSuccessType<SuccessType>
): AnyActionReducer<AsyncSuccessState<SuccessType>> =>
  pipe(
    builder,
    branch(buildSucceedActionCreator, buildSuccessStateReducer),
    ([actionCreator, stateReducerCreator]) => makeActionReducer(actionCreator, stateReducerCreator)
  );

export const buildFailureActionReducer = <
  ActionKey extends string,
  SuccessType,
  FailureType,
  IdleType
>(
  builder: WithActionKey<ActionKey> & WithPayloadTypes<SuccessType, FailureType, IdleType>
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

export const buildRevertActionReducer = <
  ActionKey extends string,
  SuccessType,
  FailureType,
  IdleType
>(
  builder: WithActionKey<ActionKey> & WithPayloadTypes<SuccessType, FailureType, IdleType>
): AnyActionReducer<AsyncState<SuccessType, FailureType, IdleType>> =>
  pipe(
    builder,
    branch(buildRevertActionCreator, buildRevertStateReducer),
    ([actionCreator, stateReducerCreator]) =>
      on(matches(actionCreator), (action) => stateReducerCreator(action.payload))
  );

export const buildCombinedReducers = <ActionKey extends string, SuccessType, FailureType, IdleType>(
  builder: WithActionKey<ActionKey> & WithPayloadTypes<SuccessType, FailureType, IdleType>
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

export const buildCombinedLensedReducers =
  <ActionKey extends string, SuccessType, FailureType, IdleType, OuterStructureType>(
    builder: WithActionKey<ActionKey> &
      WithLensInstance<IdleType, SuccessType, FailureType, OuterStructureType> &
      WithPayloadTypes<SuccessType, FailureType, IdleType>
  ): AnyActionReducer<OuterStructureType> =>
  (action) =>
    withLens(builder.lens)(buildCombinedReducers(builder)(action));

import type { Result } from '@brandingbrand/standard-result';
import { fail, isOk, ok } from '@brandingbrand/standard-result';
import type { MaybePromise } from '@brandingbrand/types-utility';

import { filter, from, of as just, map, merge, mergeMap, switchMap, withLatestFrom } from 'rxjs';

import type { AnyAction } from '../../action-bus';
import type { Effect } from '../../store';

import {
  buildFailActionCreator,
  buildLoadingActionCreator,
  buildLoadingMoreActionCreator,
  buildRevertActionCreator,
  buildSucceedActionCreator,
} from './async.builder.actions';
import type {
  WithActionKey,
  WithAsyncCallback,
  WithEnableLoadingMore,
  WithLensInstance,
  WithMapOnFailure,
  WithMapOnSuccess,
  WithOptimisticUpdate,
  WithPayloadTypes,
  WithTriggerActionFilter,
} from './async.builder.types';
import type { AsyncFailureState, AsyncState } from './async.types';

export type AsyncEffectDeps<
  ActionKeyType extends string,
  SuccessType,
  FailureType,
  IdleType,
  TriggerActionType extends AnyAction,
  CallbackResultType
> = Partial<WithEnableLoadingMore> &
  Partial<WithMapOnFailure<unknown, FailureType>> &
  Partial<WithOptimisticUpdate<TriggerActionType['payload'], IdleType | SuccessType, SuccessType>> &
  WithActionKey<ActionKeyType> &
  WithPayloadTypes<SuccessType, FailureType, IdleType> &
  WithTriggerActionFilter<TriggerActionType> &
  (CallbackResultType extends SuccessType
    ? Partial<WithMapOnSuccess<CallbackResultType, SuccessType>> &
        WithAsyncCallback<TriggerActionType['payload'], SuccessType>
    : WithAsyncCallback<TriggerActionType['payload'], CallbackResultType> &
        WithMapOnSuccess<CallbackResultType, IdleType | SuccessType, SuccessType>);

/**
 * Given a correctly-typed builder object, construct an Effect that will be triggered by the
 * triggering action, instigate loading states, run optimistic predictions, and end with success or
 * failure. Also reverts optimistic predictions if necessary on failure.
 *
 * @param builder
 * @return The async effect
 */
export const buildAsyncEffect =
  <
    ActionKeyType extends string,
    SuccessType,
    FailureType,
    IdleType,
    TriggerActionType extends AnyAction,
    CallbackResultType
  >(
    builder: AsyncEffectDeps<
      ActionKeyType,
      SuccessType,
      FailureType,
      IdleType,
      TriggerActionType,
      CallbackResultType
    >
  ): Effect<AsyncState<SuccessType, FailureType, IdleType>> =>
  (action$, state$) => {
    // load$ gets triggered by the triggerActionFilter, runs the prediction if given, and emits
    // loading or loadingMore actions
    const load$ = action$.pipe(
      // these typeguards don't have perfect Typescript defs
      filter(builder.triggerActionFilter),
      withLatestFrom(state$),
      map(
        ([action, state]: [TriggerActionType, AsyncState<SuccessType, FailureType, IdleType>]) => {
          const predictedPayload = builder.prediction
            ? builder.prediction(action.payload)(state.payload)
            : state.payload;
          if (
            builder.enableLoadMore === true &&
            (state.status === 'success' || state.status === 'loading-more')
          ) {
            return buildLoadingMoreActionCreator(builder).create(predictedPayload as SuccessType);
          }
          return buildLoadingActionCreator(builder).create(predictedPayload);
        }
      )
    );

    // callbackAction$ is also triggered by the triggerActionFilter, whose payload serves as the
    // argument for the callback. It runs the callback, judges success vs failure, and emits the
    // appropriate action accordingly. If it was a failure, also emits a revert if we had a prediction.
    const callbackAction$ = action$.pipe(
      filter(builder.triggerActionFilter),
      // grab state to get back to if we have optimistic updates on and we fail
      withLatestFrom(state$),
      switchMap(([action, stateAtStart]) =>
        from(
          // take advantage of the flattening of Promises - wrap it in a promise regardless
          new Promise<CallbackResultType>((resolve, reject) => {
            try {
              resolve(builder.callback(action.payload) as MaybePromise<CallbackResultType>);
            } catch (error) {
              reject(error);
            }
          })
            .then(ok)
            .catch(fail)
        ).pipe(
          // grab latest state for mapOnSuccess etc functions to use
          withLatestFrom(state$),
          mergeMap(
            ([wrappedResult, stateAtReturn]: [
              Result<CallbackResultType, unknown>,
              AsyncState<SuccessType, FailureType, IdleType>
            ]) => {
              if (isOk(wrappedResult)) {
                const result = wrappedResult.ok;
                // Type coercion is due to Typescript not following unions quite right
                const mappedNewState = builder.mapOnSuccess
                  ? builder.mapOnSuccess(result as CallbackResultType & SuccessType)(
                      stateAtReturn.payload as SuccessType
                    )
                  : (result as unknown as SuccessType);
                return just(buildSucceedActionCreator(builder).create(mappedNewState));
              }
              const result = wrappedResult.failure;
              const mappedFailure = builder.mapOnFailure
                ? builder.mapOnFailure(result)(
                    (stateAtReturn as AsyncFailureState<IdleType | SuccessType, FailureType>)
                      .failure
                  )
                : (result as FailureType);
              return builder.prediction
                ? just(
                    buildRevertActionCreator(builder).create(stateAtStart.payload),
                    buildFailActionCreator(builder).create(mappedFailure)
                  )
                : just(buildFailActionCreator(builder).create(mappedFailure));
            }
          )
        )
      )
    );

    return merge(load$, callbackAction$);
  };

/**
 * Given a correctly-typed builder object, construct an Effect that will be triggered by the
 * triggering action, instigate loading states, run optimistic predictions, and end with success or
 * failure. Also reverts optimistic predictions if necessary on failure. This runs inside a lens, so
 * as to operate on a larger data structure.
 *
 * @param builder
 * @return The async effect
 */
export const buildAsyncEffectWithLens =
  <
    ActionKeyType extends string,
    SuccessType,
    FailureType,
    IdleType,
    ActionTriggerType extends AnyAction,
    CallbackResultType,
    OuterStructureType
  >(
    builder: AsyncEffectDeps<
      ActionKeyType,
      SuccessType,
      FailureType,
      IdleType,
      ActionTriggerType,
      CallbackResultType
    > &
      WithLensInstance<IdleType, SuccessType, FailureType, OuterStructureType>
  ): Effect<OuterStructureType> =>
  (action$, state$) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- any is of limited scope and not worth specifying
    buildAsyncEffect(builder as any)(action$, state$.pipe(map(builder.lens.get)));

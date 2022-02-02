import type { ActionSpecifier, AnyAction } from '../action-bus';
import type { AsyncActionCreators } from './async.actions';
import type { AsyncAction, AsyncState, CreateAsyncEffectOptions } from './async.types';

import { from, merge, Observable, of } from 'rxjs';
import { filter, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { isRight, left, right } from '../internal/util/functional/either';
import { matches, type Effect } from '../store';

/**
 * `makeAsyncEffect` is the "raw" creator function that gets used in the `AsyncAdaptor`. It gets
 * partially applied in the adaptor creator function itself, leaving the user to fill in the details
 * of a particular effect using the second curried parameter.
 *
 * @param asyncActionCreators The Async Action creators that should be called to dispatch the correct
 * actions to update status and payload.
 * @returns A function that takes in CreateAsyncEffectOptions and returns an Effect
 */
export const makeAsyncEffect =
  <AsyncActionKey extends string, Payload, FailPayload>(
    asyncActionCreators: AsyncActionCreators<AsyncActionKey, Payload, FailPayload>
  ) =>
  <
    DesiredActionSpecifier extends
      | ActionSpecifier<string, string | undefined, Params>
      | AnyAction<Params>,
    Params extends unknown[],
    CallbackResult,
    FailedCallbackResult
  >(
    effectOptions: CreateAsyncEffectOptions<
      DesiredActionSpecifier,
      Params,
      CallbackResult,
      Payload,
      FailedCallbackResult,
      FailPayload
    >
  ): Effect<AsyncState<Payload, FailPayload>> =>
  (action$, state$) => {
    const optimisticUpdate = effectOptions.predict ?? ((_params, state) => state);

    // changes status to loading, with optimistic updates if configured
    const emitLoadWithPredictor$ = action$.pipe(
      // type coercion is due to us filtering Actions, just by their ActionSpecifier properties
      filter(effectOptions.when),
      withLatestFrom(state$),
      map(([action, state]) => {
        const update = optimisticUpdate((action as AnyAction<Params>).payload, state.payload);

        if (
          (state.status === 'success' || state.status === 'loading-more') &&
          effectOptions.loadingMore
        ) {
          return asyncActionCreators.loadMore.create(update);
        }

        return asyncActionCreators.load.create(update);
      })
    );

    // runs callback, emits success or failure or revert & failure.
    const runCallback$ = action$.pipe(
      // type coercion is due to us filtering Actions, just by their ActionSpecifier properties
      filter(effectOptions.when),
      // grab state as of init time
      withLatestFrom(state$),
      switchMap(([action, stateAtStart]) => {
        return from(
          // success is wrapped in a Right structure, failure in a Left. We don't want to put an
          // error in the observable, so we catch it and wrap it for identification in the next step.
          effectOptions
            .do(...(action as AnyAction<Params>).payload)
            .then(right)
            .catch(left)
        ).pipe(
          // grab state after callback returned
          withLatestFrom(state$),
          map(([result, currentState]) => {
            if (isRight(result)) {
              if (effectOptions.mapOnSuccess) {
                return asyncActionCreators.succeed.create(
                  effectOptions.mapOnSuccess(result.right)(currentState.payload)
                );
              }
              // onSuccess would have been required if CallbackResult wasn't a Payload,
              // so we know this coercion is safe.
              return asyncActionCreators.succeed.create(result.right as unknown as Payload);
            }
            if (effectOptions.mapOnFail) {
              return asyncActionCreators.fail.create(
                effectOptions.mapOnFail(result.left)(
                  currentState.payload,
                  currentState.status === 'failure' ? currentState.failure : undefined
                )
              );
            }
            // onFail would have been required if FailCallbackResult wasn't a FailPayload,
            // so we know this coercion is safe.
            return asyncActionCreators.fail.create(result.left as unknown as FailPayload);
          }),
          mergeMap<
            AsyncAction<AsyncActionKey, Payload, FailPayload>,
            Observable<AsyncAction<AsyncActionKey, Payload, FailPayload>>
          >((asyncCallbackResult) => {
            if (matches(asyncActionCreators.fail) && effectOptions.predict !== undefined) {
              return of<AsyncAction<AsyncActionKey, Payload, FailPayload>>(
                asyncActionCreators.revert.create(stateAtStart.payload),
                asyncCallbackResult
              );
            }
            return of(asyncCallbackResult);
          })
        );
      })
    );

    return merge(emitLoadWithPredictor$, runCallback$);
  };

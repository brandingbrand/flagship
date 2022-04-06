import { fail, isOk, ok, Result } from '@brandingbrand/standard-result';
import type { MaybePromise } from '@brandingbrand/types-utility';
import { filter, from, map, merge, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';
import type {
  ActionOf,
  ActionSpecifier,
  AnyAction,
  AnyActionSpecifier,
  TypeGuard,
} from '../../action-bus';
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
  WithMapOnFailure,
  WithMapOnSuccess,
  WithOptimisticUpdate,
  WithPayloadTypes,
  WithTriggerActionFilter,
} from './async.builder.types';
import type { AsyncState } from './async.types';

export type AsyncEffectDeps<
  ActionKey extends string,
  SuccessType,
  FailureType,
  IdleType,
  TriggerSpecifier extends AnyActionSpecifier,
  CallbackResult
> = WithPayloadTypes<SuccessType, FailureType, IdleType> &
  WithActionKey<ActionKey> &
  WithTriggerActionFilter<TriggerSpecifier> &
  Partial<WithEnableLoadingMore> &
  Partial<WithMapOnFailure<unknown, AsyncState<SuccessType, FailureType, IdleType>, FailureType>> &
  Partial<
    WithOptimisticUpdate<
      TriggerSpecifier extends ActionSpecifier<string, any, infer Payload> ? Payload : never,
      SuccessType | IdleType,
      SuccessType
    >
  > &
  (CallbackResult extends SuccessType
    ? WithAsyncCallback<
        TriggerSpecifier extends ActionSpecifier<string, any, infer Payload> ? Payload : never,
        SuccessType
      > &
        // mapOnSuccess is optional
        Partial<WithMapOnSuccess<SuccessType, SuccessType>>
    : WithAsyncCallback<
        TriggerSpecifier extends ActionSpecifier<string, any, infer Payload> ? Payload : never,
        CallbackResult
      > &
        WithMapOnSuccess<CallbackResult, SuccessType | IdleType, SuccessType>);

export const buildAsyncEffect = <
  ActionKey extends string,
  SuccessType,
  FailureType,
  IdleType,
  TriggerSpecifier extends AnyActionSpecifier,
  CallbackResult
>(
  builder: AsyncEffectDeps<
    ActionKey,
    SuccessType,
    FailureType,
    IdleType,
    TriggerSpecifier,
    CallbackResult
  >
): Effect<AsyncState<SuccessType, FailureType, IdleType>> => {
  return (action$, state$) => {
    const load$ = action$.pipe(
      // these typeguards don't have perfect Typescript defs
      filter(
        builder.triggerActionFilter as unknown as TypeGuard<AnyAction, ActionOf<TriggerSpecifier>>
      ),
      withLatestFrom(state$),
      map(([action, state]) => {
        const newSuccessPayload = builder.prediction
          ? builder.prediction(action.payload)(state.payload)
          : state.payload;
        if (
          builder.enableLoadMore &&
          (state.status === 'success' || state.status === 'loading-more')
        ) {
          return buildLoadingMoreActionCreator(builder).create(newSuccessPayload as SuccessType);
        }
        return buildLoadingActionCreator(builder).create(newSuccessPayload);
      })
    );

    const callbackAction$ = action$.pipe(
      // these typeguards don't have perfect Typescript defs
      filter(
        builder.triggerActionFilter as unknown as TypeGuard<AnyAction, ActionOf<TriggerSpecifier>>
      ),
      // grab state to get back to if we have optimistic updates on and we fail
      withLatestFrom(state$),
      switchMap(([action, stateAtStart]) =>
        from<Promise<Result<CallbackResult, unknown>>>(
          // take advantage of the flattening of Promises - wrap it in a promise regardless
          new Promise<CallbackResult>((resolve, reject) => {
            try {
              resolve(builder.callback(action.payload) as MaybePromise<CallbackResult>);
            } catch (e) {
              reject(e);
            }
          })
            .then(ok)
            .catch(fail)
        ).pipe(
          // grab latest state for mapOnSuccess etc functions to use
          withLatestFrom(state$),
          mergeMap(([wrappedResult, stateAtReturn]) => {
            if (isOk(wrappedResult)) {
              const result = wrappedResult.ok;
              // Type coercion is due to Typescript not following unions quite right
              const newState = builder.mapOnSuccess
                ? builder.mapOnSuccess(result as CallbackResult & SuccessType)(
                    stateAtReturn.payload as SuccessType
                  )
                : (result as unknown as SuccessType);
              return of(buildSucceedActionCreator(builder).create(newState));
            }
            const result = wrappedResult.failure;
            const newState = builder.mapOnFailure
              ? builder.mapOnFailure(result)(stateAtReturn)
              : (result as FailureType);
            return builder.prediction
              ? of(
                  buildRevertActionCreator(builder).create(stateAtStart.payload),
                  buildFailActionCreator(builder).create(newState)
                )
              : of(buildFailActionCreator(builder).create(newState));
          })
        )
      )
    );

    return merge(load$, callbackAction$);
  };
};

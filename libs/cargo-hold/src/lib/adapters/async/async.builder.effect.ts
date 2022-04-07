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
  WithLensInstance,
  WithMapOnFailure,
  WithMapOnSuccess,
  WithOptimisticUpdate,
  WithPayloadTypes,
  WithTriggerActionFilter,
} from './async.builder.types';
import type { AsyncFailureState, AsyncState } from './async.types';

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
  Partial<WithMapOnFailure<unknown, FailureType>> &
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
        Partial<WithMapOnSuccess<CallbackResult, SuccessType>>
    : WithAsyncCallback<
        TriggerSpecifier extends ActionSpecifier<string, any, infer Payload> ? Payload : never,
        CallbackResult
      > &
        WithMapOnSuccess<CallbackResult, SuccessType | IdleType, SuccessType>);

export const buildAsyncEffect =
  <
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
  ): Effect<AsyncState<SuccessType, FailureType, IdleType>> =>
  (action$, state$) => {
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
          // type coercion because "run the lens if we have one, and if we don't we'll assume the raw
          // value is right" is not a simple Typescript concept.
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
            const mappedFailure = builder.mapOnFailure
              ? builder.mapOnFailure(result)(
                  (stateAtReturn as AsyncFailureState<SuccessType | IdleType, FailureType>).failure
                )
              : (result as FailureType);
            return builder.prediction
              ? of(
                  buildRevertActionCreator(builder).create(stateAtStart.payload),
                  buildFailActionCreator(builder).create(mappedFailure)
                )
              : of(buildFailActionCreator(builder).create(mappedFailure));
          })
        )
      )
    );

    return merge(load$, callbackAction$);
  };

export const buildAsyncEffectWithLens =
  <
    ActionKey extends string,
    SuccessType,
    FailureType,
    IdleType,
    TriggerSpecifier extends AnyActionSpecifier,
    CallbackResult,
    OuterStructureType
  >(
    builder: AsyncEffectDeps<
      ActionKey,
      SuccessType,
      FailureType,
      IdleType,
      TriggerSpecifier,
      CallbackResult
    > &
      WithLensInstance<IdleType, SuccessType, FailureType, OuterStructureType>
  ): Effect<OuterStructureType> =>
  (action$, state$) =>
    buildAsyncEffect(builder as any)(action$, state$.pipe(map(builder.lens.get)));

import type { ActionSpecifier, AnyAction } from '../action-bus';
import type { AsyncAdaptor, AsyncState, CreateAsyncEffectOptions } from './async.types';
import type { Effect, SourcesList } from '../store/store.types';

import { map } from 'rxjs/operators';

import { composeLens, Lens, LensCreator } from '../lens';
import { createAsyncActionCreators } from './async.actions';
import { makeAsyncEffect } from './async.effect';
import {
  createCombinedReducer,
  createIdleState,
  createLensedReducers,
  createReducers,
} from './async.reducer';
import { createSelectors } from './async.selectors';

export type AsyncAdaptorOptions<ActionKey extends string, Payload, FailPayload, Structure> = {
  emitSource?: string | symbol;
  listenToSources?: SourcesList;
  actionKey: ActionKey;
  lens?: Lens<Structure, AsyncState<Payload, FailPayload>>;
};

export const createAsyncAdaptor = <
  ActionKey extends string,
  Payload,
  FailPayload,
  Structure = AsyncState<Payload, FailPayload>
>(
  options: AsyncAdaptorOptions<ActionKey, Payload, FailPayload, Structure>
): AsyncAdaptor<ActionKey, Payload, FailPayload, Structure> => {
  const payloadLens = new LensCreator<AsyncState<Payload, FailPayload>>().fromProp('payload');
  const structureLens =
    options.lens ??
    (new LensCreator<Structure>().id() as unknown as Lens<
      Structure,
      AsyncState<Payload, FailPayload>
    >);
  const actionCreators = createAsyncActionCreators<ActionKey, Payload, FailPayload>(
    options.actionKey,
    options.emitSource
  );
  const reducers = createReducers<Payload, FailPayload>();
  const lensedReducers = createLensedReducers<Payload, FailPayload, Structure>(structureLens);
  const combinedReducer = createCombinedReducer(actionCreators, structureLens);
  const selectors = createSelectors(structureLens);
  const createState = (initialPayload: Payload): AsyncState<Payload, FailPayload> =>
    createIdleState(initialPayload);
  const createEffect = <
    DesiredActionSpecifier extends
      | ActionSpecifier<string, string | undefined, Params>
      | AnyAction<Params>,
    Params extends unknown[],
    CallbackResult = Payload,
    FailedCallbackResult = FailPayload
  >(
    effectOptions: CreateAsyncEffectOptions<
      DesiredActionSpecifier,
      Params,
      CallbackResult,
      Payload,
      FailedCallbackResult,
      FailPayload
    >
  ): Effect<Structure> => {
    const effect = makeAsyncEffect(actionCreators)(effectOptions);
    return (action$, state$) => effect(action$, state$.pipe(map(structureLens.get)));
  };
  const withLens = <OuterStructure>(lens: Lens<OuterStructure, Structure>) =>
    createAsyncAdaptor<ActionKey, Payload, FailPayload, OuterStructure>({
      ...options,
      lens: composeLens(structureLens)(lens),
    });

  return {
    createState,
    actionCreators,
    combinedReducer,
    reducers,
    lensedReducers,
    selectors,
    createEffect,
    payloadLens,
    withLens,
  };
};

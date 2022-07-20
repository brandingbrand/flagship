import type { ILens } from '@brandingbrand/standard-lens';
import { ComposableLens, createLens } from '@brandingbrand/standard-lens';

import { map } from 'rxjs/operators';

import type { ActionSpecifier, AnyAction } from '../../../action-bus';
import type { Effect, SourcesList } from '../../../store/store.types';
import { createIdleState } from '../async.stateCreators';
import type { AsyncState } from '../async.types';

import { createAsyncActionCreators } from './async.actions';
import { makeAsyncEffect } from './async.effect';
import { createCombinedReducer, createLensedReducers, createReducers } from './async.reducer';
import { createSelectors } from './async.selectors';
import type { AsyncAdaptor, CreateAsyncEffectOptions } from './async.types';

export interface AsyncAdaptorOptions<
  ActionKey extends string,
  Payload,
  FailPayload,
  Structure,
  EmptyPayload = Payload
> {
  emitSource?: string | symbol;
  listenToSources?: SourcesList;
  actionKey: ActionKey;
  metadata?: Record<string, unknown>;
  lens?: ILens<Structure, AsyncState<Payload, FailPayload, EmptyPayload>>;
}

/**
 * @param options
 * @deprecated Use `asyncBuilder`-based functions instead.
 */
export const createAsyncAdaptor = <
  ActionKey extends string,
  Payload,
  FailPayload,
  Structure = AsyncState<Payload, FailPayload>,
  EmptyPayload = Payload
>(
  options: AsyncAdaptorOptions<ActionKey, Payload, FailPayload, Structure, EmptyPayload>
): AsyncAdaptor<ActionKey, Payload, FailPayload, Structure, EmptyPayload> => {
  const payloadLens =
    createLens<AsyncState<Payload, FailPayload, EmptyPayload>>().fromPath('payload');
  const structureLens =
    options.lens ??
    (createLens<Structure>().fromPath() as unknown as ILens<
      Structure,
      AsyncState<Payload, FailPayload, EmptyPayload>
    >);
  const actionCreators = createAsyncActionCreators<ActionKey, Payload, FailPayload, EmptyPayload>(
    options.actionKey,
    options.emitSource,
    options.metadata
  );
  const reducers = createReducers<Payload, FailPayload, EmptyPayload>();
  const lensedReducers = createLensedReducers<Payload, FailPayload, Structure, EmptyPayload>(
    structureLens
  );
  const combinedReducer = createCombinedReducer(actionCreators, structureLens);
  const selectors = createSelectors(structureLens);
  const createState = (
    initialPayload: EmptyPayload | Payload
  ): AsyncState<Payload, FailPayload, EmptyPayload> => createIdleState(initialPayload);
  const createEffect = <
    DesiredActionType extends AnyAction<Params>,
    Params extends unknown[],
    CallbackResult = Payload,
    FailedCallbackResult = FailPayload
  >(
    effectOptions: CreateAsyncEffectOptions<
      DesiredActionType,
      Params,
      CallbackResult,
      Payload,
      FailedCallbackResult,
      FailPayload,
      EmptyPayload
    >
  ): Effect<Structure> => {
    const effect = makeAsyncEffect(actionCreators)(effectOptions);
    return (action$, state$) => effect(action$, state$.pipe(map(structureLens.get)));
  };
  const withLens = <OuterStructure>(lens: ILens<OuterStructure, Structure>) =>
    createAsyncAdaptor<ActionKey, Payload, FailPayload, OuterStructure, EmptyPayload>({
      ...options,
      lens: new ComposableLens(structureLens).withOuterLens(lens),
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

import * as FastCheck from 'fast-check';
import { NEVER, of as just, merge } from 'rxjs';
import { take } from 'rxjs/operators';

import type { ActionSpecifierOf, AnyAction } from '../../../action-bus';
import { matches } from '../../../store';

import { createAsyncActionCreators } from './async.actions';
import { makeAsyncEffect } from './async.effect';

describe('makeAsyncEffect', () => {
  const asyncActionKey = 'myAsyncActionKey' as const;
  const asyncActionCreators = createAsyncActionCreators(asyncActionKey);
  const createAsyncEffect = makeAsyncEffect(asyncActionCreators);

  it('emits a loading action', async () =>
    FastCheck.assert(
      FastCheck.asyncProperty(
        FastCheck.string(),
        FastCheck.anything(),
        FastCheck.anything(),
        FastCheck.anything(),
        async (triggeringKey, result, actionPayload, oldState) => {
          const effect = createAsyncEffect({
            when: matches<ActionSpecifierOf<AnyAction<[]>>>({ type: triggeringKey }),
            do: async () => result,
          });
          const action$ = merge(NEVER, just({ type: triggeringKey, payload: [actionPayload] }));
          const state$ = merge(NEVER, just({ status: 'idle' as const, payload: oldState }));
          const effectResult = await effect(action$, state$).pipe(take(1)).toPromise();

          expect(effectResult).toEqual({
            payload: oldState,
            subtype: 'async:load',
            type: asyncActionKey,
          });
        }
      ),
      { timeout: 20 }
    ));

  it('emits a success action', async () =>
    FastCheck.assert(
      FastCheck.asyncProperty(
        FastCheck.string(),
        FastCheck.anything(),
        FastCheck.anything(),
        FastCheck.anything(),
        async (triggeringKey, result, actionPayload, oldState) => {
          const effect = createAsyncEffect({
            when: matches<ActionSpecifierOf<AnyAction<[]>>>({ type: triggeringKey }),
            do: async () => result,
          });
          const action$ = merge(NEVER, just({ type: triggeringKey, payload: [actionPayload] }));
          const state$ = merge(NEVER, just({ status: 'idle' as const, payload: oldState }));
          const effectResult = await effect(action$, state$).pipe(take(2)).toPromise();

          expect(effectResult).toEqual({
            payload: result,
            subtype: 'async:succeed',
            type: asyncActionKey,
          });
        }
      ),
      { timeout: 20 }
    ));

  it('emits a fail action', async () =>
    FastCheck.assert(
      FastCheck.asyncProperty(
        FastCheck.string(),
        FastCheck.anything(),
        FastCheck.anything(),
        FastCheck.anything(),
        async (triggeringKey, result, actionPayload, oldState) => {
          const effect = createAsyncEffect({
            when: matches<ActionSpecifierOf<AnyAction<[]>>>({ type: triggeringKey }),
            do: async (): Promise<unknown> => {
              throw result;
            },
          });
          const action$ = merge(NEVER, just({ type: triggeringKey, payload: [actionPayload] }));
          const state$ = merge(NEVER, just({ status: 'idle' as const, payload: oldState }));
          const effectResult = await effect(action$, state$).pipe(take(2)).toPromise();

          expect(effectResult).toEqual({
            payload: result,
            subtype: 'async:fail',
            type: asyncActionKey,
          });
        }
      ),
      { timeout: 20 }
    ));

  it('emits a load action with optimistic update', async () =>
    FastCheck.assert(
      FastCheck.asyncProperty(
        FastCheck.string(),
        FastCheck.anything(),
        FastCheck.anything(),
        FastCheck.anything(),
        async (triggeringKey, result, actionPayload, oldState) => {
          const effect = createAsyncEffect({
            when: matches<ActionSpecifierOf<AnyAction<[]>>>({ type: triggeringKey }),
            do: async () => result,
            predict: (_params, _state) => result,
          });
          const action$ = merge(NEVER, just({ type: triggeringKey, payload: [actionPayload] }));
          const state$ = merge(NEVER, just({ status: 'idle' as const, payload: oldState }));
          const effectResult = await effect(action$, state$).pipe(take(1)).toPromise();

          expect(effectResult).toEqual({
            payload: result,
            subtype: 'async:load',
            type: asyncActionKey,
          });
        }
      ),
      { timeout: 20 }
    ));

  it('emits a revert action upon failure with optimistic update', async () =>
    FastCheck.assert(
      FastCheck.asyncProperty(
        FastCheck.string(),
        FastCheck.anything(),
        FastCheck.anything(),
        FastCheck.anything(),
        async (triggeringKey, result, actionPayload, oldState) => {
          const effect = createAsyncEffect({
            when: matches<ActionSpecifierOf<AnyAction<[]>>>({ type: triggeringKey }),
            do: async (): Promise<unknown> => {
              throw result;
            },
            predict: (_params, _state) => result,
          });
          const action$ = merge(NEVER, just({ type: triggeringKey, payload: [actionPayload] }));
          const state$ = merge(NEVER, just({ status: 'idle' as const, payload: oldState }));
          const effectResult = await effect(action$, state$).pipe(take(2)).toPromise();

          expect(effectResult).toEqual({
            payload: oldState,
            subtype: 'async:revert',
            type: asyncActionKey,
          });
        }
      ),
      { timeout: 20 }
    ));

  it('emits a fail action upon failure with optimistic update', async () =>
    FastCheck.assert(
      FastCheck.asyncProperty(
        FastCheck.string(),
        FastCheck.anything(),
        FastCheck.anything(),
        FastCheck.anything(),
        async (triggeringKey, result, actionPayload, oldState) => {
          const effect = createAsyncEffect({
            when: matches<ActionSpecifierOf<AnyAction<[]>>>({ type: triggeringKey }),
            do: async (): Promise<unknown> => {
              throw result;
            },
            predict: (_params, _state) => result,
          });
          const action$ = merge(NEVER, just({ type: triggeringKey, payload: [actionPayload] }));
          const state$ = merge(NEVER, just({ status: 'idle' as const, payload: oldState }));
          const effectResult = await effect(action$, state$).pipe(take(3)).toPromise();

          expect(effectResult).toEqual({
            payload: result,
            subtype: 'async:fail',
            type: asyncActionKey,
          });
        }
      ),
      { timeout: 20 }
    ));
});

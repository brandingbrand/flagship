import * as FastCheck from 'fast-check';
import { merge, NEVER, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { createAsyncActionCreators } from '.';
import { matches } from '../store';
import { makeAsyncEffect } from './async.effect';

describe('makeAsyncEffect', () => {
  const asyncActionKey = 'myAsyncActionKey' as const;
  const asyncActionCreators = createAsyncActionCreators(asyncActionKey);
  const createAsyncEffect = makeAsyncEffect(asyncActionCreators);

  it('emits a loading action', async () => {
    return FastCheck.assert(
      FastCheck.asyncProperty(
        FastCheck.string(),
        FastCheck.anything(),
        FastCheck.anything(),
        FastCheck.anything(),
        async (triggeringKey, result, actionPayload, oldState) => {
          const effect = createAsyncEffect({
            when: matches({ type: triggeringKey }),
            do: async () => Promise.resolve(result),
          });
          const action$ = merge(NEVER, of({ type: triggeringKey, payload: [actionPayload] }));
          const state$ = merge(NEVER, of({ status: 'idle' as const, payload: oldState }));
          const effectResult = await effect(action$, state$).pipe(take(1)).toPromise();

          expect(effectResult).toEqual({
            payload: oldState,
            subtype: 'async:load',
            type: asyncActionKey,
          });
        }
      ),
      { timeout: 20 }
    );
  });

  it('emits a success action', async () => {
    return FastCheck.assert(
      FastCheck.asyncProperty(
        FastCheck.string(),
        FastCheck.anything(),
        FastCheck.anything(),
        FastCheck.anything(),
        async (triggeringKey, result, actionPayload, oldState) => {
          const effect = createAsyncEffect({
            when: matches({ type: triggeringKey }),
            do: async () => Promise.resolve(result),
          });
          const action$ = merge(NEVER, of({ type: triggeringKey, payload: [actionPayload] }));
          const state$ = merge(NEVER, of({ status: 'idle' as const, payload: oldState }));
          const effectResult = await effect(action$, state$).pipe(take(2)).toPromise();
          expect(effectResult).toEqual({
            payload: result,
            subtype: 'async:succeed',
            type: asyncActionKey,
          });
        }
      ),
      { timeout: 20 }
    );
  });

  it('emits a fail action', async () => {
    return FastCheck.assert(
      FastCheck.asyncProperty(
        FastCheck.string(),
        FastCheck.anything(),
        FastCheck.anything(),
        FastCheck.anything(),
        async (triggeringKey, result, actionPayload, oldState) => {
          const effect = createAsyncEffect({
            when: matches({ type: triggeringKey }),
            do: async (): Promise<unknown> => Promise.reject(result),
          });
          const action$ = merge(NEVER, of({ type: triggeringKey, payload: [actionPayload] }));
          const state$ = merge(NEVER, of({ status: 'idle' as const, payload: oldState }));
          const effectResult = await effect(action$, state$).pipe(take(2)).toPromise();
          expect(effectResult).toEqual({
            payload: result,
            subtype: 'async:fail',
            type: asyncActionKey,
          });
        }
      ),
      { timeout: 20 }
    );
  });

  it('emits a load action with optimistic update', async () => {
    return FastCheck.assert(
      FastCheck.asyncProperty(
        FastCheck.string(),
        FastCheck.anything(),
        FastCheck.anything(),
        FastCheck.anything(),
        async (triggeringKey, result, actionPayload, oldState) => {
          const effect = createAsyncEffect({
            when: matches({ type: triggeringKey }),
            do: async () => Promise.resolve(result),
            predict: (_params, _state) => result,
          });
          const action$ = merge(NEVER, of({ type: triggeringKey, payload: [actionPayload] }));
          const state$ = merge(NEVER, of({ status: 'idle' as const, payload: oldState }));
          const effectResult = await effect(action$, state$).pipe(take(1)).toPromise();
          expect(effectResult).toEqual({
            payload: result,
            subtype: 'async:load',
            type: asyncActionKey,
          });
        }
      ),
      { timeout: 20 }
    );
  });

  it('emits a revert action upon failure with optimistic update', async () => {
    return FastCheck.assert(
      FastCheck.asyncProperty(
        FastCheck.string(),
        FastCheck.anything(),
        FastCheck.anything(),
        FastCheck.anything(),
        async (triggeringKey, result, actionPayload, oldState) => {
          const effect = createAsyncEffect({
            when: matches({ type: triggeringKey }),
            do: async (): Promise<unknown> => Promise.reject(result),
            predict: (_params, _state) => result,
          });
          const action$ = merge(NEVER, of({ type: triggeringKey, payload: [actionPayload] }));
          const state$ = merge(NEVER, of({ status: 'idle' as const, payload: oldState }));
          const effectResult = await effect(action$, state$).pipe(take(2)).toPromise();
          expect(effectResult).toEqual({
            payload: oldState,
            subtype: 'async:revert',
            type: asyncActionKey,
          });
        }
      ),
      { timeout: 20 }
    );
  });

  it('emits a fail action upon failure with optimistic update', async () => {
    return FastCheck.assert(
      FastCheck.asyncProperty(
        FastCheck.string(),
        FastCheck.anything(),
        FastCheck.anything(),
        FastCheck.anything(),
        async (triggeringKey, result, actionPayload, oldState) => {
          const effect = createAsyncEffect({
            when: matches({ type: triggeringKey }),
            do: async (): Promise<unknown> => Promise.reject(result),
            predict: (_params, _state) => result,
          });
          const action$ = merge(NEVER, of({ type: triggeringKey, payload: [actionPayload] }));
          const state$ = merge(NEVER, of({ status: 'idle' as const, payload: oldState }));
          const effectResult = await effect(action$, state$).pipe(take(3)).toPromise();
          expect(effectResult).toEqual({
            payload: result,
            subtype: 'async:fail',
            type: asyncActionKey,
          });
        }
      ),
      { timeout: 20 }
    );
  });
});

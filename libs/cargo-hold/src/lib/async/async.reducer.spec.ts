import * as FastCheck from 'fast-check';
import { AsyncState, createAsyncActionCreators, createLensedReducers, createReducers } from '.';
import { AnyAction, LensCreator, StateReducer } from '..';
import {
  createCombinedReducer,
  createFailureState,
  createIdleState,
  createLoadingState,
  createSuccessState,
} from './async.reducer';
import { asyncStateArbitrary } from '../../testing/fast-check-arbitraries.util';

const createAsyncState = () => asyncStateArbitrary(FastCheck.anything(), FastCheck.anything());

describe('createIdleState', () => {
  it('creates an idle state', () => {
    FastCheck.assert(
      FastCheck.property(FastCheck.anything(), (payload) => {
        expect(createIdleState(payload)).toEqual({ status: 'idle', payload });
      })
    );
  });
});

describe('createLoadingState', () => {
  it('creates a loading state', () => {
    FastCheck.assert(
      FastCheck.property(FastCheck.anything(), (payload) => {
        expect(createLoadingState(payload)).toEqual({ status: 'loading', payload });
      })
    );
  });
});

describe('createSuccessState', () => {
  it('creates a success state', () => {
    FastCheck.assert(
      FastCheck.property(FastCheck.anything(), (payload) => {
        expect(createSuccessState(payload)).toEqual({ status: 'success', payload });
      })
    );
  });
});

describe('createFailureState', () => {
  it('creates a failure state', () => {
    FastCheck.assert(
      FastCheck.property(FastCheck.anything(), FastCheck.anything(), (payload, failure) => {
        expect(createFailureState(payload, failure)).toEqual({
          status: 'failure',
          payload,
          failure,
        });
      })
    );
  });
});

describe('createReducers', () => {
  it('creates a reducer object of the right shape', () => {
    const reducers = createReducers();
    expect(reducers).toHaveProperty('init');
    expect(reducers).toHaveProperty('load');
    expect(reducers).toHaveProperty('succeed');
    expect(reducers).toHaveProperty('fail');
    expect(reducers).toHaveProperty('revert');
  });

  it('creates a working init reducer', () => {
    FastCheck.assert(
      FastCheck.property(createAsyncState(), FastCheck.anything(), (oldState, payload) => {
        const reducers = createReducers();
        const stateReducer: StateReducer<AsyncState<unknown, unknown>> = reducers.init(payload);
        expect(stateReducer(oldState)).toEqual({
          status: 'idle',
          payload,
        });
      })
    );
  });

  it('creates a working loading reducer', () => {
    FastCheck.assert(
      FastCheck.property(createAsyncState(), FastCheck.anything(), (oldState, payload) => {
        const reducers = createReducers();
        const stateReducer: StateReducer<AsyncState<unknown, unknown>> = reducers.load(payload);
        expect(stateReducer(oldState)).toEqual({
          status: 'loading',
          payload,
        });
      })
    );
  });

  it('creates a working success reducer', () => {
    FastCheck.assert(
      FastCheck.property(createAsyncState(), FastCheck.anything(), (oldState, payload) => {
        const reducers = createReducers();
        const stateReducer: StateReducer<AsyncState<unknown, unknown>> = reducers.succeed(payload);
        expect(stateReducer(oldState)).toEqual({
          status: 'success',
          payload,
        });
      })
    );
  });

  it('creates a working revert reducer', () => {
    FastCheck.assert(
      FastCheck.property(createAsyncState(), FastCheck.anything(), (oldState, payload) => {
        const reducers = createReducers();
        const stateReducer: StateReducer<AsyncState<unknown, unknown>> = reducers.revert(payload);
        expect(stateReducer(oldState)).toEqual({
          status: oldState.status,
          payload,
          failure: oldState.status === 'failure' ? oldState.failure : undefined,
        });
      })
    );
  });

  it('creates a working fail reducer', () => {
    FastCheck.assert(
      FastCheck.property(createAsyncState(), FastCheck.anything(), (oldState, failure) => {
        const reducers = createReducers();
        const stateReducer: StateReducer<AsyncState<unknown, unknown>> = reducers.fail(failure);
        expect(stateReducer(oldState)).toEqual({
          status: 'failure',
          payload: oldState.payload,
          failure,
        });
      })
    );
  });
});

describe('createLensedReducers', () => {
  type State = {
    nestedValue: AsyncState<unknown, unknown>;
  };
  const lens = new LensCreator<State>().fromProp('nestedValue');

  it('creates a working init reducer', () => {
    FastCheck.assert(
      FastCheck.property(
        FastCheck.record({ nestedValue: createAsyncState() }),
        FastCheck.anything(),
        (oldState, payload) => {
          const reducers = createLensedReducers(lens);
          const stateReducer: StateReducer<State> = reducers.init(payload);
          expect(stateReducer(oldState)).toEqual({
            nestedValue: {
              status: 'idle',
              payload,
            },
          });
        }
      )
    );
  });

  it('creates a working loading reducer', () => {
    FastCheck.assert(
      FastCheck.property(
        FastCheck.record({ nestedValue: createAsyncState() }),
        FastCheck.anything(),
        (oldState, payload) => {
          const reducers = createLensedReducers(lens);
          const stateReducer: StateReducer<State> = reducers.load(payload);
          expect(stateReducer(oldState)).toEqual({
            nestedValue: {
              status: 'loading',
              payload,
            },
          });
        }
      )
    );
  });

  it('creates a working success reducer', () => {
    FastCheck.assert(
      FastCheck.property(
        FastCheck.record({ nestedValue: createAsyncState() }),
        FastCheck.anything(),
        (oldState, payload) => {
          const reducers = createLensedReducers(lens);
          const stateReducer: StateReducer<State> = reducers.succeed(payload);
          expect(stateReducer(oldState)).toEqual({
            nestedValue: {
              status: 'success',
              payload,
            },
          });
        }
      )
    );
  });

  it('creates a working revert reducer', () => {
    FastCheck.assert(
      FastCheck.property(
        FastCheck.record({ nestedValue: createAsyncState() }),
        FastCheck.anything(),
        (oldState, payload) => {
          const reducers = createLensedReducers(lens);
          const stateReducer: StateReducer<State> = reducers.revert(payload);
          expect(stateReducer(oldState)).toEqual({
            nestedValue: {
              status: oldState.nestedValue.status,
              payload,
              failure:
                oldState.nestedValue.status === 'failure'
                  ? oldState.nestedValue.failure
                  : undefined,
            },
          });
        }
      )
    );
  });

  it('creates a working fail reducer', () => {
    FastCheck.assert(
      FastCheck.property(
        FastCheck.record({ nestedValue: createAsyncState() }),
        FastCheck.anything(),
        (oldState, failure) => {
          const reducers = createLensedReducers(lens);
          const stateReducer: StateReducer<State> = reducers.fail(failure);
          expect(stateReducer(oldState)).toEqual({
            nestedValue: {
              status: 'failure',
              payload: oldState.nestedValue.payload,
              failure,
            },
          });
        }
      )
    );
  });
});

describe('createCombinedReducer', () => {
  const myAsyncActionKey = 'asyncActionKey' as const;
  const actionCreators = createAsyncActionCreators(myAsyncActionKey);
  const idLens = new LensCreator<AsyncState<unknown, unknown>>().id();
  const combinedActionReducer = createCombinedReducer(actionCreators, idLens);

  it('returns state if no actions match', () => {
    FastCheck.assert(
      FastCheck.property(
        createAsyncState(),
        FastCheck.string().filter((str) => str !== myAsyncActionKey),
        FastCheck.anything(),
        (oldState, key, payload) => {
          const action: AnyAction = { type: key, payload };
          expect(combinedActionReducer(action)(oldState)).toEqual(oldState);
        }
      )
    );
  });

  it('updates upon init action', () => {
    FastCheck.assert(
      FastCheck.property(createAsyncState(), FastCheck.anything(), (oldState, payload) => {
        expect(combinedActionReducer(actionCreators.init.create(payload))(oldState)).toEqual({
          status: 'idle',
          payload,
        });
      })
    );
  });

  it('updates upon load action', () => {
    FastCheck.assert(
      FastCheck.property(createAsyncState(), FastCheck.anything(), (oldState, payload) => {
        expect(combinedActionReducer(actionCreators.load.create(payload))(oldState)).toEqual({
          status: 'loading',
          payload,
        });
      })
    );
  });

  it('updates upon success action', () => {
    FastCheck.assert(
      FastCheck.property(createAsyncState(), FastCheck.anything(), (oldState, payload) => {
        expect(combinedActionReducer(actionCreators.succeed.create(payload))(oldState)).toEqual({
          status: 'success',
          payload,
        });
      })
    );
  });

  it('updates upon revert action', () => {
    FastCheck.assert(
      FastCheck.property(createAsyncState(), FastCheck.anything(), (oldState, payload) => {
        expect(combinedActionReducer(actionCreators.revert.create(payload))(oldState)).toEqual({
          ...oldState,
          payload,
        });
      })
    );
  });

  it('updates upon fail action', () => {
    FastCheck.assert(
      FastCheck.property(createAsyncState(), FastCheck.anything(), (oldState, failure) => {
        expect(combinedActionReducer(actionCreators.fail.create(failure))(oldState)).toEqual({
          ...oldState,
          status: 'failure',
          failure,
        });
      })
    );
  });
});

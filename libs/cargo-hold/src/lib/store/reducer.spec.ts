import { and, combineActionReducers } from '.';
import { isType, on, requireSource } from './reducer';
import type { AnyActionReducer } from './store.types';

type State = {
  filterMatched: boolean;
  someNumber: number;
};
const initialState: State = {
  filterMatched: false,
  someNumber: 0,
};
const matchedState: State = {
  filterMatched: true,
  someNumber: 0,
};

const isTrueReducer: AnyActionReducer<State> = () => (state) => ({
  ...state,
  filterMatched: true,
});

const simpleReducer = on(isType('targetType'), isTrueReducer);

const matchFooReducer = on(and(isType('targetType'), requireSource('foo')), isTrueReducer);

const matchNoSourcesReducer = on(
  and(isType('targetType'), requireSource(undefined)),
  isTrueReducer
);

describe('filterActions', () => {
  it('includes the correct types', () => {
    expect(simpleReducer({ type: 'targetType', payload: null })(initialState)).toEqual<State>(
      matchedState
    );
    expect(simpleReducer({ type: 'nonTargetType', payload: null })(initialState)).toEqual<State>(
      initialState
    );
  });

  it('includes the correct sources', () => {
    expect(
      matchFooReducer({ type: 'targetType', payload: null, source: 'foo' })(initialState)
    ).toEqual<State>(matchedState);
    expect(matchFooReducer({ type: 'targetType', payload: null })(initialState)).toEqual<State>(
      initialState
    );
  });

  it('can block "sourced" actions', () => {
    expect(
      matchNoSourcesReducer({ type: 'targetType', payload: null })(initialState)
    ).toEqual<State>(matchedState);
    expect(
      matchNoSourcesReducer({ type: 'targetType', payload: null, source: 'foo' })(initialState)
    ).toEqual<State>(initialState);
  });
});

describe('combineReducers', () => {
  it('can combine 0 reducers', () => {
    expect(
      combineActionReducers<State>()({ type: 'targetType', payload: null })(initialState)
    ).toEqual<State>(initialState);
  });

  it('can combine 1 reducer', () => {
    expect(
      combineActionReducers<State>(simpleReducer)({ type: 'targetType', payload: null })(
        initialState
      )
    ).toEqual<State>(matchedState);
  });

  it('can combine multiple reducers', () => {
    const reducer = combineActionReducers<State>(
      (action) => (state) => {
        if (action.type === 'nonTargetType') {
          return {
            ...state,
            someNumber: 15,
          };
        }
        return state;
      },
      simpleReducer
    );
    expect(reducer({ type: 'nonTargetType', payload: null })(initialState)).toEqual<State>({
      filterMatched: false,
      someNumber: 15,
    });
    expect(reducer({ type: 'targetType', payload: null })(initialState)).toEqual<State>(
      matchedState
    );
  });
});

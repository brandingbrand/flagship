import { filter, map, skip, take } from 'rxjs/operators';
import { and, combineActionReducers, on } from '.';
import { Action } from '../action-bus';
import { isType, requireSource } from './reducer';
import { Store } from './store';
import type { Effect } from './store.types';

type LoginAction = Action<'login', { username: string; password: string }>;
type LogoutAction = Action<'logout', undefined>;
type AddItemToListAction = Action<'addItemToList', any>;
type TriggerEffectAction = Action<'triggerEffect', any>;

type State = {
  listOfThings: any[];
  isLoggedIn: boolean;
  user:
    | {
        username: string;
      }
    | undefined;
};

const loginReducer = on<State, LoginAction>(isType('login'), (action) => (state) => ({
  ...state,
  isLoggedIn: true,
  user: { username: action.payload.username },
}));

const logoutReducer = on<State, LogoutAction>(isType('logout'), (_action) => (state) => ({
  ...state,
  isLoggedIn: false,
  user: undefined,
}));

const logoutFromSpecialSourceReducer = on<State, LogoutAction>(
  and(requireSource('special sauce'), isType('logout')),
  (_action) => (state) => ({
    ...state,
    isLoggedIn: true,
    user: { username: 'this is totally a backdoor' },
  })
);

const addItemToListReducer = on<State, AddItemToListAction>(
  isType('addItemToList'),
  (action) => (state) => ({
    ...state,
    listOfThings: [...state.listOfThings, action.payload],
  })
);

const triggeredEffect: Effect<State> = (action$) =>
  action$.pipe(
    filter(isType<TriggerEffectAction>('triggerEffect')),
    map((action) => ({ type: 'addItemToList', payload: { item: action.payload.item } }))
  );

describe('Store', () => {
  jest.setTimeout(300);
  let store: Store<State>;
  beforeEach(() => {
    store = new Store<State>({
      listOfThings: [],
      isLoggedIn: false,
      user: undefined,
    });
    store.registerReducer(
      combineActionReducers(
        loginReducer,
        logoutReducer,
        logoutFromSpecialSourceReducer,
        addItemToListReducer
      )
    );
    store.registerEffect(triggeredEffect);
  });

  it('initializes correctly', (done) => {
    expect.assertions(3);
    store.state$.pipe(take(1)).subscribe({
      next: (state) => {
        expect(state.listOfThings).toEqual([]);
        expect(state.user).toBeUndefined();
        expect(state.isLoggedIn).toBe(false);
        done();
      },
    });
  });

  it('fakes a login correctly', (done) => {
    store.state$.pipe(skip(1), take(1)).subscribe({
      next: (state) => {
        expect(state).toEqual({
          listOfThings: [],
          user: { username: 'alice' },
          isLoggedIn: true,
        });
        done();
      },
    });
    store.dispatch({
      type: 'login',
      payload: {
        username: 'alice',
        password: 'pass1234',
      },
    });
  });

  it('fakes a logout correctly', (done) => {
    store.state$.pipe(skip(2), take(1)).subscribe({
      next: (state) => {
        expect(state).toEqual({
          listOfThings: [],
          user: undefined,
          isLoggedIn: false,
        });
        done();
      },
    });
    store.dispatch({
      type: 'login',
      payload: {
        username: 'alice',
        password: 'pass1234',
      },
    });
    store.dispatch({
      type: 'logout',
      payload: {},
    });
  });

  it('handles source props correctly', (done) => {
    store.state$.pipe(skip(2)).subscribe({
      next: (state) => {
        expect(state).toEqual<State>({
          listOfThings: [],
          user: { username: 'this is totally a backdoor' },
          isLoggedIn: true,
        });
        done();
      },
    });

    store.dispatch({
      type: 'login',
      payload: {
        username: 'alice',
        password: 'pass1234',
      },
    });

    store.dispatch({
      type: 'logout',
      payload: {},
      source: 'special sauce',
    });
    store.dispose();
  });

  it('handles many dispatches', (done) => {
    store.state$.pipe(skip(10)).subscribe({
      next: (state) => {
        expect(state.listOfThings.length).toEqual(10);
        done();
      },
    });

    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((index) => {
      store.dispatch({
        type: 'addItemToList',
        payload: index,
      });
    });
    store.dispose();
  });

  it('triggers simple effects', (done) => {
    store.state$.pipe(skip(2)).subscribe({
      next: (state) => {
        expect(state.listOfThings.length).toEqual(1);
        done();
      },
    });
    store.dispatch({
      type: 'triggerEffect',
      payload: 17,
    });
  });
});

import AsyncStorage from '@react-native-community/async-storage';
export default function persistReducer(
  key: string, reducer: <T>(store: T, action: {type: string}) => void
): object {
  return <T>(store: T, action: {type: string}) => {
    const nextState = reducer(store, action);
    if (action.type.indexOf('@@') === -1 && nextState) {
      AsyncStorage.setItem(key, JSON.stringify(nextState)).catch(e =>
        console.warn('error on persistReducer AsyncStorage.setItem', e)
      );
    }
    return nextState;
  };
}

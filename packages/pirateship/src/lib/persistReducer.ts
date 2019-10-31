import AsyncStorage from '@react-native-community/async-storage';

// TODO: fix these types
export default function persistReducer(key: string, reducer: any): any {
  return (store: any, action: any) => {
    const nextState = reducer(store, action);
    if (action.type.indexOf('@@') === -1 && nextState) {
      AsyncStorage.setItem(key, JSON.stringify(nextState)).catch(e =>
        console.warn('error on persistReducer AsyncStorage.setItem', e)
      );
    }
    return nextState;
  };
}

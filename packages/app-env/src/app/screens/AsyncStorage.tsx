import storage from '@react-native-async-storage/async-storage';

import {createDataViewerDevScreen} from './DataViewer';

export type AsyncStorageKeyFilterPredicate = (key: string) => boolean;

export interface AsyncStorageDevScreenOpts {
  /**
   * The title to display within the Dev Menu.
   *
   * @default 'AsyncStorage'
   */
  title?: string;

  /**
   * If true, AsyncStorage values that are detected as
   * JSON strings will be parsed and formatted for display.
   *
   * @default true
   */
  parseValues?: boolean;

  /**
   * A filter predicate function that determines whether the given AsyncStorage
   * key should be displayed in the AsyncStorage dev screen.
   *
   * If `undefined`, all AsyncStorage keys will be displayed in the dev screen.
   *
   * This filter **does not** affect which keys are removed when the "Clear AsyncStorage"
   * action is invoked. It only controls which keys are displayed in the dev screen.
   */
  displayKeyFilter?: AsyncStorageKeyFilterPredicate;

  /**
   * A filter predicate function that determines whether the given AsyncStorage
   * key should be removed when the "Clear AsyncStorage" action is invoked.
   *
   * if `undefined`, all keys will be removed when the "Clear AsyncStorage" action
   * is invoked, even if the keys are hidden by the `displayKeyFilter`.
   */
  clearKeyFilter?: AsyncStorageKeyFilterPredicate;
}

export const createAsyncStorageDevScreen = (
  opts: AsyncStorageDevScreenOpts,
) => {
  const {clearKeyFilter, displayKeyFilter, parseValues = true, title} = opts;
  return createDataViewerDevScreen<
    string | readonly {key: string; value: any}[]
  >({
    title: title ?? 'AsyncStorage',
    initialContent: 'Loading...',
    deepParseContent: parseValues,
    onGetContent: async () => {
      let keys = await storage.getAllKeys();
      if (displayKeyFilter) {
        keys = keys.filter(displayKeyFilter);
      }
      return (await storage.multiGet(keys)).map(it => ({
        key: it[0],
        value: it[1],
      }));
    },
    actions: ctx => [
      {
        label: `Clear AsyncStorage${Array.isArray(ctx.content) && ctx.content.length > 0 ? ` (${ctx.content.length} items)` : ''}`,
        onPress: async () => {
          let keys = await storage.getAllKeys();
          if (clearKeyFilter) {
            keys = keys.filter(clearKeyFilter);
          }

          await storage.multiRemove(keys);
          await ctx.refetch();
        },
        disabled: Array.isArray(ctx.content) ? ctx.content.length === 0 : true,
      },
    ],
  });
};

export const AsyncStorageDevScreen = createAsyncStorageDevScreen({});

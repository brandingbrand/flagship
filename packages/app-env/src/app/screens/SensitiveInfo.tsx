import {deleteItem, getAllItems} from 'react-native-sensitive-info';

import {createDataViewerDevScreen} from './DataViewer';

export interface SensitiveInfoDevScreenProps {
  /**
   * The title to display within the Dev Menu.
   *
   * @default 'SensitiveInfo (<keychainService>)'
   */
  title?: string;

  /**
   * The keychain service to use when querying SensitiveInfo.
   * If undefined, the default keychain service will be used.
   */
  keychainService?: string;
}

export const createSensitiveInfoDevScreen = (
  props: SensitiveInfoDevScreenProps,
) =>
  createDataViewerDevScreen<string | string[]>({
    title:
      props.title ??
      `SensitiveInfo${props.keychainService ? ` (${props.keychainService})` : ''}`,
    initialContent: 'loading...',
    onGetContent: async () =>
      getAllItems({keychainService: props.keychainService}),
    actions: ctx => [
      {
        label: `Clear SensitiveInfo${props.keychainService ? ` (${props.keychainService})` : ''}`,
        onPress: async () => {
          const keys = await getAllItems({
            keychainService: props.keychainService,
          });
          await Promise.all(
            keys.map(async key =>
              deleteItem(key, {keychainService: props.keychainService}),
            ),
          );
          await ctx.refetch();
        },
        disabled: Array.isArray(ctx.content) ? ctx.content.length === 0 : true,
      },
    ],
  });

export const SensitiveInfoDevScreen = createSensitiveInfoDevScreen({});

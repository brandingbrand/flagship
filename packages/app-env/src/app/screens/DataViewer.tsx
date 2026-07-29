import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {DataView, DataViewAction} from '../components/ui';
import {defineDevMenuScreen} from '../lib/define-screen';

export interface DataViewerDevScreenProps<ContentT = any> {
  /**
   * The title to display within the Dev Menu.
   */
  title: string;

  /**
   * Default value to display while the content is loading.
   */
  initialContent: ContentT;

  /**
   * Array of actions to display below the DataViewer, or a function that returns
   * an array of actions based on the current context.
   *
   * @default undefined
   */
  actions?:
    | DataViewAction[]
    | ((context: {
        content: ContentT;
        refetch: () => Promise<void>;
      }) => DataViewAction[]);

  /**
   * When data is returned as a stringifiable object or array, this value
   * controls the number of spaces used to indent nested structures.
   *
   * @default 2
   */
  contentIndent?: number;

  /**
   * If true, Data provided will be recursively checked for stringified objects
   * and arrays, which will be parsed and formatted for display.
   *
   * This occurs as an in-line replacement of the stringified value.
   *
   * @default false
   */
  deepParseContent?: boolean;

  /**
   * Function that will be called to retrieve the content to display in the DataViewer.
   * Can return the content directly or a Promise that resolves to the content.
   *
   * If the data is static (unchanging) and accessed synchronously, `initialData`
   * can be used to provide the value directly without needing `onGetData`.
   *
   * @default undefined
   */
  onGetContent?: () => ContentT | Promise<ContentT>;

  /**
   * The subtitle to display within the Dev Menu. shown directly above the `DataView`.
   *
   * @default undefined
   */
  subTitle?: string;
}

/**
 * Generates a generic Dev Menu Screen for displaying arbitrary data through the `DataView` component.
 */
export const createDataViewerDevScreen = <ContentT,>(
  opts: DataViewerDevScreenProps<ContentT>,
) => {
  const {
    actions,
    contentIndent,
    deepParseContent,
    initialContent,
    onGetContent,
    subTitle,
    title,
  } = opts;

  return defineDevMenuScreen(title, function DataViewerDevScreen() {
    const [content, setContent] = useState<ContentT>(initialContent);

    const fetchData = useCallback(async () => {
      if (!onGetContent) return;
      try {
        const data = await onGetContent();
        setContent(data);
      } catch (error) {
        console.error(
          `[DevMenu - ${title}] Error occurred while fetching data`,
          error,
        );
      }
    }, []);

    useEffect(() => {
      fetchData();
    }, []);

    const resolvedActions = useMemo(() => {
      try {
        return typeof actions === 'function'
          ? actions({content, refetch: fetchData})
          : actions;
      } catch (error) {
        console.error(
          `[DevMenu - ${title}] Error occurred while resolving actions`,
          error,
        );
        return undefined;
      }
    }, [content, fetchData]);

    return (
      <DataView
        actions={resolvedActions}
        content={content}
        contentIndent={contentIndent}
        deepParse={deepParseContent}
        title={subTitle}
      />
    );
  });
};

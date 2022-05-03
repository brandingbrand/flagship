import { GridItem } from './utils';

export const DEFAULT_COLUMNS = 2;
export const DEFAULT_MIN_COLUMNS = 175;
export const DEFAULT_BACK_TOP_BUTTON_SHOW_AT_HEIGHT = 100;
export const DEFAULT_KEY_EXTRACTOR = <ItemT extends GridItem<{ id?: string; key?: string } | null>>(
  items: ItemT[],
  index: number
): string => {
  const key = items
    .map((item) => item.value?.key ?? item.value?.id)
    .filter(Boolean)
    .join();

  return key || `${index}`;
};

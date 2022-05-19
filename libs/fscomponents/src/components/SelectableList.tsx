import type { FC } from 'react';
import React, { useCallback, useMemo } from 'react';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import type { CommerceTypes } from '@brandingbrand/fscommerce';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

import { Button } from './Button';
import type { SelectableRowProps } from './SelectableRow';
import { SelectableRow } from './SelectableRow';

export type SelectableListItem = CommerceTypes.SortingOption;

export interface SelectableListProps {
  style?: StyleProp<ViewStyle>;
  onChange: (item: SelectableListItem) => void;
  items: SelectableListItem[];
  selectedId?: string;
  selectableRow?: Partial<SelectableRowProps>;
  applyButton?:
    | boolean
    | ((handleApply?: () => void, selectedItem?: SelectableListItem) => JSX.Element);
  applyButtonStyle?: StyleProp<ViewStyle>;
  applyDisabledStyle?: StyleProp<ViewStyle>;
  applyButtonTextStyle?: StyleProp<TextStyle>;
  applyButtonText?: string;
  radioButton?: boolean;
}

export interface SelectableListState {
  selectedItem?: SelectableListItem;
}

const S = StyleSheet.create({
  applyButton: {
    bottom: 15,
    height: undefined,
    justifyContent: 'center',
    left: 20,
    paddingVertical: 17,
    position: 'absolute',
    right: 20,
    zIndex: 1,
  },
  applyButtonText: {
    fontSize: 18,
    letterSpacing: 1,
    lineHeight: 21,
    textAlign: 'center',
  },
  applyDisabled: {
    opacity: 0.5,
  },
  container: {
    flex: 1,
  },
});

const RenderApply = ({
  handleApply,
  props,
  selectedItem,
}: {
  props: SelectableListProps | undefined;
  handleApply: () => undefined | void;
  selectedItem: CommerceTypes.SortingOption | undefined;
}): JSX.Element | null => {
  if (props?.applyButton) {
    if (props.applyButton !== true) {
      return props.applyButton(handleApply, selectedItem);
    }
    return (
      <Button
        onPress={handleApply}
        style={[
          S.applyButton,
          props.applyButtonStyle,
          selectedItem ? undefined : [S.applyDisabled, props.applyDisabledStyle],
        ]}
        title={props.applyButtonText || FSI18n.string(translationKeys.flagship.button.apply)}
        titleStyle={[S.applyButtonText, props.applyButtonTextStyle]}
      />
    );
  }
  return null;
};

export const SelectableList: FC<SelectableListProps> = (props) => {
  const selectedItem = useMemo(() => {
    for (const item of props.items) {
      if (item.id === props.selectedId) {
        return item;
      }
    }

    return undefined;
  }, [props.items, props.selectedId]);

  const renderItem = (item: SelectableListItem, index: number) => (
    <SelectableRow
      key={item.id || index}
      onPress={() => props.onChange}
      radioButton={props.radioButton}
      selected={selectedItem ? item.id === selectedItem.id : item.id === props.selectedId}
      title={item.title}
      {...props.selectableRow}
    />
  );

  const handleApply = useCallback((): void => {
    if (selectedItem) {
      props.onChange(selectedItem);
    }
  }, [props, selectedItem]);

  return (
    <View style={[S.container, props.style]}>
      {props.items.map(renderItem)}
      <RenderApply handleApply={handleApply} props={props} selectedItem={selectedItem} />
    </View>
  );
};

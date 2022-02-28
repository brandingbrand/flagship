import React, { FC, useCallback, useMemo } from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
import { Button } from './Button';

import { SelectableRow, SelectableRowProps } from './SelectableRow';

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
  container: {
    flex: 1,
  },
  applyButton: {
    position: 'absolute',
    bottom: 15,
    zIndex: 1,
    justifyContent: 'center',
    paddingVertical: 17,
    height: undefined,
    left: 20,
    right: 20,
  },
  applyDisabled: {
    opacity: 0.5,
  },
  applyButtonText: {
    fontSize: 18,
    lineHeight: 21,
    letterSpacing: 1,
    textAlign: 'center',
  },
});

const RenderApply = ({
  props,
  handleApply,
  selectedItem,
}: {
  props: SelectableListProps | undefined;
  handleApply: () => void | undefined;
  selectedItem: CommerceTypes.SortingOption | undefined;
}): JSX.Element | null => {
  if (props?.applyButton) {
    if (props.applyButton !== true) {
      return props.applyButton(handleApply, selectedItem);
    } else {
      return (
        <Button
          title={props.applyButtonText || FSI18n.string(translationKeys.flagship.button.apply)}
          onPress={handleApply}
          style={[
            S.applyButton,
            props.applyButtonStyle,
            selectedItem ? undefined : [S.applyDisabled, props.applyDisabledStyle],
          ]}
          titleStyle={[S.applyButtonText, props.applyButtonTextStyle]}
        />
      );
    }
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

  const renderItem = (item: SelectableListItem, index: number) => {
    return (
      <SelectableRow
        key={item.id || index}
        title={item.title}
        selected={selectedItem ? item.id === selectedItem.id : item.id === props.selectedId}
        radioButton={props.radioButton}
        // eslint-disable-next-line react/jsx-no-bind
        onPress={() => props.onChange}
        {...props.selectableRow}
      />
    );
  };

  const handleApply = useCallback((): void => {
    if (selectedItem) {
      props.onChange(selectedItem);
    }
  }, [props, selectedItem]);

  return (
    <View style={[S.container, props.style]}>
      {props.items.map(renderItem)}
      <RenderApply props={props} handleApply={handleApply} selectedItem={selectedItem} />
    </View>
  );
};

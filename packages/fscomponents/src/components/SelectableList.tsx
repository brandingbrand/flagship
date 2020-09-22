import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { SelectableRow, SelectableRowProps } from './SelectableRow';

export interface SelectableListItem {
  title: string;
  id: string;
}

export interface SelectableListProps {
  style?: StyleProp<ViewStyle>;
  onChange: (item: SelectableListItem) => void;
  items: SelectableListItem[];
  selectedId?: string;
  selectableRow?: SelectableRowProps;
}

const S = StyleSheet.create({
  container: {
    flex: 1
  }
});

export const SelectableList = (props: SelectableListProps): JSX.Element => {
  const handlePress = (item: SelectableListItem) => () => {
    props.onChange(item);
  };

  const renderItem = (item: SelectableListItem, index: number) => {
    return (
      <SelectableRow
        key={item.id || index}
        title={item.title}
        selected={item.id === props.selectedId}
        onPress={handlePress(item)}
        {...props.selectableRow}
      />
    );
  };

  return (
    <View style={[S.container, props.style]}>
      {props.items.map(renderItem)}
    </View>
  );
};

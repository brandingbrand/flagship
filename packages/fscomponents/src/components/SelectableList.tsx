import React, { Component } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { CommerceTypes } from '@brandingbrand/fscommerce';

import { SelectableRow, SelectableRowProps } from './SelectableRow';

export type SelectableListItem = CommerceTypes.SortingOption;

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

export class SelectableList extends Component<SelectableListProps> {
  renderItem = (item: SelectableListItem, index: number) => {
    return (
      <SelectableRow
        key={item.id || index}
        title={item.title}
        selected={item.id === this.props.selectedId}
        onPress={this.handlePress(item)}
        {...this.props.selectableRow}
      />
    );
  }

  handlePress = (item: SelectableListItem) => () => {
    this.props.onChange(item);
  }

  render(): JSX.Element {
    return (
      <View style={[S.container, this.props.style]}>
        {this.props.items.map(this.renderItem)}
      </View>
    );
  }
}

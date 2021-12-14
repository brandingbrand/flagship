import React, { Component } from 'react';
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
  applyButton?: boolean | ((
    handleApply?: () => void,
    selectedItem?: SelectableListItem
  ) => JSX.Element);
  applyButtonStyle?: StyleProp<ViewStyle>;
  applyDisabledStyle?: StyleProp<ViewStyle>;
  applyButtonTextStyle?: StyleProp<TextStyle>;
  applyButtonText?: string;
}

export interface SelectableListState {
  selectedItem?: SelectableListItem;
}

const S = StyleSheet.create({
  container: {
    flex: 1
  },
  applyButton: {
    position: 'absolute',
    bottom: 15,
    zIndex: 1,
    justifyContent: 'center',
    paddingVertical: 17,
    height: undefined,
    left: 20,
    right: 20
  },
  applyDisabled: {
    opacity: 0.5
  },
  applyButtonText: {
    fontSize: 18,
    lineHeight: 21,
    letterSpacing: 1,
    textAlign: 'center'
  }
});

export class SelectableList extends Component<SelectableListProps, SelectableListState> {
  constructor(props: SelectableListProps) {
    super(props);
    let selectedItem: SelectableListItem | undefined;
    if (props.selectedId) {
      props.items.forEach((item: SelectableListItem) => {
        if (item.id === props.selectedId) {
          selectedItem = item;
        }
      });
    }
    this.state = {
      selectedItem
    };
  }
  renderItem = (item: SelectableListItem, index: number) => {
    return (
      <SelectableRow
        key={item.id || index}
        title={item.title}
        selected={
          this.state.selectedItem ?
          item.id === this.state.selectedItem.id :
          item.id === this.props.selectedId
        }
        onPress={this.handlePress(item)}
        {...this.props.selectableRow}
      />
    );
  }

  renderApply = (): JSX.Element | null => {
    if (this.props.applyButton) {
      if (this.props.applyButton !== true) {
        return this.props.applyButton(this.handleApply, this.state.selectedItem);
      } else {
        return (
          <Button
            title={this.props.applyButtonText ||
              FSI18n.string(translationKeys.flagship.button.apply)}
            onPress={this.handleApply}
            style={[S.applyButton, this.props.applyButtonStyle,
              this.state.selectedItem ? undefined : [
                S.applyDisabled, this.props.applyDisabledStyle
              ]]}
            titleStyle={[S.applyButtonText, this.props.applyButtonTextStyle]}
          />
        );
      }
    }
    return null;
  }

  handlePress = (selectedItem: SelectableListItem) => () => {
    if (this.props.applyButton) {
      this.setState({
        selectedItem
      });
    } else {
      this.props.onChange(selectedItem);
    }
  }

  handleApply = (): void => {
    if (this.state.selectedItem) {
      this.props.onChange(this.state.selectedItem);
    }
  }

  render(): JSX.Element {
    return (
      <View style={[S.container, this.props.style]}>
        {this.props.items.map(this.renderItem)}
        {this.renderApply()}
      </View>
    );
  }
}

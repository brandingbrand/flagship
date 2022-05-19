import React, { PureComponent } from 'react';

import type { ListRenderItemInfo, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

import type { AccordionProps } from '../Accordion';
import { Accordion } from '../Accordion';
import type { SelectableRowProps } from '../SelectableRow';
import { SelectableRow } from '../SelectableRow';

import type { FilterItem } from './FilterItem';
import type { FilterItemValue } from './FilterItemValue';

const componentTranslationKeys = translationKeys.flagship.filterListDefaults;

const defaultSingleFilterIds = [`cgid`];

export type SelectedItems = Record<string, string[]>;

export interface FilterListProps {
  items: FilterItem[];
  onApply: (selectedItems: Record<string, string[]>, info?: { isButtonPress: boolean }) => void;
  onReset: () => void;
  selectedItems?: Record<string, string[]>;
  style?: StyleProp<ViewStyle>;
  buttonContainerStyle?: StyleProp<ViewStyle>;
  resetButtonStyle?: StyleProp<ViewStyle>;
  applyButtonStyle?: StyleProp<ViewStyle>;
  resetButtonTextStyle?: StyleProp<TextStyle>;
  applyButtonTextStyle?: StyleProp<TextStyle>;
  applyText?: string;
  resetText?: string;
  itemStyle?: StyleProp<ViewStyle>;
  itemTextStyle?: StyleProp<TextStyle>;
  selectableRowProps?: Partial<SelectableRowProps>;
  accordionProps?: Partial<AccordionProps>;
  singleFilterIds?: string[];
  renderFilterTitle?: (item: FilterItem, selectedValues: string[]) => JSX.Element;
  renderFilterItemValue?: (
    item: FilterItem,
    value: FilterItemValue,
    handleSelect: () => void,
    selected: boolean
  ) => JSX.Element;
}

export interface FilterListState {
  selectedItems: Record<string, string[]>;
}

const S = StyleSheet.create({
  accordionheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  applyButton: {
    alignItems: 'center',
    backgroundColor: '#eee',
    flex: 1,
    height: 40,
    justifyContent: 'center',
    marginLeft: 10,
    marginVertical: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },
  container: {
    flex: 1,
  },
  selectedValueStyle: {
    color: '#999',
    flex: 1,
    fontSize: 13,
    marginHorizontal: 10,
    textAlign: 'right',
  },
  titleStyle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  valueButton: {
    height: 40,
  },
});

export class FilterList extends PureComponent<FilterListProps, FilterListState> {
  public static getDerivedStateFromProps(nextProps: FilterListProps): Partial<FilterListState> {
    return {
      selectedItems: nextProps.selectedItems || {},
    };
  }

  constructor(props: FilterListProps) {
    super(props);
    this.state = {
      selectedItems: props.selectedItems || {},
    };
  }

  private readonly handleSelect = (id: string, value: string) => () => {
    const { selectedItems } = this.state;
    const singleFilterIds = this.props.singleFilterIds || defaultSingleFilterIds;
    const selectedItem = selectedItems[id];
    // if already selected, and it's not in the list of single filter
    if (selectedItem && !singleFilterIds.includes(id)) {
      const findIndex = selectedItem.indexOf(value);
      if (findIndex > -1) {
        selectedItem.splice(findIndex, 1);
      } else {
        selectedItem.push(value);
      }
      this.setState({
        selectedItems: {
          ...selectedItems,
        },
      });
    } else {
      this.setState({
        selectedItems: {
          ...selectedItems,
          [id]: [value],
        },
      });
    }
  };

  private readonly renderFilterItemValue =
    (item: FilterItem) => (value: FilterItemValue, i: number) => {
      const selectedItem = this.state.selectedItems[item.id];
      const selected = (selectedItem && selectedItem.includes(value.value)) ?? false;

      if (this.props.renderFilterItemValue) {
        return this.props.renderFilterItemValue(
          item,
          value,
          this.handleSelect(item.id, value.value),
          selected
        );
      }

      return (
        <SelectableRow
          key={i}
          onPress={this.handleSelect(item.id, value.value)}
          selected={selected}
          title={value.title}
          {...this.props.selectableRowProps}
        />
      );
    };

  private readonly renderFilterItem = ({ item }: ListRenderItemInfo<FilterItem>) => {
    const selectedValues = this.state.selectedItems[item.id] || [];
    const selectedValueTitle = (item.values || [])
      .filter((v: FilterItemValue) => selectedValues.includes(v.value))
      .map((v: FilterItemValue) => v.title);

    let accordionTitle: JSX.Element | undefined =
      this.props.renderFilterTitle && this.props.renderFilterTitle(item, selectedValues);
    if (!accordionTitle) {
      accordionTitle = (
        <View style={[S.accordionheader, this.props.itemStyle]}>
          <Text style={[S.titleStyle, this.props.itemTextStyle]}>{item.title}</Text>
          <Text ellipsizeMode="tail" numberOfLines={1} style={S.selectedValueStyle}>
            {selectedValueTitle.join(', ')}
          </Text>
        </View>
      );
    }

    return (
      <Accordion
        content={
          <React.Fragment>
            {(item.values || []).map(this.renderFilterItemValue(item))}
          </React.Fragment>
        }
        title={accordionTitle}
        {...this.props.accordionProps}
      />
    );
  };

  private readonly handleApply = () => {
    this.props.onApply(this.state.selectedItems);
  };

  private readonly handleRest = () => {
    this.setState({ selectedItems: {} });
    this.props.onReset();
  };

  public render(): JSX.Element {
    // If we don't make a new copy, item in the
    // list won't get re-rendered when selected.
    // we might need more performant way to handle
    // this if there is performance issue
    const _items = [...this.props.items];
    return (
      <View style={[S.container, this.props.style]}>
        <FlatList data={_items} renderItem={this.renderFilterItem} />
        <View style={[S.buttonsContainer, this.props.buttonContainerStyle]}>
          <TouchableOpacity
            accessibilityLabel={FSI18n.string(componentTranslationKeys.reset)}
            accessibilityRole="button"
            onPress={this.handleRest}
            style={[S.applyButton, this.props.resetButtonStyle]}
          >
            <Text style={this.props.resetButtonTextStyle}>
              {this.props.resetText || FSI18n.string(componentTranslationKeys.reset)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel={FSI18n.string(componentTranslationKeys.apply)}
            accessibilityRole="button"
            onPress={this.handleApply}
            style={[S.applyButton, this.props.applyButtonStyle]}
          >
            <Text style={this.props.applyButtonTextStyle}>
              {this.props.applyText || FSI18n.string(componentTranslationKeys.apply)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

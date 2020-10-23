import React, { PureComponent } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { Accordion, AccordionProps } from '../Accordion';
import { SelectableRow, SelectableRowProps } from '../SelectableRow';
import { FilterItem } from './FilterItem';
import { FilterItemValue } from './FilterItemValue';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
const componentTranslationKeys = translationKeys.flagship.filterListDefaults;

const defaultSingleFilterIds = [`cgid`];

export interface SelectedItems {
  [key: string]: string[];
}

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
  titleStyle: {
    fontWeight: 'bold',
    fontSize: 15
  },
  valueButton: {
    height: 40
  },
  applyButton: {
    marginLeft: 10,
    marginVertical: 10,
    height: 40,
    flex: 1,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginRight: 10
  },
  accordionheader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  selectedValueStyle: {
    color: '#999',
    fontSize: 13,
    marginHorizontal: 10,
    textAlign: 'right',
    flex: 1
  }
});

export class FilterList extends PureComponent<FilterListProps, FilterListState> {
  static getDerivedStateFromProps(nextProps: FilterListProps): Partial<FilterListState> {
    return {
      selectedItems: nextProps.selectedItems || {}
    };
  }

  constructor(props: FilterListProps) {
    super(props);
    this.state = {
      selectedItems: props.selectedItems || {}
    };
  }

  handleSelect = (id: string, value: string) => () => {
    const { selectedItems } = this.state;
    const singleFilterIds =
      this.props.singleFilterIds || defaultSingleFilterIds;

    // if already selected, and it's not in the list of single filter
    if (selectedItems[id] && singleFilterIds.indexOf(id) === -1) {
      const findIndex = selectedItems[id].indexOf(value);
      if (findIndex > -1) {
        selectedItems[id].splice(findIndex, 1);
      } else {
        selectedItems[id].push(value);
      }
      this.setState({
        selectedItems: {
          ...selectedItems
        }
      });
    } else {
      this.setState({
        selectedItems: {
          ...selectedItems,
          [id]: [value]
        }
      });
    }
  }

  renderFilterItemValue = (item: FilterItem) => (value: FilterItemValue, i: number) => {
    const selected =
      this.state.selectedItems[item.id] &&
      this.state.selectedItems[item.id].indexOf(value.value) > -1;

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
        title={value.title}
        selected={selected}
        onPress={this.handleSelect(item.id, value.value)}
        {...this.props.selectableRowProps}
      />
    );
  }

  renderFilterItem = ({ item }: ListRenderItemInfo<FilterItem>) => {
    const selectedValues = this.state.selectedItems[item.id] || [];
    const selectedValueTitle = (item.values || [])
      .filter((v: FilterItemValue) => selectedValues.indexOf(v.value) > -1)
      .map((v: FilterItemValue) => v.title);

    let accordionTitle: JSX.Element | undefined = this.props.renderFilterTitle &&
      this.props.renderFilterTitle(item, selectedValues);
    if (!accordionTitle) {
      accordionTitle = (
        <View style={[S.accordionheader, this.props.itemStyle]}>
          <Text style={[S.titleStyle, this.props.itemTextStyle]}>
            {item.title}
          </Text>
          <Text
            style={S.selectedValueStyle}
            numberOfLines={1}
            ellipsizeMode='tail'
          >
            {selectedValueTitle.join(', ')}
          </Text>
        </View>
      );
    }

    return (
      <Accordion
        title={accordionTitle}
        content={(
          <>
            {(item.values || []).map(this.renderFilterItemValue(item))}
          </>
        )}
        {...this.props.accordionProps}
      />
    );
  }

  handleApply = () => {
    this.props.onApply(this.state.selectedItems);
  }

  handleRest = () => {
    this.setState({ selectedItems: {} });
    this.props.onReset();
  }

  render(): JSX.Element {
    // If we don't make a new copy, item in the
    // list won't get re-rendered when selected.
    // we might need more performant way to handle
    // this if there is performance issue
    const _items = [...this.props.items];
    return (
      <View style={[S.container, this.props.style]}>
        <FlatList
          data={_items}
          renderItem={this.renderFilterItem}
        />
        <View style={[S.buttonsContainer, this.props.buttonContainerStyle]}>
          <TouchableOpacity
            style={[S.applyButton, this.props.resetButtonStyle]}
            onPress={this.handleRest}
            accessibilityRole={'button'}
            accessibilityLabel={FSI18n.string(componentTranslationKeys.reset)}
          >
            <Text style={this.props.resetButtonTextStyle}>
              {this.props.resetText || FSI18n.string(componentTranslationKeys.reset)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[S.applyButton, this.props.applyButtonStyle]}
            onPress={this.handleApply}
            accessibilityRole={'button'}
            accessibilityLabel={FSI18n.string(componentTranslationKeys.apply)}
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

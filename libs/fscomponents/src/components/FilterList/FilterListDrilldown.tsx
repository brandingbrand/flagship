import React, { PureComponent } from 'react';

import type {
  ImageSourcePropType,
  ImageStyle,
  ListRenderItemInfo,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

import closeIcon from '../../../assets/images/clear.png';
import type { SelectableRowProps } from '../SelectableRow';
import { SelectableRow } from '../SelectableRow';

import type { FilterItem } from './FilterItem';
import type { FilterItemValue } from './FilterItemValue';

const componentTranslationKeys = translationKeys.flagship.filterListDefaults;

const defaultSingleFilterIds = [`cgid`];

export interface FilterListDrilldownProps {
  items: FilterItem[];
  onApply: (selectedItems: Record<string, string[]>, info?: { isButtonPress: boolean }) => void;
  onReset: (info?: { isButtonPress: boolean }) => void;
  onClose?: () => void;
  selectedItems?: Record<string, string[]>;
  style?: StyleProp<ViewStyle>;
  closeButtonStyle?: StyleProp<ViewStyle>;
  resetButtonStyle?: StyleProp<ViewStyle>;
  applyButtonStyle?: StyleProp<ViewStyle>;
  closeButtonImageStyle?: StyleProp<ImageStyle>;
  resetButtonTextStyle?: StyleProp<TextStyle>;
  applyButtonTextStyle?: StyleProp<TextStyle>;
  closeIcon?: ImageSourcePropType;
  applyText?: string;
  resetText?: string;
  floatingReset?: boolean;
  itemStyle?: StyleProp<ViewStyle>;
  itemTextStyle?: StyleProp<TextStyle>;
  itemTextSelectedStyle?: StyleProp<TextStyle>;
  selectedValueStyle?: StyleProp<TextStyle>;
  selectableRowProps?: Partial<SelectableRowProps>;
  singleFilterIds?: string[]; // Filter IDs for which only one value can be selected at a time
  ignoreActiveStyleIds?: string[]; // Filter IDs for which active styling won't be applied
  applyOnSelect?: boolean;
  renderFilterItem?: (
    item: FilterItem,
    i: number,
    selectedValues: string[],
    handlePress: () => void,
    renderFilterItem: (
      info: Omit<ListRenderItemInfo<FilterItem>, 'separators'>,
      skipCustomRender: boolean
    ) => JSX.Element
  ) => JSX.Element;
  renderFilterItemValue?: (
    item: FilterItem,
    i: number,
    value: FilterItemValue,
    handleSelect: () => void,
    selected: boolean,
    renderFilterItemValue: (
      item: FilterItem,
      skipCustomRender?: boolean
    ) => (info: Omit<ListRenderItemInfo<FilterItemValue>, 'separators'>) => JSX.Element
  ) => JSX.Element;
  renderSecondLevel?: (
    item: FilterItem,
    goBack: () => void,
    renderSecondLevel: (item: FilterItem, skipCustomRender?: boolean) => JSX.Element
  ) => JSX.Element;
  showUnselected?: boolean;
  showSelectedCount?: boolean;
  refineText?: string;
  filterHeader?: StyleProp<ViewStyle>;
  filterTitleStyle?: StyleProp<TextStyle>;
  secondLevelTitle?: string;
  secondLevelHeaderStyle?: StyleProp<ViewStyle>;
  secondLevelTitleStyle?: StyleProp<TextStyle>;
  secondLevelShowApply?: boolean;
  secondLevelShowClose?: boolean;
  optionsFooterStyles?: StyleProp<ViewStyle>;
}

const S = StyleSheet.create({
  applyButton: {
    flex: 1,
  },
  arrow: {
    borderBottomWidth: 1,
    borderColor: '#555',
    borderLeftWidth: 1,
    height: 14,
    width: 14,
  },
  arrowBack: {
    transform: [{ rotate: '45deg' }],
  },
  arrowContainer: {
    left: 15,
    position: 'absolute',
  },
  arrowNext: {
    transform: [{ rotate: '-135deg' }],
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },
  closeButtonImage: {
    height: 16,
    width: 16,
  },
  container: {
    flex: 1,
  },
  emptyCell: {
    height: 100,
  },
  filterHeader: {
    alignItems: 'center',
    borderBottomColor: '#aaa',
    borderBottomWidth: 1,
    height: 50,
    justifyContent: 'center',
  },
  filterTitle: {
    fontSize: 20,
  },
  firstLevelItem: {},
  firstLevelItemContainer: {
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  floatApplyButton: {
    alignItems: 'center',
    backgroundColor: '#333132',
    bottom: 15,
    justifyContent: 'center',
    left: 20,
    paddingVertical: 17,
    position: 'absolute',
    right: 20,
  },
  floatApplyButtonText: {
    color: 'white',
  },
  floatResetButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#565555',
    borderWidth: 1,
    bottom: 80,
    justifyContent: 'center',
    left: 20,
    paddingVertical: 16,
    position: 'absolute',
    right: 20,
  },
  floatResetButtonText: {
    color: '#333132',
  },
  resetButton: {
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    left: 15,
    position: 'absolute',
    top: 0,
  },
  rightButton: {
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    position: 'absolute',
    right: 15,
  },
  secondLevelHeader: {
    alignItems: 'center',
    borderBottomColor: '#aaa',
    borderBottomWidth: 1,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  secondLevelTitle: {
    fontWeight: 'bold',
  },
  selectedValueStyle: {
    color: '#999',
    fontSize: 13,
    marginTop: 3,
    maxWidth: 300,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  titleSelected: {
    fontWeight: '800',
  },
  valueButton: {
    height: 40,
  },
});

export interface FilterListDrilldownState {
  selectedItems: Record<string, string[]>;
  secondLevelItem?: FilterItem;
}

export class FilterListDrilldown extends PureComponent<
  FilterListDrilldownProps,
  FilterListDrilldownState
> {
  constructor(props: FilterListDrilldownProps) {
    super(props);
    this.state = {
      selectedItems: props.selectedItems || {},
      secondLevelItem: undefined,
    };
  }

  private readonly handleSelect = (id: string, value: string) => () => {
    const { selectedItems } = this.state;
    const singleFilterIds = this.props.singleFilterIds || defaultSingleFilterIds;

    let nextSelectedItems = null;

    const selectedItem = selectedItems[id];
    // if already selected, and it's not in the list of single filter
    if (selectedItem && !singleFilterIds.includes(id)) {
      const findIndex = selectedItem.indexOf(value);
      if (findIndex > -1) {
        selectedItem.splice(findIndex, 1);
      } else {
        selectedItem.push(value);
      }
      nextSelectedItems = {
        ...selectedItems,
      };
    } else {
      nextSelectedItems = {
        ...selectedItems,
        [id]: [value],
      };
    }

    this.setState({ selectedItems: nextSelectedItems });

    if (this.props.applyOnSelect) {
      this.props.onApply(nextSelectedItems);
    }
  };

  private readonly renderFilterItemValue =
    (filterItem: FilterItem, skipCustomRender?: boolean) =>
    ({ index, item }: Omit<ListRenderItemInfo<FilterItemValue>, 'separators'>): JSX.Element => {
      const selectedItem = this.state.selectedItems[filterItem.id];
      const selected = (selectedItem && selectedItem.includes(item.value)) ?? false;

      if (this.props.renderFilterItemValue && !skipCustomRender) {
        return this.props.renderFilterItemValue(
          filterItem,
          index || 0,
          item,
          this.handleSelect(filterItem.id, item.value),
          selected,
          this.renderFilterItemValue
        );
      }

      return (
        <SelectableRow
          key={index}
          onPress={this.handleSelect(filterItem.id, item.value)}
          selected={selected}
          title={item.title}
          {...this.props.selectableRowProps}
        />
      );
    };

  private readonly renderFilterItem = (
    { index, item }: Omit<ListRenderItemInfo<FilterItem>, 'separators'>,
    skipCustomRender = false
  ): JSX.Element => {
    const selectedValues = this.state.selectedItems[item.id] || [];
    const selectedValueTitles = (item.values || [])
      .filter((v: FilterItemValue) => selectedValues.includes(v.value))
      .map((v: FilterItemValue) => v.title);

    if (this.props.renderFilterItem && !skipCustomRender) {
      return this.props.renderFilterItem(
        item,
        index || 0,
        selectedValues,
        this.drilldown(item),
        this.renderFilterItem // this can be used to render the original item
      );
    }

    return (
      <TouchableOpacity
        accessibilityHint={FSI18n.string(componentTranslationKeys.hintToggle)}
        accessibilityLabel={item.title}
        accessibilityRole="button"
        onPress={this.drilldown(item)}
        style={[S.firstLevelItemContainer, this.props.itemStyle]}
      >
        <View style={S.firstLevelItem}>
          <Text
            style={[
              S.title,
              selectedValueTitles.length > 0 ? S.titleSelected : false,
              this.props.itemTextStyle,
              !(this.props.ignoreActiveStyleIds || []).includes(item.id) &&
              selectedValueTitles.length > 0
                ? this.props.itemTextSelectedStyle
                : false,
            ]}
          >
            {item.title}
            {selectedValueTitles.length > 0 && this.props.showSelectedCount !== false
              ? ` (${selectedValueTitles.length})`
              : ''}
          </Text>
          {selectedValueTitles.length > 0 || this.props.showUnselected !== false ? (
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={[
                S.selectedValueStyle,
                !(this.props.ignoreActiveStyleIds || []).includes(item.id) &&
                  this.props.selectedValueStyle,
              ]}
            >
              {selectedValueTitles.join(', ') || FSI18n.string(componentTranslationKeys.all)}
            </Text>
          ) : null}
        </View>
        <View style={[S.arrow, S.arrowNext]} />
      </TouchableOpacity>
    );
  };

  private readonly handleApply = () => {
    this.props.onApply(this.state.selectedItems, { isButtonPress: true });
  };

  private readonly handleReset = () => {
    this.setState({ selectedItems: {} });
    this.props.onReset({ isButtonPress: true });
  };

  private readonly handleClose = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  private readonly drilldown = (item: FilterItem) => () => {
    this.setState({
      secondLevelItem: item,
    });
  };

  private readonly backToFirstLevel = () => {
    this.setState({
      secondLevelItem: undefined,
    });
  };

  private readonly getKey = (item: unknown, index: number) => index.toString();

  private readonly renderEmptyCell = () => (
    <View style={[S.emptyCell, this.props.optionsFooterStyles]} />
  );

  private readonly renderSecondLevel = (
    item: FilterItem,
    skipCustomRender?: boolean
  ): JSX.Element => {
    if (this.props.renderSecondLevel && !skipCustomRender) {
      return this.props.renderSecondLevel(item, this.backToFirstLevel, this.renderSecondLevel);
    }

    return (
      <View style={S.applyButton}>
        <TouchableOpacity
          accessibilityHint={FSI18n.string(componentTranslationKeys.hintBack)}
          accessibilityLabel={item.title}
          accessibilityRole="button"
          onPress={this.backToFirstLevel}
          style={[S.secondLevelHeader, this.props.secondLevelHeaderStyle]}
        >
          <View style={S.arrowContainer}>
            <View style={[S.arrow, S.arrowBack]} />
          </View>
          <Text style={[S.secondLevelTitle, this.props.secondLevelTitleStyle]}>
            {this.props.secondLevelTitle || item.title}
          </Text>
          {this.props.onClose && this.props.secondLevelShowClose ? (
            <TouchableOpacity
              accessibilityLabel={FSI18n.string(componentTranslationKeys.done)}
              accessibilityRole="button"
              onPress={this.handleClose}
              style={[S.rightButton, this.props.closeButtonStyle]}
            >
              <Image
                source={this.props.closeIcon || closeIcon}
                style={[S.closeButtonImage, this.props.closeButtonImageStyle]}
              />
            </TouchableOpacity>
          ) : null}
        </TouchableOpacity>
        <FlatList
          ListFooterComponent={this.props.secondLevelShowApply ? this.renderEmptyCell : undefined}
          data={item.values || []}
          extraData={this.state}
          keyExtractor={this.getKey}
          renderItem={this.renderFilterItemValue(item)}
        />
        {this.props.secondLevelShowApply ? (
          <TouchableOpacity
            accessibilityLabel={FSI18n.string(componentTranslationKeys.apply)}
            accessibilityRole="button"
            onPress={this.handleApply}
            style={[S.floatApplyButton, this.props.applyButtonStyle]}
          >
            <Text style={[S.floatApplyButtonText, this.props.applyButtonTextStyle]}>
              {this.props.applyText || FSI18n.string(componentTranslationKeys.apply)}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  private readonly renderDrilldownHeader = () => (
    <View style={[S.filterHeader, this.props.filterHeader]}>
      {!this.props.floatingReset && Object.keys(this.state.selectedItems).length > 0 ? (
        <TouchableOpacity
          accessibilityLabel={FSI18n.string(componentTranslationKeys.clearAll)}
          accessibilityRole="button"
          onPress={this.handleReset}
          style={[S.resetButton, this.props.resetButtonStyle]}
        >
          <Text style={this.props.resetButtonTextStyle}>
            {this.props.resetText || FSI18n.string(componentTranslationKeys.clearAll)}
          </Text>
        </TouchableOpacity>
      ) : null}
      {this.props.onClose ? (
        <TouchableOpacity
          accessibilityLabel={FSI18n.string(componentTranslationKeys.done)}
          accessibilityRole="button"
          onPress={this.handleClose}
          style={[S.rightButton, this.props.closeButtonStyle]}
        >
          <Image
            source={this.props.closeIcon || closeIcon}
            style={[S.closeButtonImage, this.props.closeButtonImageStyle]}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          accessibilityLabel={FSI18n.string(componentTranslationKeys.done)}
          accessibilityRole="button"
          onPress={this.handleApply}
          style={[S.rightButton, this.props.applyButtonStyle]}
        >
          <Text style={this.props.applyButtonTextStyle}>
            {this.props.applyText || FSI18n.string(componentTranslationKeys.done)}
          </Text>
        </TouchableOpacity>
      )}
      <Text style={[S.filterTitle, this.props.filterTitleStyle]}>
        {this.props.refineText ||
          FSI18n.string(translationKeys.flagship.sort.actions.refine.actionBtn)}
      </Text>
    </View>
  );

  public componentDidUpdate(prevProps: FilterListDrilldownProps): void {
    const stateChanges: Partial<FilterListDrilldownState> = {};

    if (this.props.items !== prevProps.items && this.state.secondLevelItem) {
      stateChanges.secondLevelItem = this.props.items.find(
        (item) => item.id === this.state.secondLevelItem?.id
      );
    }

    if (this.props.selectedItems !== prevProps.selectedItems) {
      stateChanges.selectedItems = this.props.selectedItems;
    }

    if (Object.keys(stateChanges).length > 0) {
      this.setState(stateChanges as FilterListDrilldownState);
    }
  }

  public render(): React.ReactNode {
    return (
      <View style={[S.container, this.props.style]}>
        <View
          style={{
            flex: 1,
            display: this.state.secondLevelItem ? 'none' : 'flex',
          }}
        >
          {this.renderDrilldownHeader()}
          <FlatList
            ListFooterComponent={this.props.onClose ? this.renderEmptyCell : undefined}
            data={this.props.items}
            extraData={this.state.selectedItems}
            renderItem={this.renderFilterItem}
          />
          {this.props.onClose ? (
            <TouchableOpacity
              accessibilityLabel={FSI18n.string(componentTranslationKeys.apply)}
              accessibilityRole="button"
              onPress={this.handleApply}
              style={[S.floatApplyButton, this.props.applyButtonStyle]}
            >
              <Text style={[S.floatApplyButtonText, this.props.applyButtonTextStyle]}>
                {this.props.applyText || FSI18n.string(componentTranslationKeys.apply)}
              </Text>
            </TouchableOpacity>
          ) : null}
          {this.props.floatingReset && Object.keys(this.state.selectedItems).length > 0 ? (
            <TouchableOpacity
              accessibilityLabel={FSI18n.string(componentTranslationKeys.clearAll)}
              accessibilityRole="button"
              onPress={this.handleReset}
              style={[
                S.floatResetButton,
                this.props.onClose
                  ? undefined
                  : {
                      bottom: 15,
                    },
                this.props.resetButtonStyle,
              ]}
            >
              <Text style={[S.floatResetButtonText, this.props.resetButtonTextStyle]}>
                {this.props.resetText || FSI18n.string(componentTranslationKeys.clearAll)}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {this.state.secondLevelItem && this.renderSecondLevel(this.state.secondLevelItem)}
      </View>
    );
  }
}

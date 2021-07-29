import React, { PureComponent } from 'react';
import {
  FlatList,
  Image,
  ImageSourcePropType,
  ImageStyle,
  ListRenderItemInfo,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { SelectableRow, SelectableRowProps } from '../SelectableRow';
import { FilterItem } from './FilterItem';
import { FilterItemValue } from './FilterItemValue';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
const componentTranslationKeys = translationKeys.flagship.filterListDefaults;

const defaultSingleFilterIds = [`cgid`];

const closeIcon = require('../../../assets/images/clear.png');

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
    renderSecondLevel: (
      item: FilterItem,
      skipCustomRender?: boolean
    ) => JSX.Element
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
  title: {
    fontWeight: 'bold',
    fontSize: 15
  },
  titleSelected: {
    fontWeight: '800'
  },
  valueButton: {
    height: 40
  },
  container: {
    flex: 1
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginRight: 10
  },
  firstLevelItem: {},
  firstLevelItemContainer: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  selectedValueStyle: {
    color: '#999',
    fontSize: 13,
    marginTop: 3,
    maxWidth: 300
  },
  arrow: {
    width: 14,
    height: 14,
    borderColor: '#555',
    borderBottomWidth: 1,
    borderLeftWidth: 1
  },
  arrowBack: {
    transform: [{ rotate: '45deg' }]
  },
  arrowNext: {
    transform: [{ rotate: '-135deg' }]
  },
  arrowContainer: {
    position: 'absolute',
    left: 15
  },
  secondLevelHeader: {
    height: 50,
    paddingHorizontal: 10,
    borderBottomColor: '#aaa',
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  secondLevelTitle: {
    fontWeight: 'bold'
  },
  resetButton: {
    position: 'absolute',
    left: 15,
    top: 0,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  floatApplyButton: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 15,
    paddingVertical: 17,
    backgroundColor: '#333132',
    justifyContent: 'center',
    alignItems: 'center'
  },
  floatApplyButtonText: {
    color: 'white'
  },
  floatResetButton: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 80,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#565555',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  floatResetButtonText: {
    color: '#333132'
  },
  rightButton: {
    position: 'absolute',
    right: 15,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  filterHeader: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#aaa',
    borderBottomWidth: 1
  },
  filterTitle: {
    fontSize: 20
  },
  applyButton: {
    flex: 1
  },
  emptyCell: {
    height: 100
  },
  closeButtonImage: {
    height: 16,
    width: 16
  }
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
      secondLevelItem: undefined
    };
  }

  componentDidUpdate(
    prevProps: FilterListDrilldownProps
  ): void {
    const stateChanges: Partial<FilterListDrilldownState> = {};

    if (this.props.items !== prevProps.items && this.state.secondLevelItem) {
      stateChanges.secondLevelItem = this.props.items.find(item => (
        item.id === this.state.secondLevelItem?.id
      ));
    }

    if (this.props.selectedItems !== prevProps.selectedItems) {
      stateChanges.selectedItems = this.props.selectedItems;
    }

    if (Object.keys(stateChanges).length) {
      this.setState(stateChanges as FilterListDrilldownState);
    }
  }

  handleSelect = (id: string, value: string) => () => {
    const { selectedItems } = this.state;
    const singleFilterIds =
      this.props.singleFilterIds || defaultSingleFilterIds;

    let nextSelectedItems = null;

    // if already selected, and it's not in the list of single filter
    if (selectedItems[id] && singleFilterIds.indexOf(id) === -1) {
      const findIndex = selectedItems[id].indexOf(value);
      if (findIndex > -1) {
        selectedItems[id].splice(findIndex, 1);
      } else {
        selectedItems[id].push(value);
      }
      nextSelectedItems = {
        ...selectedItems
      };
    } else {
      nextSelectedItems = {
        ...selectedItems,
        [id]: [value]
      };
    }

    this.setState({ selectedItems: nextSelectedItems });

    if (this.props.applyOnSelect) {
      this.props.onApply(nextSelectedItems);
    }
  }

  renderFilterItemValue = (filterItem: FilterItem, skipCustomRender?: boolean) => ({
    item,
    index
  }: Omit<ListRenderItemInfo<FilterItemValue>, 'separators'>): JSX.Element => {
    const selected =
      this.state.selectedItems[filterItem.id] &&
      this.state.selectedItems[filterItem.id].indexOf(item.value) > -1;

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
        title={item.title}
        selected={selected}
        onPress={this.handleSelect(filterItem.id, item.value)}
        {...this.props.selectableRowProps}
      />
    );
  }

  // tslint:disable cyclomatic-complexity
  renderFilterItem = (
    { item, index }: Omit<ListRenderItemInfo<FilterItem>, 'separators'>,
    skipCustomRender: boolean = false
  ): JSX.Element => {
    const selectedValues = this.state.selectedItems[item.id] || [];
    const selectedValueTitles = (item.values || [])
      .filter((v: FilterItemValue) => selectedValues.indexOf(v.value) > -1)
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
        style={[S.firstLevelItemContainer, this.props.itemStyle]}
        onPress={this.drilldown(item)}
        accessibilityRole={'button'}
        accessibilityHint={FSI18n.string(componentTranslationKeys.hintToggle)}
        accessibilityLabel={item.title}
      >
        <View style={S.firstLevelItem}>
          <Text
            style={[
              S.title,
              selectedValueTitles.length ? S.titleSelected : false,
              this.props.itemTextStyle,
              (this.props.ignoreActiveStyleIds || []).indexOf(item.id) === -1 &&
                selectedValueTitles.length ? this.props.itemTextSelectedStyle : false
            ]}
          >
            {item.title}
            {(selectedValueTitles.length && this.props.showSelectedCount !== false)
              ? ` (${selectedValueTitles.length})`
              : ''}
          </Text>
          {(selectedValueTitles.length || this.props.showUnselected !== false) ? (
            <Text
              style={[
                S.selectedValueStyle,
                (this.props.ignoreActiveStyleIds || []).indexOf(item.id) === -1 &&
                this.props.selectedValueStyle
              ]}
              numberOfLines={1}
              ellipsizeMode='tail'
            >
              {selectedValueTitles.join(', ') || FSI18n.string(componentTranslationKeys.all)}
            </Text>
          ) : null}
        </View>
        <View style={[S.arrow, S.arrowNext]} />
      </TouchableOpacity>
    );
  }

  handleApply = () => {
    this.props.onApply(this.state.selectedItems, { isButtonPress: true });
  }

  handleReset = () => {
    this.setState({ selectedItems: {} });
    this.props.onReset({ isButtonPress: true });
  }

  handleClose = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  drilldown = (item: FilterItem) => () => {
    this.setState({
      secondLevelItem: item
    });
  }

  backToFirstLevel = () => {
    this.setState({
      secondLevelItem: undefined
    });
  }

  getKey = (item: any, index: number) => {
    return index.toString();
  }

  renderEmptyCell = () => {
    return (
      <View style={[S.emptyCell, this.props.optionsFooterStyles]}/>
    );
  }

  renderSecondLevel = (item: FilterItem, skipCustomRender?: boolean): JSX.Element => {
    if (this.props.renderSecondLevel && !skipCustomRender) {
      return this.props.renderSecondLevel(
        item,
        this.backToFirstLevel,
        this.renderSecondLevel
      );
    }

    return (
      <View style={S.applyButton}>
        <TouchableOpacity
          style={[S.secondLevelHeader, this.props.secondLevelHeaderStyle]}
          onPress={this.backToFirstLevel}
          accessibilityRole={'button'}
          accessibilityHint={FSI18n.string(componentTranslationKeys.hintBack)}
          accessibilityLabel={item.title}
        >
          <View style={S.arrowContainer}>
            <View style={[S.arrow, S.arrowBack]} />
          </View>
          <Text
            style={[S.secondLevelTitle, this.props.secondLevelTitleStyle]}
          >
            {this.props.secondLevelTitle || item.title}
          </Text>
          {this.props.onClose && this.props.secondLevelShowClose ? (
            <TouchableOpacity
              style={[S.rightButton, this.props.closeButtonStyle]}
              onPress={this.handleClose}
              accessibilityRole={'button'}
              accessibilityLabel={FSI18n.string(componentTranslationKeys.done)}
            >
              <Image
                source={this.props.closeIcon || closeIcon}
                style={[S.closeButtonImage, this.props.closeButtonImageStyle]}
              />
            </TouchableOpacity>
          ) : null}
        </TouchableOpacity>
        <FlatList
          keyExtractor={this.getKey}
          data={item.values || []}
          renderItem={this.renderFilterItemValue(item)}
          extraData={this.state}
          ListFooterComponent={this.props.secondLevelShowApply ? this.renderEmptyCell : undefined}
        />
        {this.props.secondLevelShowApply ? (
          <TouchableOpacity
            style={[S.floatApplyButton, this.props.applyButtonStyle]}
            onPress={this.handleApply}
            accessibilityRole={'button'}
            accessibilityLabel={FSI18n.string(componentTranslationKeys.apply)}
          >
            <Text style={[S.floatApplyButtonText, this.props.applyButtonTextStyle]}>
              {this.props.applyText || FSI18n.string(componentTranslationKeys.apply)}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  renderDrilldownHeader = () => {
    return (
      <View style={[S.filterHeader, this.props.filterHeader]}>
        {!this.props.floatingReset && Object.keys(this.state.selectedItems).length ? (
          <TouchableOpacity
            style={[S.resetButton, this.props.resetButtonStyle]}
            onPress={this.handleReset}
            accessibilityRole={'button'}
            accessibilityLabel={FSI18n.string(componentTranslationKeys.clearAll)}
          >
            <Text style={this.props.resetButtonTextStyle}>
              {this.props.resetText || FSI18n.string(componentTranslationKeys.clearAll)}
            </Text>
          </TouchableOpacity>
        ) : null}
        {this.props.onClose ? (
          <TouchableOpacity
            style={[S.rightButton, this.props.closeButtonStyle]}
            onPress={this.handleClose}
            accessibilityRole={'button'}
            accessibilityLabel={FSI18n.string(componentTranslationKeys.done)}
          >
            <Image
              source={this.props.closeIcon || closeIcon}
              style={[S.closeButtonImage, this.props.closeButtonImageStyle]}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[S.rightButton, this.props.applyButtonStyle]}
            onPress={this.handleApply}
            accessibilityRole={'button'}
            accessibilityLabel={FSI18n.string(componentTranslationKeys.done)}
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
  }

  render(): React.ReactNode {
    return (
      <View style={[S.container, this.props.style]}>
        <View
          style={{
            flex: 1,
            display: this.state.secondLevelItem ? 'none' : 'flex'
          }}
        >
          {this.renderDrilldownHeader()}
          <FlatList
            data={this.props.items}
            renderItem={this.renderFilterItem}
            extraData={this.state.selectedItems}
            ListFooterComponent={this.props.onClose ? this.renderEmptyCell : undefined}
          />
          {this.props.onClose ? (
            <TouchableOpacity
              style={[S.floatApplyButton, this.props.applyButtonStyle]}
              onPress={this.handleApply}
              accessibilityRole={'button'}
              accessibilityLabel={FSI18n.string(componentTranslationKeys.apply)}
            >
              <Text style={[S.floatApplyButtonText, this.props.applyButtonTextStyle]}>
                {this.props.applyText || FSI18n.string(componentTranslationKeys.apply)}
              </Text>
            </TouchableOpacity>
          ) : null}
          {this.props.floatingReset && Object.keys(this.state.selectedItems).length ? (
            <TouchableOpacity
              style={[S.floatResetButton, this.props.onClose ? undefined : {
                bottom: 15
              }, this.props.resetButtonStyle]}
              onPress={this.handleReset}
              accessibilityRole={'button'}
              accessibilityLabel={FSI18n.string(componentTranslationKeys.clearAll)}
            >
              <Text style={[S.floatResetButtonText, this.props.resetButtonTextStyle]}>
                {this.props.resetText || FSI18n.string(componentTranslationKeys.clearAll)}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {this.state.secondLevelItem &&
          this.renderSecondLevel(this.state.secondLevelItem)}
      </View>
    );
  }
}

import type { RefObject } from 'react';
import React, { Component } from 'react';

import type { ListRenderItemInfo, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { FlatList, Platform, Text, TouchableHighlight } from 'react-native';

import { style as styles } from '../../styles/Selector';

import type { SelectorItem } from './Selector';

const ITEM_HEIGHT = 50;

export interface SelectorListProps {
  items: SelectorItem[];
  onSelectChange: Function;
  selectedValue?: string;
  itemHeight?: number;

  // styles
  itemStyle?: StyleProp<ViewStyle>;
  itemTextStyle?: StyleProp<TextStyle>;
  disabledItemStyle?: StyleProp<ViewStyle>;
  selectedItemStyle?: StyleProp<ViewStyle>;
  selectedItemTextStyle?: StyleProp<TextStyle>;
}

export class SelectorList extends Component<SelectorListProps> {
  constructor(props: SelectorListProps) {
    super(props);

    this.listView = React.createRef<FlatList<SelectorItem>>();
  }

  private readonly listView: RefObject<FlatList<SelectorItem>>;

  private readonly scrollToSelected = (value?: string) => {
    value = value || this.props.selectedValue;
    let index = this.props.items.findIndex((i) => i.value === value);
    if (index >= this.props.items.length - 3) {
      index = this.props.items.length - 3;
    }

    if (this.listView.current && index > -1) {
      this.listView.current.scrollToIndex({ index, animated: true });
    }
  };

  private readonly keyExtractor = (item: SelectorItem): string => item.value;

  private readonly getItemLayout = (data: SelectorItem[] | null | undefined, index: number) => ({
    length: this.props.itemHeight || ITEM_HEIGHT,
    offset: (this.props.itemHeight || ITEM_HEIGHT) * index,
    index,
  });

  private readonly renderItem = ({ index, item }: ListRenderItemInfo<SelectorItem>) => (
    <TouchableHighlight
      disabled={item.disabled}
      onPress={this.props.onSelectChange(item.value)}
      style={[
        { height: this.props.itemHeight || ITEM_HEIGHT },
        styles.item,
        this.props.itemStyle,
        item.selected && styles.selectedItem,
        item.selected && this.props.selectedItemStyle,
        item.disabled && styles.disabledItem,
        item.disabled && this.props.disabledItemStyle,
      ]}
      underlayColor="#D0D0D0"
    >
      <Text
        style={[
          styles.itemText,
          this.props.itemTextStyle,
          item.selected && styles.selectedItemText,
          item.selected && this.props.selectedItemTextStyle,
        ]}
      >
        {item.label}
      </Text>
    </TouchableHighlight>
  );

  // this is called on native modal
  public componentDidMount(): void {
    if (Platform.OS === 'web') {
      return;
    }
    requestAnimationFrame(() => {
      this.scrollToSelected();
    });
  }

  // this is called on web modal
  public componentDidUpdate(): void {
    if (Platform.OS !== 'web') {
      return;
    }
    requestAnimationFrame(() => {
      this.scrollToSelected();
    });
  }

  public render(): JSX.Element {
    const { items } = this.props;

    const itemsWithSelected = items.reduce<SelectorItem[]>((result, curr) => {
      if (curr.value === this.props.selectedValue) {
        return [
          ...result,
          {
            ...curr,
            selected: true,
          },
        ];
      }

      return [...result, curr];
    }, []);

    return (
      <FlatList
        data={itemsWithSelected}
        getItemLayout={this.getItemLayout}
        keyExtractor={this.keyExtractor}
        ref={this.listView}
        renderItem={this.renderItem}
        style={styles.itemsContainer}
      />
    );
  }
}

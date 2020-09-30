import React, { Component, RefObject } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleProp,
  Text,
  TextStyle,
  TouchableHighlight,
  ViewStyle
} from 'react-native';
import styles from '../../styles/Selector';
import { SelectorItem } from './Selector';

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
  private listView: RefObject<FlatList<SelectorItem>>;

  constructor(props: SelectorListProps) {
    super(props);

    this.listView = React.createRef<FlatList<SelectorItem>>();
  }

  scrollToSelected = (value?: string) => {
    value = value || this.props.selectedValue;
    let index = this.props.items.findIndex(i => i.value === value);
    if (index >= this.props.items.length - 3) {
      index = this.props.items.length - 3;
    }

    if (this.listView.current && index > -1) {
      this.listView.current.scrollToIndex({ index, animated: true });
    }
  }

  // this is called on native modal
  componentDidMount(): void {
    if (Platform.OS === 'web') {
      return;
    }
    requestAnimationFrame(() => {
      this.scrollToSelected();
    });
  }

  // this is called on web modal
  componentDidUpdate(): void {
    if (Platform.OS !== 'web') {
      return;
    }
    requestAnimationFrame(() => {
      this.scrollToSelected();
    });
  }

  render(): JSX.Element {
    const { items } = this.props;

    const itemsWithSelected = items.reduce<SelectorItem[]>((result, curr) => {
      if (curr.value === this.props.selectedValue) {
        return [...result, {
          ...curr,
          selected: true
        }];
      }

      return [...result, curr];
    }, []);

    return (
      <FlatList
        ref={this.listView}
        style={styles.itemsContainer}
        data={itemsWithSelected}
        renderItem={this.renderItem}
        getItemLayout={this.getItemLayout}
        keyExtractor={this.keyExtractor}
      />
    );
  }

  private keyExtractor = (item: SelectorItem): string => {
    return item.value;
  }

  private getItemLayout = (data: SelectorItem[] | null | undefined, index: number) => ({
    length: this.props.itemHeight || ITEM_HEIGHT,
    offset: (this.props.itemHeight || ITEM_HEIGHT) * index,
    index
  })

  private renderItem = ({ item, index }: ListRenderItemInfo<SelectorItem>) => {
    return (
      <TouchableHighlight
        underlayColor='#D0D0D0'
        disabled={item.disabled}
        style={[
          { height: this.props.itemHeight || ITEM_HEIGHT },
          styles.item,
          this.props.itemStyle,
          item.selected && styles.selectedItem,
          item.selected && this.props.selectedItemStyle,
          item.disabled && styles.disabledItem,
          item.disabled && this.props.disabledItemStyle
        ]}
        onPress={this.props.onSelectChange(item.value)}
      >
        <Text
          style={[
            styles.itemText,
            this.props.itemTextStyle,
            item.selected && styles.selectedItemText,
            item.selected && this.props.selectedItemTextStyle
          ]}
        >
          {item.label}
        </Text>
      </TouchableHighlight>
    );
  }
}

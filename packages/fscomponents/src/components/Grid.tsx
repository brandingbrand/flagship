import { chunk } from 'lodash-es';
import React, { Component, ReactElement, RefObject } from 'react';
import {
  FlatListProps,
  ListRenderItemInfo,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native';

const DEFAULT_COLUMNS = 2;

const gridStyle = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'nowrap'
  },
  item: {
    flexDirection: 'row',
    flexWrap: 'nowrap'
  },
  itemRow: {
    flex: 1,
    justifyContent: 'space-between'
  },
  rowSeparator: {
    width: '100%',
    height: 1,
    backgroundColor: '#8E8E8E'
  },
  columnSeparator: {
    height: '100%',
    width: 1,
    backgroundColor: '#8E8E8E'
  }
});

export interface GridProps<ItemT>
  extends Pick<FlatListProps<ItemT>, 'style' | 'data' | 'renderItem'> {
  /**
   * The number of columns to display in the grid. Defaults to 2.
   */
  columns?: number;

  /**
   * An optional function to render a header component displayed at the top of the grid.
   */
  renderHeader?: () => JSX.Element;

  /**
   * An optional function to render a footer component, displayed at the bottom of the grid.
   */
  renderFooter?: () => JSX.Element;

  /**
   * Props to pass to the underlying FlatList.
   */
  listViewProps?: Partial<FlatListProps<ItemT[]>>;

  /**
   * Whether or not to show a separator between columns in the grid.
   */
  showColumnSeparators?: boolean;

  /**
   * Style to apply to the separator between columns in the grid.
   */
  columnSeparatorStyle?: StyleProp<ViewStyle>;

  /**
   * Whether or not to show a separator between rows in the grid.
   */
  showRowSeparators?: boolean;

  /**
   * Style to apply to the separator between rows in the grid.
   */
  rowSeparatorStyle?: StyleProp<ViewStyle>;
}

export interface GridState<ItemT> extends Pick<FlatListProps<ItemT[]>, 'data'> {
}

export class Grid<ItemT> extends Component<GridProps<ItemT>, GridState<ItemT>> {
  static getDerivedStateFromProps<ItemT>(
    nextProps: GridProps<ItemT>
  ): Partial<GridState<ItemT>> | null {
    return {
      data: chunk(nextProps.data, nextProps.columns || DEFAULT_COLUMNS)
    };
  }

  private listview: RefObject<View>;
  constructor(props: GridProps<ItemT>) {
    super(props);

    this.listview = React.createRef<View>();
    this.state = {
      data: chunk(props.data, props.columns)
    };
  }

  render(): React.ReactNode {
    const {
      style,
      renderHeader,
      renderFooter
    } = this.props;

    const separators = {
      highlight: () => { return; },
      unhighlight: () => { return; },
      updateProps: () => { return; }
    }

    return (
      <View
        style={[{ flex: 1 }, style]}
        ref={this.listview}
        {...this.props.listViewProps}
      >
        {renderHeader && renderHeader()}
        {this.state.data && this.state.data.map((item: any, index: any) => {
          return (
            <View key={this.keyExtractor(item, index)}>
              {this.renderRow({item, index, separators})}
            </View>
          );
        })}
        {renderFooter && renderFooter()}
      </View>
    );
  }

  private keyExtractor = (items: ItemT[], index: number): string => {
    const key = items.map((item: any) => item && (item.key || item.id)).filter(Boolean).join();

    return key || '' + index;
  }

  private renderRow = (info: ListRenderItemInfo<ItemT[]>): ReactElement | null => {
    const {
      columns = DEFAULT_COLUMNS,
      columnSeparatorStyle,
      renderItem,
      rowSeparatorStyle,
      showColumnSeparators,
      showRowSeparators
    } = this.props;

    const showRowSeparator = this.state.data && this.state.data.length > info.index + 1;


    const columnWidth = Math.floor(100 / columns * 100) / 100;

    return (
      <View style={gridStyle.row}>
        {info.item.map((item, index) => {
          const showColumnSeparator = (((index + 1) % columns) !== 0);

          return (
            <View style={[gridStyle.item, { width: columnWidth + '%' }]} key={index}>
              <View style={gridStyle.itemRow}>
                {renderItem({item, index, separators: info.separators})}
                {showRowSeparators && showRowSeparator && (
                  <View style={[gridStyle.rowSeparator, rowSeparatorStyle]} />
                )}
              </View>
              {showColumnSeparators && showColumnSeparator && (
                <View style={[gridStyle.columnSeparator, columnSeparatorStyle]} />
              )}
            </View>
          );
        })}
      </View>
    );
  }
}

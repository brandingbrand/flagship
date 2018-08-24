import { chunk } from 'lodash-es';
import React, { Component, ReactElement, RefObject } from 'react';
import {
  Animated,
  FlatList,
  FlatListProps,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';

const DEFAULT_COLUMNS = 2;
const DEFAULT_BACK_TOP_BUTTON_SHOW_AT_HEIGHT = 100;

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
  },
  scrollTopButtonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    zIndex: 200
  },
  scrollTopButton: {
    backgroundColor: '#eee',
    padding: 10
  }
});

export type GridScrollToTopFunc = () => void;

export interface GridProps<ItemT>
  extends Pick<FlatListProps<ItemT>, 'style' | 'data' | 'renderItem'> {
  /**
   * The number of columns to display in the grid. Defaults to 2.
   */
  columns?: number;

  /**
   * Whether or not a back to top button should appear after the user scrolls down. Defaults to
   * false.
   */
  showBackToTop?: boolean;

  /**
   * An optional function to render a header component displayed at the top of the grid.
   */
  renderHeader?: () => JSX.Element;

  /**
   * An optional function to render a footer component, displayed at the bottom of the grid.
   */
  renderFooter?: () => JSX.Element;

  /**
   * Styles to apply to the container around the back to top button
   */
  backToTopContainerStyle?: StyleProp<ViewStyle>;

  /**
   * Styles to apply to the back to top button. Does not apply if a custom back to top render
   * function is used.
   */
  backToTopButtonStyle?: StyleProp<ViewStyle>;

  /**
   * Styles to apply to the default back to top text. Does not apply if a custom back to top render
   * function is used.
   */
  backToTopTextStyle?: StyleProp<TextStyle>;

  /**
   * Copy to show inside the back to top button. Defaults to "Top". Does not apply if a custom back
   * to top render function is used.
   */
  backToTopText?: string;

  /**
   * The distance the user needs to scroll down before the back to top button appears. Defaults to
   * 100.
   */
  backToTopShowAtHeight?: number;

  /**
   * An optional custom render function to render a back to top button.
   */
  renderBackToTopButton?: (scrollToTop: GridScrollToTopFunc) => JSX.Element;

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
  /**
   * Whether or not the back to top button is currently visible.
   */
  backToTopVisible: boolean;
}

export class Grid<ItemT> extends Component<GridProps<ItemT>, GridState<ItemT>> {
  static getDerivedStateFromProps<ItemT>(
    nextProps: GridProps<ItemT>
  ): Partial<GridState<ItemT>> | null {
    return {
      data: chunk(nextProps.data, nextProps.columns || DEFAULT_COLUMNS)
    };
  }

  private listview: RefObject<FlatList<ItemT[]>>;
  private backTopOpacity: Animated.Value;

  // Separate items into rows
  constructor(props: GridProps<ItemT>) {
    super(props);

    this.listview = React.createRef<FlatList<ItemT[]>>();
    this.backTopOpacity = new Animated.Value(0);
    this.state = {
      backToTopVisible: false,
      data: chunk(props.data, props.columns)
    };
  }

  render(): React.ReactNode {
    const {
      style,
      renderHeader,
      renderFooter
    } = this.props;

    // Only register for scroll events if we're supposed to show back to top
    let onScroll;

    if (this.props.showBackToTop) {
      onScroll = this.handleScroll;
    }

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.state.data}
          keyExtractor={this.keyExtractor}
          ListFooterComponent={renderFooter}
          ListHeaderComponent={renderHeader}
          onScroll={onScroll}
          ref={this.listview}
          renderItem={this.renderRow}
          style={style}
          {...this.props.listViewProps}
        />
        {this.renderBackToTop()}
      </View>
    );
  }

  private handleScroll = (event?: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (event) {
      const scrollY = event.nativeEvent.contentOffset.y;
      const backToTopShowAtHeight =
        this.props.backToTopShowAtHeight !== undefined
          ? this.props.backToTopShowAtHeight
          : DEFAULT_BACK_TOP_BUTTON_SHOW_AT_HEIGHT;

      if (scrollY > backToTopShowAtHeight && !this.state.backToTopVisible) {
        this.setState({
          backToTopVisible: true
        });
        Animated.timing(this.backTopOpacity, {
          toValue: 1,
          useNativeDriver: true
        }).start();
      } else if (scrollY < backToTopShowAtHeight && this.state.backToTopVisible) {
        this.setState({
          backToTopVisible: false
        });
        Animated.timing(this.backTopOpacity, {
          toValue: 0,
          useNativeDriver: true
        }).start();
      }
    }
  }

  private keyExtractor = (items: ItemT[], index: number): string => {
    const key = items.map((item: any) => item && (item.key || item.id)).filter(Boolean).join();

    return key || '' + index;
  }

  private renderBackToTop = () => {
    const {
      showBackToTop,
      backToTopContainerStyle,
      backToTopButtonStyle,
      backToTopTextStyle,
      backToTopText,
      renderBackToTopButton
    } = this.props;
    const { backToTopVisible } = this.state;

    if (!showBackToTop || !backToTopVisible) {
      return null;
    }

    const scrollTopContainerStyle = [
      gridStyle.scrollTopButtonContainer,
      {
        opacity: this.backTopOpacity
      },
      backToTopContainerStyle
    ];

    return (
      <Animated.View style={scrollTopContainerStyle}>
        {renderBackToTopButton ? (
          renderBackToTopButton(this.handleBackToTop)
        ) : (
          <TouchableOpacity
            style={[gridStyle.scrollTopButton, backToTopButtonStyle]}
            onPress={this.handleBackToTop}
          >
            <Text style={backToTopTextStyle}>{backToTopText || 'Top'}</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  }

  private handleBackToTop = () => {
    if (this.listview.current) {
      this.listview.current.scrollToOffset({ offset: 0 });
    }
  }

  private renderRow = (info: ListRenderItemInfo<ItemT[]>): ReactElement<any> | null => {
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

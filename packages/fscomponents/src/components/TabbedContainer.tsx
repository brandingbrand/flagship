/**
 * Basic wrapper for tabbed content. The only required property is an array of Tab objects.
 * For each Tab object you need to provide "tab" which is a JSX element representing an
 * unselected tab, "activeTab" which is a JSX element representing a selected tab, and
 * a "renderContent" function which will return JSX to be displayed when the tab is active.
 */

import React, { Component } from 'react';

import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';

export interface Tab {
  tab: JSX.Element;
  activeTab: JSX.Element;
  renderContent: () => React.ReactNode;
}

export interface TabbedContainerProps {
  initialIndex?: number;
  style?: StyleProp<ViewStyle>;
  tabs: Tab[];
  tabContainerStyle?: StyleProp<ViewStyle>;
  tabTouchableStyle?: StyleProp<ViewStyle>;
}

export interface TabbedContainerState {
  selectedIndex: number;
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row'
  },
  tabTouchableOpacity: {
    flex: 1
  }
});

export class TabbedContainer extends Component<TabbedContainerProps, TabbedContainerState> {
  state: TabbedContainerState;

  constructor(props: TabbedContainerProps) {
    super(props);

    this.state = {
      selectedIndex: this.props.initialIndex || 0
    };
  }

  selectTab = (index: number) => () => {
    this.setState({
      selectedIndex: index
    });
  }

  renderTabs(): JSX.Element {
    return (
      <View style={[styles.tabContainer, this.props.tabContainerStyle]}>
        {this.props.tabs.map((tab, index) => {
          const tabToUse = this.state.selectedIndex === index ? tab.activeTab : tab.tab;

          return (
            <TouchableOpacity
              onPress={this.selectTab(index)}
              style={[styles.tabTouchableOpacity, this.props.tabTouchableStyle]}
              key={index}
            >
              {tabToUse}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  render(): JSX.Element {
    return (
      <View style={this.props.style}>
        {this.renderTabs()}
        {this.props.tabs[this.state.selectedIndex].renderContent()}
      </View>
    );
  }
}

/**
 * Basic wrapper for tabbed content. The only required property is an array of Tab objects.
 * For each Tab object you need to provide "tab" which is a JSX element representing an
 * unselected tab, "activeTab" which is a JSX element representing a selected tab, and
 * a "renderContent" function which will return JSX to be displayed when the tab is active.
 */

import React, { useState } from 'react';

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

export interface SerializableTabbedContainerProps {
  initialIndex?: number;
  style?: ViewStyle;
  tabContainerStyle?: ViewStyle;
  tabTouchableStyle?: ViewStyle;
}

export interface TabbedContainerProps extends Omit<
  SerializableTabbedContainerProps,
  'style' |
  'tabContainerStyle' |
  'tabTouchableStyle'
  > {
  style?: StyleProp<ViewStyle>;
  tabs: Tab[];
  tabContainerStyle?: StyleProp<ViewStyle>;
  tabTouchableStyle?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row'
  },
  tabTouchableOpacity: {
    flex: 1
  }
});

export const TabbedContainer: React.FunctionComponent<TabbedContainerProps> = props => {
  const [selectedIndex, setSelectedIndex] = useState<number>(props.initialIndex || 0);

  const selectTab = (index: number) => () => {
    setSelectedIndex(index);
  };

  const renderTabs = (): JSX.Element => {
    return (
      <View style={[styles.tabContainer, props.tabContainerStyle]}>
        {props.tabs.map((tab, index) => {
          const tabToUse = selectedIndex === index ? tab.activeTab : tab.tab;

          return (
            <TouchableOpacity
              onPress={selectTab(index)}
              style={[styles.tabTouchableOpacity, props.tabTouchableStyle]}
              key={index}
            >
              {tabToUse}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View style={props.style}>
        {renderTabs()}
        {props.tabs[selectedIndex].renderContent()}
    </View>
  );
};

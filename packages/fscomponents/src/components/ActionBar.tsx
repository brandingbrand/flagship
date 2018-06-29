/**
 * Component that renders an arbitrary number of children with a separator
 * of configurable width (props.separatorWidth) between each child.
 */

import React, { Component } from 'react';

import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native';

export interface ActionBarProps {
  style?: StyleProp<ViewStyle>;
  separatorWidth?: number;
}

const DEFAULT_SEPARATOR_WIDTH = 15;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  item: {
    flex: 1
  }
});

export class ActionBar extends Component<ActionBarProps> {
  render(): JSX.Element {
    const numChildren = React.Children.count(this.props.children);
    const separatorStyle = { width: this.props.separatorWidth || DEFAULT_SEPARATOR_WIDTH };

    return (
      <View style={[styles.container, this.props.style]}>
        { React.Children.map(this.props.children, (child: any, index) => {
          let returnElem: any;

          if (React.isValidElement(child)) {
            // If child is a React Element, add default style prop of flex:1
            child = child as React.ReactElement<any>;

            returnElem = React.cloneElement(child, {
              style: [
                styles.item,
                child.props.style
              ]
            });
          } else {
            returnElem = child;
          }

          return [
            returnElem,
            index !== numChildren - 1 && (
              <View style={separatorStyle} />
            )
          ];
        })}
      </View>
    );
  }
}

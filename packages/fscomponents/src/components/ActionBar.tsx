/**
 * Stateless functional component that renders an arbitrary number of children with a separator
 * of configurable width (props.separatorWidth) between each child.
 */

import React, { FunctionComponent, ReactNode } from 'react';

import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native';

export interface ActionBarProps {
  style?: StyleProp<ViewStyle>;
  separatorWidth?: number;
  children: ReactNode[];
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

export const ActionBar: FunctionComponent<ActionBarProps> = (props): JSX.Element => {
  const numChildren = React.Children.count(props.children);
  const separatorStyle = { width: props.separatorWidth || DEFAULT_SEPARATOR_WIDTH };

  return (
    <View style={[styles.container, props.style]}>
      { React.Children.map(props.children, (child: React.ReactNode, index) => {
        let returnElem: React.ReactNode;

        if (React.isValidElement(child)) {
          // If child is a React Element, add default style prop of flex:1
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
};

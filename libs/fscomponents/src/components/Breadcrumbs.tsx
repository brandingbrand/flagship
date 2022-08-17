import type { FunctionComponent } from 'react';
import React from 'react';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';

import { TouchableOpacityLink } from './TouchableOpacityLink';

export interface Breadcrumb {
  title: string;
  onPress?: () => void;
  href?: string;
}

export interface BreadcrumbsProps {
  /**
   * Style for the container of a single breadcrumb & separator
   */
  breadcrumbContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Collection of breadcrumb items
   */
  items: Breadcrumb[];
  /**
   * Separator string (default is ">")
   */
  separator?: string;
  /**
   * Style for the overarching component container
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style for the separator text
   */
  separatorStyle?: StyleProp<TextStyle>;
  /**
   * Whether to show separator after final item (default false)
   */
  showTrailingSeparator?: boolean;
  /**
   * Style for titles that have an onPress attached
   */
  titleClickableStyle?: StyleProp<TextStyle>;
  /**
   * Style for titles that do not have an onPress attached
   */
  titleDisabledStyle?: StyleProp<TextStyle>;
  /**
   * Style for all titles
   */
  titleStyle?: StyleProp<TextStyle>;
}

const BREADCRUMBS_SEPARATOR_DEFAULT = '>';

const BreadcrumbsStyles = StyleSheet.create({
  breadcrumbContainer: {
    flexDirection: 'row',
    paddingBottom: 3,
    paddingRight: 10,
    paddingTop: 3,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  separator: {
    paddingLeft: 10,
  },
});

export const Breadcrumbs: FunctionComponent<BreadcrumbsProps> = (props): JSX.Element => {
  const renderBreadcrumb = (item: Breadcrumb, index: number, isLast: boolean): JSX.Element => {
    let title: JSX.Element;

    title = item.onPress ? (
      <TouchableOpacityLink href={item.href} onPress={item.onPress}>
        <Text style={[props.titleStyle, props.titleClickableStyle]}>{item.title}</Text>
      </TouchableOpacityLink>
    ) : (
      <Text style={[props.titleStyle, props.titleDisabledStyle]}>{item.title}</Text>
    );

    return (
      <View
        key={index}
        style={[BreadcrumbsStyles.breadcrumbContainer, props.breadcrumbContainerStyle]}
      >
        {title}
        {props.showTrailingSeparator || !isLast ? (
          <Text style={[BreadcrumbsStyles.separator, props.separatorStyle]}>
            {props.separator ? props.separator : defaultProps.separator}
          </Text>
        ) : null}
      </View>
    );
  };

  const defaultProps: Partial<BreadcrumbsProps> = {
    separator: BREADCRUMBS_SEPARATOR_DEFAULT,
  };
  const numItems = props.items.length;

  return (
    <View style={[BreadcrumbsStyles.container, props.style]}>
      {props.items.map((item: Breadcrumb, index: number) =>
        renderBreadcrumb(item, index, index === numItems - 1)
      )}
    </View>
  );
};

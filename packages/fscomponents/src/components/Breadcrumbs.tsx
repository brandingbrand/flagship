import React, { FunctionComponent } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
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
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  breadcrumbContainer: {
    paddingTop: 3,
    paddingRight: 10,
    paddingBottom: 3,
    flexDirection: 'row'
  },
  separator: {
    paddingLeft: 10
  }
});

export const Breadcrumbs: FunctionComponent<BreadcrumbsProps> = (props): JSX.Element => {
  const defaultProps: Partial<BreadcrumbsProps> = {
    separator: BREADCRUMBS_SEPARATOR_DEFAULT
  };
  const numItems = props.items.length;

  return (
    <View style={[BreadcrumbsStyles.container, props.style]}>
      {props.items.map(
        (item: Breadcrumb, index: number) => renderBreadcrumb(item, index, (index === numItems - 1))
      )}
    </View>
  );


  function renderBreadcrumb(item: Breadcrumb, index: number, isLast: boolean): JSX.Element {
    let title: JSX.Element;

    if (item.onPress) {
      title = (
        <TouchableOpacityLink onPress={item.onPress} href={item.href}>
          <Text style={[props.titleStyle, props.titleClickableStyle]}>{item.title}</Text>
        </TouchableOpacityLink>
      );
    } else {
      title = (
        <Text style={[props.titleStyle, props.titleDisabledStyle]}>{item.title}</Text>
      );
    }

    return (
      <View
        key={index}
        style={[
          BreadcrumbsStyles.breadcrumbContainer,
          props.breadcrumbContainerStyle
        ]}
      >
        {title}
        {(props.showTrailingSeparator || !isLast) && (
          <Text style={[BreadcrumbsStyles.separator, props.separatorStyle]}>
            {props.separator ? props.separator : defaultProps.separator}
          </Text>
        )}
      </View>
    );
  }
};

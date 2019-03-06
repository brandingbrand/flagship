import React, { FunctionComponent } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import PSRow from './PSRow';
import { border, fontSize, palette } from '../styles/variables';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import { Loading, NavArrow } from '@brandingbrand/fscomponents';

const styles = StyleSheet.create({
  loading: {
    paddingVertical: 20
  },
  arrow: {
    transform: [{ rotate: '180deg' }],
    width: 15,
    height: 15
  },
  row: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: border.width,
    borderBottomColor: border.color,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50
  },
  title: {
    fontSize: fontSize.base,
    color: palette.onBackground
  }
});

export interface PSShopLandingCategoriesProps {
  style?: StyleProp<ViewStyle>;
  onItemPress: (item: CommerceTypes.Category) => void;
  categories: CommerceTypes.Category[];
}

const PSShopLandingCategories: FunctionComponent<PSShopLandingCategoriesProps> = props => {
  const handleItemPress = (category: CommerceTypes.Category) => () => {
    props.onItemPress(category);
  };

  const renderImage = (): JSX.Element => {
    return (
      <NavArrow color={palette.primary} />
    );
  };

  const renderContent = (): React.ReactNode => {
    if (!props.categories) {
      return <Loading style={styles.loading} />;
    }

    return props.categories.map((category, i) => (
      <PSRow
        key={i}
        title={category.title}
        onPress={handleItemPress(category)}
        showImage={true}
        renderImage={renderImage}
      />
    ));
  };


  return <View style={props.style}>{renderContent()}</View>;

};

export default PSShopLandingCategories;

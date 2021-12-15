import React, { isValidElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Decimal from 'decimal.js';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean, number, object } from '@storybook/addon-knobs';

import { Grid, GridRenderItem } from '../src/components/Grid';
import { ProductItem } from '../src/components/ProductItem';

const productItems = [...Array(10)].map((a, i) => ({
  id: i,
  title: `Product ${i + 1}`,
  image: 'https://placehold.it/100x100',
}));

const styles = StyleSheet.create({
  fill: {
    flexGrow: 1,
    height: 150,
  },
  gray: {
    backgroundColor: '#bdbdbd',
  },
  big: {
    textAlign: 'center',
    fontSize: 18,
  },
  spacing: {
    marginBottom: 10,
    marginHorizontal: 10,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const makePromo = (key: string, title: string) => (
  <View key={key} style={[styles.fill, styles.gray, styles.center, styles.spacing]}>
    <Text style={styles.big}>{title}</Text>
  </View>
);

const renderItem: GridRenderItem<typeof productItems[number] | React.ReactElement> = ({
  item,
  columns,
  totalColumns,
}) => {
  if (isValidElement(item)) {
    return item;
  }

  const tall = columns === totalColumns;

  return (
    <ProductItem
      id={`${item.id}`}
      handle={item.title}
      title={item.title}
      image={{ uri: item.image, width: 100 * columns }}
      imageStyle={[
        {
          width: 100 * columns,
          height: 100,
        },
        tall && { height: columns * 100 },
      ]}
      contentStyle={styles.center}
      style={[styles.center, tall && { height: columns * 180 }]}
      price={{
        value: new Decimal('5.95'),
        currencyCode: 'USD',
      }}
      onPress={action('MultiCarousel ProductItem onPress')}
    />
  );
};

const Promo1 = makePromo('promo-1', 'Promo');
const TargetedPromo = makePromo('promo-2', 'Targeted Promo');
const Promos = [...Array(10)].map((_, i) => makePromo(`promo-every-${i}`, `Promo ${i}`));

// TODO: Update MultiCarousel to support prop switching
storiesOf('Grid', module).add('basic usage', () => {
  const columns = number('numColumns', 3);
  const autoColumns = boolean('autoColumns', true);
  const minColumnWidth = number('minWidth', 120);
  const insertEveryFrequency = number('insertEveryFrequency', 3);
  const columnWidthTable = object('columnWidthTable', { 2: 'fill' as const });

  const insertRows = { 2: Promo1 };
  const insertAfter = { 4: TargetedPromo };
  const insertEveryValues = Promos;

  return (
    <Grid
      data={productItems}
      renderItem={renderItem}
      minColumnWidth={minColumnWidth}
      numColumns={autoColumns ? 'auto' : columns}
      columnWidthTable={columnWidthTable}
      insertRows={insertRows}
      insertAfter={insertAfter}
      insertEveryFrequency={insertEveryFrequency}
      insertEveryValues={insertEveryValues}
    />
  );
});

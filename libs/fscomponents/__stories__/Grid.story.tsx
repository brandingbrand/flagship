import React, { isValidElement } from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { action } from '@storybook/addon-actions';
import { boolean, number, object } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import Decimal from 'decimal.js';

import type { GridRenderItem } from '../src/components/Grid';
import { Grid } from '../src/components/Grid';
import { ProductItem } from '../src/components/ProductItem';

const productItems = [...Array.from({ length: 10 })].map((a, i) => ({
  id: i,
  title: `Product ${i + 1}`,
  image: 'https://placehold.it/100x100',
}));

const styles = StyleSheet.create({
  big: {
    fontSize: 18,
    textAlign: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    flexGrow: 1,
    height: 150,
  },
  gray: {
    backgroundColor: '#bdbdbd',
  },
  spacing: {
    marginBottom: 10,
    marginHorizontal: 10,
  },
});

const makePromo = (key: string, title: string) => (
  <View key={key} style={[styles.fill, styles.gray, styles.center, styles.spacing]}>
    <Text style={styles.big}>{title}</Text>
  </View>
);

const renderItem: GridRenderItem<React.ReactElement | typeof productItems[number]> = ({
  columns,
  item,
  totalColumns,
}) => {
  if (isValidElement(item)) {
    return item;
  }

  const tall = columns === totalColumns;

  return (
    <ProductItem
      contentStyle={styles.center}
      handle={item.title}
      id={`${item.id}`}
      image={{ uri: item.image, width: 100 * (columns ?? 1) }}
      imageStyle={[
        {
          width: 100 * (columns ?? 1),
          height: 100,
        },
        tall && { height: (columns ?? 1) * 100 },
      ]}
      onPress={action('MultiCarousel ProductItem onPress')}
      price={{
        value: new Decimal('5.95'),
        currencyCode: 'USD',
      }}
      style={[styles.center, tall && { height: (columns ?? 1) * 180 }]}
      title={item.title}
    />
  );
};

const Promo1 = makePromo('promo-1', 'Promo');
const TargetedPromo = makePromo('promo-2', 'Targeted Promo');
const Promos = [...Array.from({ length: 10 })].map((_, i) =>
  makePromo(`promo-every-${i}`, `Promo ${i}`)
);

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
      columnWidthTable={columnWidthTable}
      data={productItems}
      insertAfter={insertAfter}
      insertEveryFrequency={insertEveryFrequency}
      insertEveryValues={insertEveryValues}
      insertRows={insertRows}
      minColumnWidth={minColumnWidth}
      numColumns={autoColumns ? 'auto' : columns}
      renderItem={renderItem}
    />
  );
});

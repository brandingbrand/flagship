import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Accordion } from '@brandingbrand/fscomponents';
import { fontSize } from '../styles/variables';

import PSRow from './PSRow';

export interface Item {
  title: string;
  id: string;
  items?: Item[];
}

export interface PSAccordionGroupProps {
  onItemPress: (item: Item) => void;
  items: Item[];
}

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: fontSize.base
  },
  content: {
    paddingLeft: 5
  }
});

export default class PSAccordionGroup extends Component<PSAccordionGroupProps> {
  handlePress = (item: Item) => () => {
    this.props.onItemPress(item);
  }

  renderTitle = (title: string) => {
    return <Text style={styles.title}>{title}</Text>;
  }

  renderContent = (items: Item[]) => {
    return (
      <View style={styles.content}>
        {items.map((item, i) => (
          <PSRow
            key={i}
            title={item.title}
            onPress={this.handlePress(item)}
            showImage={true}
          />
        ))}
      </View>
    );
  }

  renderAccordion = (item: Item, i: number) => {
    return (
      <Accordion
        key={i}
        title={this.renderTitle(item.title)}
        titleHeight={60}
        content={this.renderContent(item.items || [])}
        style={styles.container}
        plusMinusStyle={{
          fontSize: 30,
          lineHeight: 30,
          fontWeight: '200'
        }}
      />
    );
  }

  render(): JSX.Element {
    return <View>{this.props.items.map(this.renderAccordion)}</View>;
  }
}

import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { border, palette } from '../styles/variables';
import translate, { translationKeys } from '../lib/translations';

const filterIcon = require('../../assets/images/filter.png');

export interface PSFilterActionBarProps {
  showFilterModal: any;
  showSortModal: any;
  commerceData: any;
  keyword?: string;
}

const styles = StyleSheet.create({
  actionBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: border.color,
    borderBottomWidth: border.width
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15
  },
  filterButtonText: {
    color: palette.secondary,
    fontWeight: 'bold',
    marginLeft: 5
  },
  filterIcon: {
    width: 20
  },
  itemTotalText: {
    color: palette.onBackground
  }
});

export default class PSFilterActionBar extends Component<
  PSFilterActionBarProps
> {
  render(): JSX.Element {
    const { commerceData } = this.props;

    return (
      <View style={styles.actionBarContainer}>
        {commerceData.correctedKeyword ? this._renderCorrectedKeyword() : this._renderKeyword()}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={this.props.showFilterModal}
        >
          <Image
            source={filterIcon}
            resizeMode='contain'
            style={styles.filterIcon}
          />
          <Text style={styles.filterButtonText}>
            {translate.string(translationKeys.flagship.sort.actions.refine.actionBtn)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  _renderCorrectedKeyword(): JSX.Element {
    const { commerceData } = this.props;
    const correctedResultsTranslations = translationKeys.search.filtered.correctedResults;

    return (
      <Text style={[styles.itemTotalText, { paddingVertical: 15 }]}>
        <Text>
          {this.props.keyword ?
            translate.string(correctedResultsTranslations.originalSearch.keyword, {
              keyword: this.props.keyword
            }) : translate.string(correctedResultsTranslations.originalSearch.noKeyword)
          }
          {'\n'}
          {translate.string(correctedResultsTranslations.newSearch, {
            count: commerceData.total,
            keyword: commerceData.correctedKeyword
          })}
        </Text>
      </Text>
    );
  }

  _renderKeyword(): JSX.Element {
    const { commerceData, keyword } = this.props;

    return (
      <Text style={styles.itemTotalText}>
        {keyword && keyword !== 'vsearch' ?
          translate.string(translationKeys.search.filtered.originalResults.keyword, {
            keyword,
            count: commerceData.total
          }) :
          translate.string(translationKeys.search.filtered.originalResults.noKeyword, {
            count: commerceData.total
          })
        }
      </Text>
    );
  }
}

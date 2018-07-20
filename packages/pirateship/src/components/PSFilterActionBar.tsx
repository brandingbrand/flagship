import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { color, palette } from '../styles/variables';
import translate, { translationKeys } from '../lib/translations';

import Svg, {
  Rect
} from 'react-native-svg';

export interface PSFilterActionBarProps {
  showFilterModal: any;
  showSortModal: any;
  commerceData: any;
  handleColumnToggle: () => void;
  isMultiColumn?: boolean;
  keyword?: string;
}

const buttonInactiveColor = color.gray;
const buttonActiveColor = palette.primary;

const styles = StyleSheet.create({
  actionBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonSpacer: {
    marginLeft: 10,
    marginRight: 10
  },
  filterButton: {
    borderWidth: 1,
    borderColor: 'black',
    paddingTop: 7,
    paddingBottom: 7,
    width: 120,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  itemTotalText: {
    color: palette.onBackground
  }
});

export default class PSFilterActionBar extends Component<
  PSFilterActionBarProps
> {
  render(): JSX.Element {
    return (
      <View style={styles.actionBarContainer}>
        {this.renderFilterButton()}
        <View style={styles.buttonContainer}>
          {this.renderSingleColumnButton()}
          {this.renderButtonSpacer()}
          {this.renderMultiColumnButton()}
        </View>
      </View>
    );
  }

  private renderButtonSpacer(): JSX.Element {
    return (
      <View style={styles.buttonSpacer}>
        <Svg height='30' width='1'>
          <Rect
            x='0'
            y='0'
            width='1'
            height='30'
            fill={color.lightGray}
          />
        </Svg>
      </View>
    );
  }

  private renderSingleColumnButton(): JSX.Element {
    return (
      <TouchableOpacity onPress={this.props.handleColumnToggle}>
        <Svg height='21' width='21'>
          <Rect
            x='0'
            y='0'
            width='21'
            height='21'
            fill={this.props.isMultiColumn ? buttonInactiveColor : buttonActiveColor}
          />
        </Svg>
      </TouchableOpacity>
    );
  }

  private renderMultiColumnButton(): JSX.Element {
    return (
      <TouchableOpacity onPress={this.props.handleColumnToggle}>
        <Svg height='21' width='21'>
          <Rect
            x='0'
            y='0'
            width='8'
            height='8'
            fill={this.props.isMultiColumn ? buttonActiveColor : buttonInactiveColor}
          />
          <Rect
            x='13'
            y='0'
            width='8'
            height='8'
            fill={this.props.isMultiColumn ? buttonActiveColor : buttonInactiveColor}
          />
          <Rect
            x='0'
            y='13'
            width='8'
            height='8'
            fill={this.props.isMultiColumn ? buttonActiveColor : buttonInactiveColor}
          />
          <Rect
            x='13'
            y='13'
            width='8'
            height='8'
            fill={this.props.isMultiColumn ? buttonActiveColor : buttonInactiveColor}
          />
        </Svg>
      </TouchableOpacity>
    );
  }

  private renderFilterButton(): JSX.Element {
    const { selectedRefinements = {} } = this.props.commerceData;
    let numSelected = 0;

    for (const key in selectedRefinements) {
      if (selectedRefinements.hasOwnProperty(key)) {
        numSelected += (selectedRefinements[key] || []).length;

        if (key === 'cgid') {
          // Commerce Cloud: all index pages will have a base cgid (category id) set, so only
          // factor additional categories into the number of active refinements
          numSelected -= 1;
        }
      }
    }

    const btnXtra = numSelected > 0 ? ' (' + numSelected + ')' : '';

    return (
      <TouchableOpacity
        style={styles.filterButton}
        onPress={this.props.showFilterModal}
      >
        <Text style={styles.filterButtonText}>
          {translate.string(translationKeys.flagship.sort.actions.filter.actionBtn) + btnXtra}
        </Text>
      </TouchableOpacity>
    );
  }
}

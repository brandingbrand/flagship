import React, { FunctionComponent } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { palette } from '../styles/variables';
import translate, { translationKeys } from '../lib/translations';

export interface PSFilterActionBarProps {
  showFilterModal: any;
  showSortModal: any;
  commerceData: any;
  handleColumnToggle: () => void;
  isMultiColumn?: boolean;
  keyword?: string;
}

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

const PSFilterActionBar: FunctionComponent<PSFilterActionBarProps> = (props): JSX.Element => {
  const renderFilterButton = (): JSX.Element => {
    const { selectedRefinements = {} } = props.commerceData;
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
        onPress={props.showFilterModal}
      >
        <Text style={styles.filterButtonText}>
          {translate.string(translationKeys.flagship.sort.actions.filter.actionBtn) + btnXtra}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.actionBarContainer}>
      {renderFilterButton()}
    </View>
  );
};

export default PSFilterActionBar;

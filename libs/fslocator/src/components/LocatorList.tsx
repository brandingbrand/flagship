import React, { Component } from 'react';

import { View } from 'react-native';

import { SearchBar } from '@brandingbrand/fscomponents';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

import { style as S } from '../styles/Locator';
import type { Location, Region } from '../types/Location';

import type {
  PropType as LocatorContainerPropType,
  StateType as LocatorContainerStateType,
} from './LocatorContainer';
import ResultList from './ResultList';

export interface PropType extends LocatorContainerPropType, LocatorContainerStateType {
  submitSearch: (searchValue: string) => void;
  useCurrentLocation: () => void;
  selectLocation: (location: Location) => void;
  deselectLocation: () => void;
  handleRegionChange: (e: any) => void;
  handleRegionChangeComplete: (e: any) => void;
  searchArea: () => void;
  defaultRegion?: Region;
  handleNavPress: (location: Location, locationId?: number, index?: number) => () => void;
  handlePhonePress: (phone: string, locationId?: number, index?: number) => () => void;
}

export default class LocatorList extends Component<PropType> {
  private readonly renderSearchBar = () => {
    const { renderSearchBar, searchBarProps } = this.props;
    return renderSearchBar ? (
      renderSearchBar({
        submitSearch: this.props.submitSearch,
        useCurrentLocation: this.props.useCurrentLocation,
      })
    ) : (
      <SearchBar
        onSubmit={this.props.submitSearch}
        placeholder={FSI18n.string(translationKeys.flagship.storeLocator.searchPlaceholder)}
        {...searchBarProps}
      />
    );
  };

  public render(): JSX.Element {
    const { listStyle } = this.props;

    return (
      <View style={[S.container, listStyle]}>
        {this.renderSearchBar()}
        <ResultList {...this.props} />
      </View>
    );
  }
}

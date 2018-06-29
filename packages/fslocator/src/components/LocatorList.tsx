import { SearchBar } from '@brandingbrand/fscomponents';
import React, { Component } from 'react';
import { View } from 'react-native';
import { style as S } from '../styles/Locator';
import { Location } from '../types/Location';
import {
  PropType as LocatorContainerPropType,
  StateType as LocatorContainerStateType
} from './LocatorContainer';
import ResultList from './ResultList';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

export interface PropType
  extends LocatorContainerPropType,
    LocatorContainerStateType {
  submitSearch: (searchValue: string) => void;
  useCurrentLocation: () => void;
  selectLocation: (location: Location) => void;
  deselectLocation: () => void;
  handleRegionChange: (e: any) => void;
  handleRegionChangeComplete: (e: any) => void;
  searchArea: () => void;
  handleNavPress: (
    location: Location,
    locationId?: number,
    index?: number
  ) => () => void;
  handlePhonePress: (
    phone: string,
    locationId?: number,
    index?: number
  ) => () => void;
}

export default class LocatorList extends Component<PropType> {
  renderSearchBar = () => {
    const { searchBarProps, renderSearchBar } = this.props;
    return renderSearchBar ? (
      renderSearchBar({
        submitSearch: this.props.submitSearch,
        useCurrentLocation: this.props.useCurrentLocation
      })
    ) : (
      <SearchBar
        placeholder={FSI18n.string(translationKeys.flagship.storeLocator.searchPlaceholder)}
        onSubmit={this.props.submitSearch}
        {...searchBarProps}
      />
    );
  }

  render(): JSX.Element {
    const { listStyle } = this.props;

    return (
      <View style={[S.container, listStyle]}>
        {this.renderSearchBar()}
        <ResultList {...this.props} />
      </View>
    );
  }
}

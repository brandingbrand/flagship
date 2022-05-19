import React, { Component } from 'react';

import type { ListRenderItemInfo, ViewToken } from 'react-native';
import { ActivityIndicator, FlatList, Platform, Text, TouchableOpacity, View } from 'react-native';

import { style as S } from '../styles/Locator';
import type { Location } from '../types/Location';

import type { PropType as LocatorPropType } from './LocatorList';
import ResultItem from './ResultItem';

export interface PropType extends LocatorPropType {
  scrollEnabled?: boolean;
  onScroll?: (e: unknown) => void;
  bounces?: boolean;
  onItemPress?: (location: Location, index: number) => void;
}

export interface StateType {
  key: string;
}

export default class ResultList extends Component<PropType, StateType> {
  public state = {
    key: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
  };

  private readonly handleViewableItemsChanged = ({ changed }: { changed: ViewToken[] }) => {
    const { analytics } = this.props;
    if (!analytics) {
      return;
    }

    for (const item of changed.filter((item) => item.isViewable)) {
      const key = item.key !== null ? item.key : undefined;
      const index = item.index !== null ? item.index : undefined;

      analytics.impression.generic('LocationItem', {
        identifier: key,
        index,
      });
    }
  };

  private readonly handlItemPress = (location: Location, index: number) => () => {
    if (this.props.onItemPress) {
      this.props.onItemPress(location, index);
    }
  };

  private readonly renderLocationItem = ({
    index,
    item,
  }: ListRenderItemInfo<Location>): JSX.Element => (
    <TouchableOpacity onPress={this.handlItemPress(item, index)}>
      <ResultItem
        handleNavPress={this.props.handleNavPress}
        handlePhonePress={this.props.handlePhonePress}
        index={index}
        location={item}
        locationItemProps={this.props.locationItemProps}
        renderLocationItem={this.props.renderLocationItem}
        selectLocation={this.props.selectLocation}
      />
    </TouchableOpacity>
  );

  public handleOrientationChange = (): void => {
    this.setState({
      key: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
    });
  };

  public componentDidMount(): void {
    if (Platform.OS === 'web') {
      window.addEventListener('orientationchange', this.handleOrientationChange);
    }
  }

  public componentWillUnmount(): void {
    if (Platform.OS === 'web') {
      window.removeEventListener('orientationchange', this.handleOrientationChange);
    }
  }

  public render(): JSX.Element | null {
    const {
      bounces,
      isLoading,
      listStyle,
      locations,
      locationsNotFound,
      noResultsText = 'Sorry, no results were found. Please try another search.',
      noResultsTextStyle,
      onScroll,
      scrollEnabled,
    } = this.props;

    let content = null;

    if (isLoading) {
      content = <ActivityIndicator style={S.loadingIndicator} />;
    } else if (locationsNotFound) {
      content = <Text style={[S.noResultsText, noResultsTextStyle]}>{noResultsText}</Text>;
    } else if (locations.length > 0) {
      content = (
        <FlatList
          bounces={bounces}
          data={locations}
          key={this.state.key}
          onScroll={onScroll}
          onViewableItemsChanged={this.handleViewableItemsChanged}
          renderItem={this.renderLocationItem}
          scrollEnabled={scrollEnabled}
          style={S.list}
        />
      );
    } else {
      return null;
    }

    return <View style={[S.resultList, listStyle]}>{content}</View>;
  }
}

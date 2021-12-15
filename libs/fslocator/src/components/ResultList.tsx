import React, { Component } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  Platform,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';
import { style as S } from '../styles/Locator';
import { Location } from '../types/Location';
import { PropType as LocatorPropType } from './LocatorList';
import ResultItem from './ResultItem';

export interface PropType extends LocatorPropType {
  scrollEnabled?: boolean;
  onScroll?: (e: any) => void;
  bounces?: boolean;
  onItemPress?: (location: Location, index: number) => void;
}

export interface StateType {
  key: string;
}

export default class ResultList extends Component<PropType, StateType> {
  constructor(props: PropType) {
    super(props);

    this.state = {
      key: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
    };
  }

  handleOrientationChange = (): void => {
    this.setState({
      key: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
    });
  };

  componentDidMount(): void {
    if (Platform.OS === 'web') {
      window.addEventListener('orientationchange', this.handleOrientationChange);
    }
  }

  componentWillUnmount(): void {
    if (Platform.OS === 'web') {
      window.removeEventListener('orientationchange', this.handleOrientationChange);
    }
  }

  handleViewableItemsChanged = ({ changed }: { changed: ViewToken[] }) => {
    const { analytics } = this.props;
    if (!analytics) {
      return;
    }

    changed
      .filter((item) => item.isViewable)
      .forEach((item) => {
        const key = item.key !== null ? item.key : undefined;
        const index = item.index !== null ? item.index : undefined;

        analytics.impression.generic('LocationItem', {
          identifier: key,
          index,
        });
      });
  };

  handlItemPress = (location: Location, index: number) => () => {
    if (this.props.onItemPress) {
      this.props.onItemPress(location, index);
    }
  };

  renderLocationItem = ({ item, index }: ListRenderItemInfo<Location>): JSX.Element => {
    return (
      <TouchableOpacity onPress={this.handlItemPress(item, index)}>
        <ResultItem
          location={item}
          index={index}
          handleNavPress={this.props.handleNavPress}
          handlePhonePress={this.props.handlePhonePress}
          locationItemProps={this.props.locationItemProps}
          selectLocation={this.props.selectLocation}
          renderLocationItem={this.props.renderLocationItem}
        />
      </TouchableOpacity>
    );
  };

  render(): JSX.Element | null {
    const {
      listStyle,
      locations,
      isLoading,
      locationsNotFound,
      noResultsText = 'Sorry, no results were found. Please try another search.',
      noResultsTextStyle,
      scrollEnabled,
      onScroll,
      bounces,
    } = this.props;

    let content = null;

    if (isLoading) {
      content = <ActivityIndicator style={S.loadingIndicator} />;
    } else if (locationsNotFound) {
      content = <Text style={[S.noResultsText, noResultsTextStyle]}>{noResultsText}</Text>;
    } else if (locations.length > 0) {
      content = (
        <FlatList
          key={this.state.key}
          style={S.list}
          data={locations}
          scrollEnabled={scrollEnabled}
          bounces={bounces}
          onScroll={onScroll}
          renderItem={this.renderLocationItem}
          onViewableItemsChanged={this.handleViewableItemsChanged}
        />
      );
    } else {
      return null;
    }

    return <View style={[S.resultList, listStyle]}>{content}</View>;
  }
}

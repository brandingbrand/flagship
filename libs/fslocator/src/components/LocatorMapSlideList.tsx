import React, { Component } from 'react';

import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SearchBar } from '@brandingbrand/fscomponents';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

import defaultLocateMeIcon from '../../assets/images/locate-me.png';
import { style as S } from '../styles/LocatorSlideList';
import type { Location } from '../types/Location';

import type { PropType as LocatorPropType } from './LocatorList';
import MapView from './MapView';
import ResultItemWithBack from './ResultItemWithBack';
import ResultList from './ResultList';

const MAP_HEIGHT = 300;
const LIST_HEIGHT = 300;
const SEARCH_BAR_HEIGHT = 65;
const SHOW_LIST_BUTTON_HEIGHT = 100;
const { height, width } = Dimensions.get('window');

export interface StateType {
  listY: Animated.Value;
  scrollable: boolean;
  listButtonY: Animated.Value;
  isMapCollapsed: boolean;
}

export type ListPosition = 'bottom' | 'middle' | 'top';

export default class LocatorMapSlideList extends Component<LocatorPropType, StateType> {
  constructor(props: LocatorPropType) {
    super(props);
    this.state = {
      listY: new Animated.Value(MAP_HEIGHT),
      listButtonY: new Animated.Value(0),
      scrollable: false,
      isMapCollapsed: true,
    };
  }

  public map: unknown;
  public panResponder: any;
  private listPosition: ListPosition = 'middle';
  private scrollY = 0;

  private readonly handleMoveRease = (evt: unknown, gestureState: any): void => {
    this.state.listY.flattenOffset();
    const isUp = gestureState.dy < 0;
    const shouldMove = Math.abs(gestureState.dy) > 40 || Math.abs(gestureState.vy) > 1;
    const nextPostion = this.getNextPosition(isUp, shouldMove, this.listPosition);

    this.listPosition = nextPostion;

    if (this.listPosition === 'bottom') {
      setTimeout(() => {
        Animated.spring(this.state.listButtonY, {
          toValue: -SHOW_LIST_BUTTON_HEIGHT,
          useNativeDriver: false,
        }).start();
        this.expandMap();
      }, 200);
    }

    Animated.spring(this.state.listY, {
      bounciness: 0,
      toValue: this.getPositionY(nextPostion),
      useNativeDriver: false,
    }).start(() => {
      this.setState({ scrollable: true });
    });
  };

  private readonly getPositionY = (listPosition: ListPosition): number => {
    switch (listPosition) {
      case 'top':
        return SEARCH_BAR_HEIGHT;
      case 'bottom':
        return height - SHOW_LIST_BUTTON_HEIGHT + SEARCH_BAR_HEIGHT;
      case 'middle':
        return MAP_HEIGHT;
      default:
        return 0;
    }
  };

  private readonly getNextPosition = (
    isUp: boolean,
    shouldMove: boolean,
    listPosition: ListPosition
  ): ListPosition => {
    if (!shouldMove) {
      return listPosition;
    }
    return isUp ? 'top' : 'bottom';
  };

  private readonly handleScroll = (e: any) => {
    this.scrollY = e.nativeEvent.contentOffset.y;
  };

  private readonly handleShowList = () => {
    this.listPosition = 'top';

    Animated.spring(this.state.listButtonY, {
      toValue: 0,
      useNativeDriver: false,
    }).start();

    Animated.spring(this.state.listY, {
      bounciness: 0,
      toValue: this.getPositionY('top'),
      useNativeDriver: false,
    }).start();
  };

  private readonly handleItemPress = (location: Location) => {
    const { selectLocation } = this.props;

    this.moveToBottom();
    selectLocation(location);
  };

  private readonly renderSearchBar = () => {
    const { renderSearchBar, searchBarProps } = this.props;
    return renderSearchBar ? (
      renderSearchBar({
        submitSearch: this.props.submitSearch,
        useCurrentLocation: this.props.useCurrentLocation,
      })
    ) : (
      <SearchBar
        containerStyle={S.inputContainer}
        onSubmit={this.props.submitSearch}
        placeholder={FSI18n.string(translationKeys.flagship.storeLocator.searchPlaceholder)}
        style={S.slideListSearchBar}
        {...searchBarProps}
      />
    );
  };

  public componentDidUpdate(prevProps: LocatorPropType): void {
    if (prevProps.locations !== this.props.locations) {
      this.moveToMiddle();
      return;
    }

    if (!this.props.selectedLocation && prevProps.selectedLocation) {
      this.moveToTop();
    }
  }

  public expandMap = () => {
    this.setState({
      isMapCollapsed: false,
    });
  };

  public moveToMiddle = () => {
    this.listPosition = 'middle';
    this.setState({
      isMapCollapsed: true,
      scrollable: false,
    });

    Animated.spring(this.state.listButtonY, {
      toValue: 0,
      useNativeDriver: false,
    }).start();

    Animated.spring(this.state.listY, {
      bounciness: 0,
      toValue: MAP_HEIGHT,
      useNativeDriver: false,
    }).start();
  };

  public moveToBottom = () => {
    this.listPosition = 'bottom';
    this.setState({
      isMapCollapsed: false,
      scrollable: false,
    });

    Animated.spring(this.state.listButtonY, {
      toValue: 0,
      useNativeDriver: false,
    }).start();

    Animated.spring(this.state.listY, {
      bounciness: 0,
      toValue: this.getPositionY('bottom'),
      useNativeDriver: false,
    }).start();
  };

  public moveToTop = () => {
    this.listPosition = 'top';
    this.setState({
      scrollable: true,
    });

    Animated.spring(this.state.listButtonY, {
      toValue: 0,
      useNativeDriver: false,
    }).start();

    Animated.spring(this.state.listY, {
      bounciness: 0,
      toValue: this.getPositionY('top'),
      useNativeDriver: false,
    }).start();
  };

  public componentDidMount(): void {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (this.listPosition === 'middle') {
          return true;
        } else if (this.scrollY <= 0) {
          if (gestureState.dy > 0) {
            return true;
          }
          return false;
        }
        return false;
      },

      onPanResponderGrant: (evt: unknown, gestureState: unknown) => {
        this.setState({ scrollable: true });

        const listY = this.state.listY as any;
        this.state.listY.setOffset(listY._value);
        this.state.listY.setValue(0);
      },
      onPanResponderMove: (evt: unknown, gestureState: any) => {
        if (this.listPosition === 'middle' && gestureState.dy < -LIST_HEIGHT) {
          this.state.listY.setValue(-LIST_HEIGHT);
          return;
        }
        if (this.listPosition === 'top' && gestureState.dy < SEARCH_BAR_HEIGHT) {
          this.state.listY.setValue(0);
          return;
        }
        Animated.event([null, { dy: this.state.listY }])(evt, gestureState);
      },
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onPanResponderRelease: this.handleMoveRease,
      onShouldBlockNativeResponder: (evt, gestureState) => true,
    });
  }

  public extractMapRef = (map: unknown) => (this.map = map);

  public render(): JSX.Element {
    const {
      currentLocation,
      deselectLocation,
      googleMapsAPIKey,
      handleNavPress,
      handlePhonePress,
      handleRegionChange,
      handleRegionChangeComplete,
      locateMeIcon,
      locationItemProps,
      locations,
      locationsNotFound,
      mapMarkerIcon,
      mapStyle,
      renderLocationItem,
      renderLocationItemWithBack,
      selectLocation,
      selectedLocation,
      showLocateMe,
      style,
      useCurrentLocation,
    } = this.props;

    const listAniamtedStyle = {
      transform: [{ translateY: this.state.listY }],
      paddingBottom: SEARCH_BAR_HEIGHT,
    };
    const showListButtonAniamtedStyle = {
      transform: [{ translateY: this.state.listButtonY }],
    };
    const shouldShowList = locationsNotFound || locations.length > 0;
    const center = selectedLocation && {
      latitude: selectedLocation.address.latlng.lat,
      longitude: selectedLocation.address.latlng.lng,
    };

    return (
      <View style={[S.container, style]}>
        <View style={S.innerContainer}>
          <View style={S.slideMapContainer}>
            <MapView
              center={center}
              collapseHeight={MAP_HEIGHT}
              currentLocation={currentLocation}
              googleMapsAPIKey={googleMapsAPIKey}
              handleRegionChange={handleRegionChange}
              handleRegionChangeComplete={handleRegionChangeComplete}
              isCollapsed={this.state.isMapCollapsed}
              locations={locations}
              mapMarkerIcon={mapMarkerIcon}
              onMakerPress={this.handleItemPress}
              ref={this.extractMapRef}
              style={[S.map, mapStyle]}
            />
            {showLocateMe ? (
              <TouchableOpacity onPress={useCurrentLocation} style={S.locateMeButton}>
                <Image source={locateMeIcon || defaultLocateMeIcon} style={S.locateMeIcon} />
              </TouchableOpacity>
            ) : null}
            {this.renderSearchBar()}
          </View>

          {shouldShowList ? (
            <Animated.View
              style={[S.slideListContainer, listAniamtedStyle]}
              {...this.panResponder.panHandlers}
            >
              <ResultList
                {...this.props}
                onItemPress={this.handleItemPress}
                onScroll={this.handleScroll}
                scrollEnabled={this.state.scrollable}
              />
            </Animated.View>
          ) : null}

          {selectedLocation ? (
            <ResultItemWithBack
              deselectLocation={deselectLocation}
              handleNavPress={handleNavPress}
              handlePhonePress={handlePhonePress}
              locationItemProps={locationItemProps}
              renderLocationItem={renderLocationItem}
              renderLocationItemWithBack={renderLocationItemWithBack}
              selectLocation={selectLocation}
              selectedLocation={selectedLocation}
            />
          ) : null}
        </View>

        <Animated.View
          style={[
            showListButtonAniamtedStyle,
            {
              position: 'absolute',
              bottom: -100,
              width,
            },
          ]}
        >
          <TouchableOpacity
            onPress={this.handleShowList}
            style={{
              padding: 20,
              backgroundColor: '#eee',
            }}
          >
            <Text
              style={{
                textAlign: 'center',
              }}
            >
              {FSI18n.string(translationKeys.flagship.storeLocator.actions.showList.actionBtn)}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
}

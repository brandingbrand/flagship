import { SearchBar } from '@brandingbrand/fscomponents';
import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { style as S } from '../styles/LocatorSlideList';
import { Location } from '../types/Location';
import { PropType as LocatorPropType } from './LocatorList';
import MapView from './MapView';
import ResultItemWithBack from './ResultItemWithBack';
import ResultList from './ResultList';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

const defaultLocateMeIcon = require('../../assets/images/locate-me.png');
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

export type ListPosition = 'top' | 'middle' | 'bottom';

export default class LocatorMapSlideList extends Component<
  LocatorPropType,
  StateType
> {
  map: any;
  panResponder: any;
  listPosition: ListPosition = 'middle';
  scrollY: number = 0;

  constructor(props: LocatorPropType) {
    super(props);
    this.state = {
      listY: new Animated.Value(MAP_HEIGHT),
      listButtonY: new Animated.Value(0),
      scrollable: false,
      isMapCollapsed: true
    };
  }

  componentDidUpdate(prevProps: LocatorPropType): void {
    if (prevProps.locations !== this.props.locations) {
      return this.moveToMiddle();
    }

    if (!this.props.selectedLocation && prevProps.selectedLocation) {
      return this.moveToTop();
    }
  }

  moveToMiddle = () => {
    this.listPosition = 'middle';
    this.setState({
      isMapCollapsed: true,
      scrollable: false
    });

    Animated.spring(this.state.listButtonY, {
      toValue: 0,
      useNativeDriver: false
    }).start();

    Animated.spring(this.state.listY, {
      bounciness: 0,
      toValue: MAP_HEIGHT,
      useNativeDriver: false
    }).start();
  }

  moveToBottom = () => {
    this.listPosition = 'bottom';
    this.setState({
      isMapCollapsed: false,
      scrollable: false
    });

    Animated.spring(this.state.listButtonY, {
      toValue: 0,
      useNativeDriver: false
    }).start();

    Animated.spring(this.state.listY, {
      bounciness: 0,
      toValue: this.getPositionY('bottom'),
      useNativeDriver: false
    }).start();
  }

  moveToTop = () => {
    this.listPosition = 'top';
    this.setState({
      scrollable: true
    });

    Animated.spring(this.state.listButtonY, {
      toValue: 0,
      useNativeDriver: false
    }).start();

    Animated.spring(this.state.listY, {
      bounciness: 0,
      toValue: this.getPositionY('top'),
      useNativeDriver: false
    }).start();
  }

  componentDidMount(): void {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (this.listPosition === 'middle') {
          return true;
        } else if (this.scrollY <= 0) {
          if (gestureState.dy > 0) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      },

      onPanResponderGrant: (evt: any, gestureState: any) => {
        this.setState({ scrollable: true });

        const listY = this.state.listY as any;
        this.state.listY.setOffset(listY._value);
        this.state.listY.setValue(0);
      },
      onPanResponderMove: (evt: any, gestureState: any) => {
        if (this.listPosition === 'middle' && gestureState.dy < -LIST_HEIGHT) {
          this.state.listY.setValue(-LIST_HEIGHT);
          return;
        }
        if (
          this.listPosition === 'top' &&
          gestureState.dy < SEARCH_BAR_HEIGHT
        ) {
          this.state.listY.setValue(0);
          return;
        }
        Animated.event([null, { dy: this.state.listY }])(evt, gestureState);
      },
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onPanResponderRelease: this.handleMoveRease,
      onShouldBlockNativeResponder: (evt, gestureState) => true
    });
  }

  handleMoveRease = (evt: any, gestureState: any): void => {
    this.state.listY.flattenOffset();
    const isUp = gestureState.dy < 0;
    const shouldMove =
      Math.abs(gestureState.dy) > 40 || Math.abs(gestureState.vy) > 1;
    const nextPostion = this.getNextPosition(
      isUp,
      shouldMove,
      this.listPosition
    );

    this.listPosition = nextPostion;

    if (this.listPosition === 'bottom') {
      setTimeout(() => {
        Animated.spring(this.state.listButtonY, {
          toValue: -SHOW_LIST_BUTTON_HEIGHT,
          useNativeDriver: false
        }).start();
        this.expandMap();
      }, 200);
    }

    Animated.spring(this.state.listY, {
      bounciness: 0,
      toValue: this.getPositionY(nextPostion),
      useNativeDriver: false
    }).start(() => {
      this.setState({ scrollable: true });
    });
  }

  getPositionY = (listPosition: ListPosition): number => {
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
  }

  getNextPosition = (
    isUp: boolean,
    shouldMove: boolean,
    listPosition: ListPosition
  ): ListPosition => {
    if (!shouldMove) {
      return listPosition;
    }
    return isUp ? 'top' : 'bottom';
  }

  extractMapRef = (map: any) => (this.map = map);

  handleScroll = (e: any) => {
    this.scrollY = e.nativeEvent.contentOffset.y;
  }

  expandMap = () => {
    this.setState({
      isMapCollapsed: false
    });
  }

  handleShowList = () => {
    this.listPosition = 'top';

    Animated.spring(this.state.listButtonY, {
      toValue: 0,
      useNativeDriver: false
    }).start();

    Animated.spring(this.state.listY, {
      bounciness: 0,
      toValue: this.getPositionY('top'),
      useNativeDriver: false
    }).start();
  }

  handleItemPress = (location: Location) => {
    const { selectLocation } = this.props;

    this.moveToBottom();
    selectLocation(location);
  }

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
        style={S.slideListSearchBar}
        containerStyle={S.inputContainer}
        {...searchBarProps}
      />
    );
  }

  render(): JSX.Element {
    const {
      style,
      locations,
      useCurrentLocation,
      locateMeIcon,
      googleMapsAPIKey,
      currentLocation,
      locationsNotFound,
      locationItemProps,
      handleNavPress,
      handlePhonePress,
      selectedLocation,
      deselectLocation,
      handleRegionChange,
      handleRegionChangeComplete,
      mapMarkerIcon,
      showLocateMe,
      selectLocation,
      renderLocationItem,
      renderLocationItemWithBack,
      mapStyle
    } = this.props;

    const listAniamtedStyle = {
      transform: [{ translateY: this.state.listY }],
      paddingBottom: SEARCH_BAR_HEIGHT
    };
    const showListButtonAniamtedStyle = {
      transform: [{ translateY: this.state.listButtonY }]
    };
    const shouldShowList = locationsNotFound || !!locations.length;
    const center = selectedLocation && {
      latitude: selectedLocation.address.latlng.lat,
      longitude: selectedLocation.address.latlng.lng
    };

    return (
      <View style={[S.container, style]}>
        <View style={S.innerContainer}>
          <View style={S.slideMapContainer}>
            <MapView
              onMakerPress={this.handleItemPress}
              googleMapsAPIKey={googleMapsAPIKey}
              ref={this.extractMapRef}
              style={[S.map, mapStyle]}
              locations={locations}
              collapseHeight={MAP_HEIGHT}
              center={center}
              isCollapsed={this.state.isMapCollapsed}
              currentLocation={currentLocation}
              handleRegionChange={handleRegionChange}
              handleRegionChangeComplete={handleRegionChangeComplete}
              mapMarkerIcon={mapMarkerIcon}
            />
            {showLocateMe && (
              <TouchableOpacity
                style={S.locateMeButton}
                onPress={useCurrentLocation}
              >
                <Image
                  source={locateMeIcon || defaultLocateMeIcon}
                  style={S.locateMeIcon}
                />
              </TouchableOpacity>
            )}
            {this.renderSearchBar()}
          </View>

          {shouldShowList && (
            <Animated.View
              style={[S.slideListContainer, listAniamtedStyle]}
              {...this.panResponder.panHandlers}
            >
              <ResultList
                {...this.props}
                scrollEnabled={this.state.scrollable}
                onScroll={this.handleScroll}
                onItemPress={this.handleItemPress}
              />
            </Animated.View>
          )}

          {selectedLocation && (
            <ResultItemWithBack
              deselectLocation={deselectLocation}
              selectedLocation={selectedLocation}
              handleNavPress={handleNavPress}
              handlePhonePress={handlePhonePress}
              locationItemProps={locationItemProps}
              selectLocation={selectLocation}
              renderLocationItem={renderLocationItem}
              renderLocationItemWithBack={renderLocationItemWithBack}
            />
          )}
        </View>

        <Animated.View
          style={[
            showListButtonAniamtedStyle,
            {
              position: 'absolute',
              bottom: -100,
              width
            }
          ]}
        >
          <TouchableOpacity
            onPress={this.handleShowList}
            style={{
              padding: 20,
              backgroundColor: '#eee'
            }}
          >
            <Text
              style={{
                textAlign: 'center'
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

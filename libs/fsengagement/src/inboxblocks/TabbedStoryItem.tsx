import React, { Component } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  StyleSheet,
  View
} from 'react-native';
import VideoPlayer from 'react-native-video';
import { TextBlock } from './TextBlock';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 40,
    marginHorizontal: 25
  },
  fullScreen: {
    width: '100%',
    height: '100%'
  },
  header: {
    width: '100%',
    backgroundColor: 'yellow'
  },
  loadingInner: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  },
  fullScreenDimensions: {
    width: viewportWidth,
    height: viewportHeight
  },
  progressBar: {
    position: 'absolute',
    flexDirection: 'row',
    top: 50,
    flex: 1,
    marginHorizontal: 50
  },
  progressItem: {
    flex: 1,
    marginHorizontal: 2,
    backgroundColor: '#cacaca',
    height: 2
  },
  activeProgress: {
    backgroundColor: '#4f4f4f'
  }
});
const PRIVATE_TYPE = 'private_type';

export interface ImageProp {
  uri: string;
}
export interface TabbedStoryItemProps {
  item: any;
  activeIndex: number;
}
export interface TabbedItemState {
  loaded: boolean;
  activeIndex?: number;
}
export default class TabbedStoryItem extends Component<TabbedStoryItemProps, TabbedItemState> {
  static getDerivedStateFromProps(props: TabbedStoryItemProps, prevState: TabbedItemState):
    Partial<TabbedItemState> {
    if (props.activeIndex !== prevState.activeIndex) {
      return {
        loaded: false,
        activeIndex: props.activeIndex
      };
    }
    return {};
  }

  constructor(props: TabbedStoryItemProps) {
    super(props);
    this.state = {
      loaded: false,
      activeIndex: 0
    };
  }

  loaded = (loaded: boolean) => () => {
    this.setState({ loaded });
  }
  // eslint-disable-next-line complexity
  render(): JSX.Element {
    const {
      item
    } = this.props;

    const horizontalMap: any = {
      left: 'flex-start',
      center: 'center',
      right: 'flex-end'
    };
    const verticalMap: any = {
      top: 'flex-start',
      center: 'center',
      bottom: 'flex-end'
    };
    let textContainerStyle = {};
    if (item && item.textOverlay) {
      textContainerStyle = {
        flex: 1,
        justifyContent: verticalMap[item.textOverlay.options.verticalAlignment],
        alignItems: horizontalMap[item.textOverlay.options.horizontalAlignment],
        marginBottom: item.textOverlay.options &&
          item.textOverlay.options.verticalAlignment === 'bottom' ?
          item.textOverlay.options.verticalDistanceFromEdge : 0,
        marginTop: item.textOverlay.options &&
          item.textOverlay.options.verticalAlignment !== 'bottom' ?
          item.textOverlay.options.verticalDistanceFromEdge : 0,
        marginHorizontal: item.textOverlay.options &&
          item.textOverlay.options.horizontalDistanceFromEdge
      };
    }
    if (item[PRIVATE_TYPE] === 'Image') {
      return (
        <View>
          <ImageBackground source={item.source} style={styles.fullScreen}>
            {item.textOverlay && item.textOverlay.enabled && (
            <View
              style={textContainerStyle}
            >
              {!!item.textOverlay && (
              <TextBlock
                {...item.textOverlay.Title}
              />
              )}
              {!!item.textOverlay.Subtitle.text && (
              <TextBlock
                {...item.textOverlay.Subtitle}
              />
              )}
            </View>
            )}
          </ImageBackground>
        </View>
      );
    } else if (item[PRIVATE_TYPE] === 'Video') {
      return (
        <View style={styles.fullScreen}>
          <VideoPlayer
            resizeMode={'cover'}
            repeat={true}
            playInBackground={false}
            playWhenInactive={false}
            onLoad={this.loaded(true)}
            source={{ uri: item.source.src }}
            style={{
              width: '100%',
              height: '100%'
            }}
          />
          {item.textOverlay && item.textOverlay.enabled && (
          <View
              style={[textContainerStyle, StyleSheet.absoluteFillObject]}
          >
            {!!item.textOverlay.Title.text && (
            <TextBlock
              {...item.textOverlay.Title}
            />
            )}
            {!!item.textOverlay.Subtitle.text && (
            <TextBlock
              {...item.textOverlay.Subtitle}
            />
            )}
          </View>
          )}
          {!this.state.loaded && (
          <View style={styles.loadingInner}>
            <ActivityIndicator color='rgba(0,0,0,0.5)' />
          </View>
          )}
        </View>
      );
    }
    return (
      <View key={item.key} />
    );
  }
}

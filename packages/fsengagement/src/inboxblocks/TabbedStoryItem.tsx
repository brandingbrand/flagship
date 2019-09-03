import React, { Component } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  StyleSheet,
  View
} from 'react-native';
import VideoPlayer from 'react-native-video';
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

  render(): JSX.Element {
    const {
      item
    } = this.props;

    if (item[PRIVATE_TYPE] === 'Image') {
      return (
        <View>
          <ImageBackground source={item.source} style={styles.fullScreen} />
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
              aspectRatio: 1,
              width: '100%',
              height: '100%'
            }}
          />
          {!this.state.loaded && <View style={styles.loadingInner}>
            <ActivityIndicator color='rgba(0,0,0,0.5)' />
          </View>}
        </View>
      );
    }
    return (
      <View key={item.key} />
    );
  }
}

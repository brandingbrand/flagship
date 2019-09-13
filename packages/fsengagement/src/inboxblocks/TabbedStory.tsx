import React, { Component, Fragment } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import TabbedStoryItem from './TabbedStoryItem';
import { Navigation } from 'react-native-navigation';

const closeX = require('../../assets/images/dark.png');
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    zIndex: 10,
    top: 49,
    left: 10,
    padding: 0
  },
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
  close: {
    width: 44,
    height: 44
  },
  flexGrow: {
    width: viewportWidth,
    height: viewportHeight
  },
  progressBar: {
    position: 'absolute',
    flexDirection: 'row',
    top: 70,
    flex: 1,
    marginHorizontal: 53
  },
  progressItem: {
    flex: 1,
    marginHorizontal: 2,
    backgroundColor: 'rgba(79, 79, 79, .3)',
    height: 2
  },
  activeProgress: {
    backgroundColor: 'rgba(79, 79, 79, .8)'
  }
});

const FIRST_ITEM = 0;
export interface ImageProp {
  uri: string;
}
export interface TabbedStoryProps {
  items: any[];
  componentId: string;
}
export interface TabbedStoryState {
  activeIndex: number;
}
export default class TabbedStory extends Component<TabbedStoryProps, TabbedStoryState> {
  constructor(props: TabbedStoryProps) {
    super(props);
    this.state = {
      activeIndex: FIRST_ITEM
    };
  }
  onCardPress = () => {
    if (this.state.activeIndex >= (this.props.items.length - 1)) {
      Navigation.pop(this.props.componentId)
        .catch(err => console.log('onBackPress POP error:', err));
    } else {
      this.setState({
        activeIndex: this.state.activeIndex + 1
      });
    }
  }
  onClose = () => {
    Navigation.pop(this.props.componentId)
      .catch(err => console.log('onBackPress POP error:', err));
  }

  render(): JSX.Element {
    const {
      items
    } = this.props;

    return (
      <Fragment>
        <View style={styles.flexGrow}>
           <TouchableOpacity
             onPress={this.onCardPress}
             activeOpacity={1}
           >
            <TabbedStoryItem
              item={items[this.state.activeIndex]}
              activeIndex={this.state.activeIndex}
            />
           </TouchableOpacity>
        </View>
        <View style={styles.progressBar}>
          {(items || []).map((item: any, index: number) => {
            return (
              <View
                key={item.key}
                style={[
                  styles.progressItem, (this.state.activeIndex === index) && styles.activeProgress
                ]}
              />
            );
          })}
        </View>
        <TouchableOpacity onPress={this.onClose} style={styles.backButton}>
          <Image
            resizeMode='contain'
            source={closeX}
            style={styles.close}
          />
        </TouchableOpacity>
      </Fragment>
      // <TouchableOpacity
      //   style={containerStyle}
      //   onPress={this.onCardPress}
      //   activeOpacity={1}
      // >
      //   <ImageBackground source={contents.Image.source} style={styles.fullScreen}>
      //     <View style={styles.bottom}>
      //       <TextBlock
      //         {...contents.Eyebrow}
      //       />
      //       <TextBlock
      //         {...contents.Headline}
      //       />
      //     </View>
      //   </ImageBackground>
      // </TouchableOpacity>
    );
  }
}

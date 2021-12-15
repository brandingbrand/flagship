import React, { Component, Fragment } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import TabbedStoryItem from './TabbedStoryItem';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    zIndex: 10,
    top: 49,
    left: 10,
    padding: 0,
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 40,
    marginHorizontal: 25,
  },
  fullScreen: {
    width: '100%',
    height: '100%',
  },
  close: {
    width: 44,
    height: 44,
  },
  flexGrow: {
    width: viewportWidth,
    height: viewportHeight,
    marginTop: -100,
    backgroundColor: '#fff',
  },
  progressBar: {
    position: 'absolute',
    flexDirection: 'row',
    top: -34,
    flex: 1,
    marginLeft: 65,
    marginRight: 33,
  },
  progressItem: {
    flex: 1,
    marginHorizontal: 3,
    backgroundColor: 'rgba(79, 79, 79, .3)',
    height: 2,
  },
  activeProgress: {
    backgroundColor: 'rgba(79, 79, 79, .8)',
  },
});

export interface ImageProp {
  uri: string;
}
export interface TabbedStoryProps {
  items: any[];
  onCardPress: () => void;
  activeIndex: number;
}

export default class TabbedStory extends Component<TabbedStoryProps> {
  constructor(props: TabbedStoryProps) {
    super(props);
  }
  onCardPress = () => {
    if (this.props.onCardPress) {
      this.props.onCardPress();
    }
  };

  render(): JSX.Element {
    const { items } = this.props;

    return (
      <Fragment>
        <View style={styles.flexGrow}>
          <TouchableOpacity onPress={this.onCardPress} activeOpacity={1}>
            <TabbedStoryItem
              item={items[this.props.activeIndex]}
              activeIndex={this.props.activeIndex}
            />
          </TouchableOpacity>
        </View>
      </Fragment>
    );
  }
}

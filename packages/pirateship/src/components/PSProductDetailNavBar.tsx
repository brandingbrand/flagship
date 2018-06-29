import React, { Component } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

const arrowImg = require('../../assets/images/arrow.png');
const heartIcon = require('../../assets/images/heart.png');
const heartFilledIcon = require('../../assets/images/heart-filled.png');
const shareIcon = require('../../assets/images/share.png');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: 60,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0)'
  },
  arrow: {
    width: 22,
    height: 22
  },
  text: {
    backgroundColor: 'transparent'
  },
  arrowButton: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconContainer: {
    paddingRight: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  iconButton: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconHeart: {
    width: 24,
    height: 22
  },
  iconShare: {
    width: 19,
    height: 23
  }
});

export interface PSProductDetailNavBarProps {
  onBackPress: () => void;
  scrollHeight: Animated.Value;
  isInWishlist: boolean;
  isWishlistLoading: boolean;
  onWishlistPress: () => void;
}

export default class PSProductDetailNavBar extends Component<
  PSProductDetailNavBarProps
> {
  handleSharePress = () => {
    alert('handleSharePress');
  }
  render(): JSX.Element {
    const widthStyle = {
      width: Dimensions.get('window').width
    };
    const backgroundColor = this.props.scrollHeight.interpolate({
      inputRange: [0, 100],
      outputRange: ['rgba(255,255,255,0)', 'rgba(255,255,255,1)']
    });

    return (
      <Animated.View
        style={[styles.container, widthStyle, { backgroundColor }]}
      >
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={this.props.onBackPress}
        >
          <Image source={arrowImg} style={styles.arrow} resizeMode='contain' />
        </TouchableOpacity>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={this.props.onWishlistPress}
          >
            {this.props.isWishlistLoading ? (
              <ActivityIndicator />
            ) : (
              <Image
                style={styles.iconHeart}
                source={this.props.isInWishlist ? heartFilledIcon : heartIcon}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={this.handleSharePress}
          >
            <Image style={styles.iconShare} source={shareIcon} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }
}

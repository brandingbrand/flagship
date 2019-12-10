import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  DeviceEventEmitter,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import * as Animatable from 'react-native-animatable';
const CARD_HEIGHT = 400;
const styles = StyleSheet.create({
  top: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 25,
    marginHorizontal: 20
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 25,
    marginHorizontal: 20
  },
  fullScreen: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    overflow: 'hidden'
  }
});

import {
  Action,
  CardProps,
  JSON
} from '../types';
import TextBlock from './TextBlock';
const { width: viewportWidth } = Dimensions.get('window');

export interface ImageProp {
  uri: string;
}
export interface RoundedImageCardProps extends CardProps {
  actions?: Action;
  contents: any;
  source: ImageProp;
  index?: number;
  cardsLoaded?: boolean;
}

export default class RoundedImageCardCard extends Component<RoundedImageCardProps> {
  static childContextTypes: any = {
    story: PropTypes.object,
    handleStoryAction: PropTypes.func,
    cardActions: PropTypes.object,
    id: PropTypes.string,
    name: PropTypes.string
  };
  static contextTypes: any = {
    handleAction: PropTypes.func
  };
  AnimatedImage: any;
  myComponent: any;
  viewComponent: any;
  AnimatedContent: any;

  handleImageRef = (ref: any) => this.AnimatedImage = ref;
  handleViewRef = (ref: any) => this.myComponent = ref;
  handleContentRef = (ref: any) => this.AnimatedContent = ref;
  getChildContext = () => ({
    story: this.props.story,
    handleStoryAction: this.handleStoryAction,
    cardActions: this.props.actions,
    id: this.props.id,
    name: this.props.name
  })

  componentDidMount(): void {
    if (typeof this.props.index === 'number' && this.props.index <= 1) {
      const timeout = 400 + (this.props.index * 200);
      setTimeout(() => {
        this.myComponent.transition({
          translateX: this.props.index ? -viewportWidth : viewportWidth
        }, {
          translateX: 0
        }, 600, 'ease-in-out-quart');
      }, timeout);

    }
  }

  onBack = () => {
    this.AnimatedImage.transitionTo({
      scale: 1
    }, 600, 'ease-out');

    this.myComponent.transitionTo({
      translateY: 0,
      height: CARD_HEIGHT
    }, 700, 'ease-in-out-quart');

    this.AnimatedContent.transitionTo({
      translateX: 0,
      translateY: 0
    }, 600, 'ease-out');
  }

  handleStoryAction = (json: JSON) => {
    DeviceEventEmitter.emit('viewStory', {
      title: this.props.name,
      id: this.props.id
    });
    this.props.api.logEvent('viewInboxStory', {
      messageId: this.props.id
    });
    this.props.navigator.showModal({
      screen: 'EngagementComp',
      animationType: 'none',
      passProps: {
        json,
        animateScroll: true,
        backButton: true,
        name: this.props.name,
        id: this.props.id,
        onBack: this.onBack,
        AnimatedImage: null
      },
      navigatorStyle: {
        navBarHidden: true,
        screenBackgroundColor: 'transparent',
        modalPresentationStyle: 'overCurrentContext',
        tabBarHidden: true,
        navBarTranslucent: true
      }
    });
     // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
    // this.props.navigator.push({
    //   screen: 'EngagementComp',
    //   navigatorStyle: {
    //     navBarHidden: true
    //   },
    //   passProps: {
    //     json,
    //     backButton: true,
    //     name: this.props.name,
    //     id: this.props.id
    //   }
    // });
  }
  handlePressIn = (): void => {
    // this.myComponent.transitionTo({
    //   scale: 0.98
    // }, 200, 'ease-out');
  }
  handlePressOut = (): void => {
    // this.myComponent.transitionTo({
    //   scale: 1
    // }, 200, 'ease-out');
  }
  onCardPress = (): void => {
    const { handleAction } = this.context;
    const { actions, story, storyGradient } = this.props;

    // if there is a story attached and either
    //    1) no actions object (Related)
    //    2) actions.type is null or 'story' (new default tappable cards)
    if (story &&
      (!actions || (actions && (actions.type === null || actions.type === 'story')))
    ) {
      this.viewComponent.measure((fx: any, fy: any, width: any, height: any, px: any, py: any) => {
        this.AnimatedImage.transitionTo({
          scale: 1.15
        }, 500, 'ease-out');

        this.myComponent.transitionTo({
          translateY: -py + 25,
          scale: 1,
          height: 800
        }, 700, 'ease-in-out-quart');

        this.AnimatedContent.transitionTo({
          translateX: -15,
          translateY: 20
        }, 500, 'ease-out');
      });

      this.handleStoryAction({
        ...story,
        storyGradient
      });
    } else if (actions && actions.type) {
      handleAction(actions);
    }
  }

  render(): JSX.Element {
    const {
      contents
    } = this.props;

    return (
      <Animatable.View
        ref={this.handleViewRef}
        style={[{
          height: CARD_HEIGHT,
          marginTop: 20,
          paddingHorizontal: 20,
          backgroundColor: '#fff'
        }, (typeof this.props.index === 'number' && this.props.index <= 1) ? {
          transform: [
            { translateX: this.props.index ? -viewportWidth : viewportWidth }
          ]
        } : {}]}
      >
        <View ref={view => { this.viewComponent = view; }} style={{

        }}>
        <TouchableOpacity
          style={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 7
            },
            shadowOpacity: 0.24,
            shadowRadius: 7.49,
            elevation: 12
          }}
          onPressIn={this.handlePressIn}
          onPressOut={this.handlePressOut}
          onPress={this.onCardPress}
          activeOpacity={1}
        >
          <Animatable.Image
            source={contents.Image.source}
            ref={this.handleImageRef}
            useNativeDriver
            style={[StyleSheet.absoluteFill, styles.fullScreen]}
          />
          <View style={{
            flexDirection: 'column',
            height: CARD_HEIGHT
          }}>
            <Animatable.View
              ref={this.handleContentRef}
              useNativeDriver
              style={styles.bottom}
            >
              <TextBlock
                {...contents.Eyebrow}
              />
              <TextBlock
                {...contents.Headline}
              />
            </Animatable.View>
          </View>


        </TouchableOpacity>
        </View>
      </Animatable.View>
    );
  }
}

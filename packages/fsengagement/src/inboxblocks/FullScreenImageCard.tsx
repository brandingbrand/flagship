import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  DeviceEventEmitter,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { OptionsModalPresentationStyle } from 'react-native-navigation';
import * as Animatable from 'react-native-animatable';
import GestureHandler from '../GestureHandler';

const NEW = 'NEW';
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
  newContainer: {
    backgroundColor: '#c41230',
    padding: 2,
    paddingTop: 5,
    width: 40,
    marginBottom: 13,
    alignItems: 'center',
    justifyContent: 'center'
  },
  newText: {
    fontFamily: 'Interstate-Bold',
    fontSize: 12,
    textAlign: 'center',
    color: '#fff'
  }
});

import {
  Action,
  CardProps,
  JSON
} from '../types';
import TextBlock from './TextBlock';

export interface ImageProp {
  uri: string;
}
export interface FullScreenCardProps extends CardProps {
  actions?: Action;
  contents: any;
  storyType?: string;
  source: ImageProp;
  isNew?: boolean;
  AnimatedPageCounter?: any;
  AnimatedNavTitle?: any;
  position?: number;
  setScrollEnabled: (enabled: boolean) => void;
}

export default class FullScreenImageCard extends Component<FullScreenCardProps> {
  static childContextTypes: any = {
    story: PropTypes.object,
    handleStoryAction: PropTypes.func,
    cardActions: PropTypes.object,
    id: PropTypes.string,
    name: PropTypes.string
  };
  static contextTypes: any = {
    handleAction: PropTypes.func,
    language: PropTypes.string
  };
  state: any = {};
  AnimatedImage: any;
  AnimatedText: any;
  constructor(props: FullScreenCardProps) {
    super(props);
    this.state = {
      swipedUp: false
    };
  }

  handleImageRef = (ref: any) => this.AnimatedImage = ref;
  handleTextRef = (ref: any) => this.AnimatedText = ref;

  getChildContext = () => ({
    story: this.props.story,
    handleStoryAction: this.handleStoryAction,
    cardActions: this.props.actions,
    id: this.props.id,
    name: this.props.name
  })

  onBack = () => {
    this.props.setScrollEnabled(true);
    this.AnimatedImage.transitionTo({
      scale: 1,
      opacity: 1
    }, 600, 'ease-out');
    this.props.AnimatedPageCounter.transitionTo(
      { opacity: 1 },
      400, 'linear');
    this.props.AnimatedNavTitle.transitionTo(
      { opacity: 1, translateY: 0 },
      400, 'linear');

    this.AnimatedText.transitionTo(
      { opacity: 1 },
      400, 'linear');
  }

  handleStoryAction = async (json: JSON) => {
    DeviceEventEmitter.emit('viewStory', {
      title: this.props.name,
      id: this.props.id,
      position: this.props.position
    });
    return this.props.navigator.showModal({
      stack: {
        children: [{
          component: {
            name: 'EngagementComp',
            options: {
              layout: {
                backgroundColor: 'transparent'
              },
              modalPresentationStyle: OptionsModalPresentationStyle.overCurrentContext,
              topBar: {
                visible: false,
                drawBehind: true
              },
              bottomTabs: {
                visible: false
              }
            },
            passProps: {
              json,
              backButton: true,
              language: this.context && this.context.language,
              name: this.props.name,
              id: this.props.id,
              animate: true,
              onBack: this.onBack,
              cardPosition: this.props.position
            }
          }
        }]
      }
    }).catch(err => console.log('EngagementhandleStoryAction SHOWMODAL error:', err));
  }

  // tslint:disable-next-line:cyclomatic-complexity
  onCardPress = async (): Promise<void> => {
    const { handleAction } = this.context;
    const { actions, story, storyGradient, storyType } = this.props;

    // if there is a story attached and either
    //    1) no actions object
    //    2) actions.type is null or 'story' (new default tappable cards)
    if (story &&
      (!actions || (actions && (actions.type === null || actions.type === 'story')))
    ) {

      if (!(story && story.tabbedItems && story.tabbedItems.length)) {
        this.AnimatedImage.transitionTo({
          scale: 1.2,
          opacity: 0.75
        }, 700, 'ease-out');
      }

      this.AnimatedText.transitionTo({
        opacity: 0
      }, 320, 'linear');

      this.props.AnimatedPageCounter.transitionTo(
        { opacity: 0 },
        400, 'linear');

      this.props.AnimatedNavTitle.transitionTo(
        { opacity: 0, translateY: -10 },
        400, 'linear');

      return this.handleStoryAction({
        ...story,
        storyGradient,
        storyType
      });
    } else if (actions && actions.type) {
      return handleAction(actions);
    }
  }

  onSwipeUp = async (): Promise<void> => {
    return this.onCardPress();
  }

  render(): JSX.Element {
    const {
      containerStyle,
      contents
    } = this.props;

    return (
      <GestureHandler
        onSwipe={this.onSwipeUp}
        setScrollEnabled={this.props.setScrollEnabled}
      >
        <TouchableOpacity
          style={containerStyle}
          onPress={this.onCardPress}
          activeOpacity={1}
        >
          <View
            accessibilityIgnoresInvertColors={true}
            style={[styles.fullScreen, { backgroundColor: '#000' }]}
          >
            <Animatable.Image
              source={contents.Image.source}
              ref={this.handleImageRef}
              useNativeDriver={false}
              style={[StyleSheet.absoluteFill, styles.fullScreen]}
            />
            <Animatable.View
              style={styles.bottom}
              ref={this.handleTextRef}
              useNativeDriver={false}
            >
              {this.props.isNew &&
                (
                <View
                  style={styles.newContainer}
                >
                  <Text
                    style={styles.newText}
                  >
                    {NEW}
                  </Text>
                </View>
                )}
              <TextBlock
                {...contents.Eyebrow}
              />
              <TextBlock
                {...contents.Headline}
              />
            </Animatable.View>
          </View>
        </TouchableOpacity>
      </GestureHandler>
    );
  }
}

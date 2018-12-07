// tslint:disable:jsx-use-translation-function
import React, { Component, ComponentClass, Fragment } from 'react';
import {
  Animated,
  DeviceEventEmitter,
  Dimensions,
  Image,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { EngagementService } from './EngagementService';
import PropTypes from 'prop-types';
import { Navigation } from 'react-native-navigation';
import {
  Action,
  BlockItem,
  ComponentList,
  EmitterProps,
  JSON,
  ScreenProps
 } from './types';
import EngagementWebView from './WebView';

Navigation.registerComponent('EngagementWebView', () => EngagementWebView);

const win = Dimensions.get('window');
const imageAspectRatio = 0.344;

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    zIndex: 10,
    top: 50,
    left: 8,
    padding: 12
  },
  backIcon: {
    width: 14,
    height: 25
  },
  emptyMessage: {
    textAlign: 'center',
    padding: 20
  },
  container: {
    backgroundColor: '#ffffff',
    flex: 1
  },
  growStretch: {
    alignSelf: 'stretch',
    flexGrow: 1
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 10
  },
  headerImage: {
    width: win.width,
    height: win.width * imageAspectRatio
  }
});

const gradientImage = require('../assets/images/gradient.png');
const backArrow = require('../assets/images/backArrow.png');

export interface EngagementScreenProps extends ScreenProps, EmitterProps {
  json: JSON;
  backButton?: boolean;
  noScrollView?: boolean;
  refreshControl?: () => void;
  isLoading: boolean;
}
export interface EngagementState {
  scrollY: Animated.Value;
}

export default function(
  api: EngagementService,
  layoutComponents: ComponentList
): ComponentClass<EngagementScreenProps> {
  return class EngagementComp extends Component<EngagementScreenProps, EngagementState> {
    static childContextTypes: any = {
      handleAction: PropTypes.func
    };

    state: any = {};
    constructor(props: EngagementScreenProps) {
      super(props);
      this.state = {
        scrollY: new Animated.Value(0)
      };
    }

    getChildContext = () => ({
      handleAction: this.handleAction
    })

    // tslint:disable-next-line:cyclomatic-complexity
    handleAction = (actions: Action) => {
      if (!(actions && actions.type && actions.value)) {
        return false;
      }
      DeviceEventEmitter.emit('viewLink', {
        title: actions.name,
        id: actions.id,
        type: actions.type,
        value: actions.value
      });
      api.logEvent('clickInboxCta', {
        messageId: actions.id,
        ctaType: actions.type,
        ctaValue: actions.value
      });
      switch (actions.type) {
        case 'blog-url':
          this.props.navigator.push({
            screen: 'EngagementWebView',
            navigatorStyle: {
              navBarHidden: true
            },
            passProps: {
              actions,
              isBlog: true,
              backButton: true
            }
          });
          break;
        case 'web-url':
          this.props.navigator.showModal({
            screen: 'EngagementWebView',
            passProps: { actions },
            navigatorStyle: {
              navBarBackgroundColor: '#f5f2ee',
              navBarButtonColor: '#866d4b',
              statusBarTextColorScheme: 'dark'
            },
            navigatorButtons: {
              rightButtons: [
                {
                  icon: require('../assets/images/closeBronze.png'),
                  id: 'close'
                }
              ]
            }
          });
          break;
        case 'deep-link':
          Linking.canOpenURL(actions.value).then(supported => {
            if (!supported) {
              alert('An error occurred: can\'t handle url ' + actions.value);
              return false;
            } else {
              return Linking.openURL(actions.value);
            }
          }).catch(err => alert('An error occurred: ' + err));
          break;
        case 'phone':
          Linking.openURL('tel:' + actions.value).catch(err => alert('An error occurred: ' + err));
          break;
        case 'email':
          let mailUrl = 'mailto:' + actions.value;
          if (actions.subject) {
            const subject = actions.subject.replace(/ /g, '%20');
            mailUrl += '?subject=' + subject;
          }
          if (actions.body) {
            const separator = ~mailUrl.indexOf('?') ? '&' : '?';
            const body = actions.body.replace(/ /g, '%20');
            mailUrl += separator + 'body=' + body;
          }
          Linking.openURL(mailUrl).catch(err =>
            alert('An error occurred when trying to send email to ' + actions.value + ': ' + err));
          break;
        default:
          break;
      }
      return;
    }

    onBackPress = (): void => {
      this.props.navigator.pop();
    }

    renderBlock = (item: BlockItem): JSX.Element | undefined => {
      const {
        private_blocks,
        private_type,
        ...restProps } = item;
      const { json, id, name } = this.props;
      const props = {
        id,
        name,
        ...restProps
      };

      if (!layoutComponents[private_type]) {
        return;
      }
      props.navigator = this.props.navigator;

      return React.createElement(
        layoutComponents[private_type],
        {
          ...props,
          storyGradient: props.story ? json.storyGradient : null,
          api,
          key: Math.floor(Math.random() * 1000000)
        },
        private_blocks && private_blocks.map(this.renderBlock)
      );
    }

    renderBlocks(): JSX.Element {
      const { json, json: { empty } } = this.props;
      return (
        <Fragment>
          {(json.private_blocks || []).map(this.renderBlock)}
          {empty && !(json.private_blocks && json.private_blocks.length) &&
            <Text style={[styles.emptyMessage, empty.textStyle]}>
              {empty.message || 'No content found.'}</Text>}
        </Fragment>
      );
    }

    renderScrollView(): JSX.Element {
      const { json: { storyGradient } } = this.props;
      const { scrollY } = this.state;
      if (this.props.noScrollView) {
        return (
          <Fragment>
            {this.renderBlocks()}
          </Fragment>
        );
      } else if (this.props.backButton && storyGradient && storyGradient.enabled) {
        const {
          startFadePosition = 0,
          endFadePosition = 250
        } = storyGradient;
        const headerOpacity = scrollY.interpolate({
          inputRange: [startFadePosition, endFadePosition],
          outputRange: [0, 1],
          extrapolate: 'clamp'
        });
        return (
          <Fragment>
            <ScrollView
              style={styles.growStretch}
              scrollEventThrottle={16}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }]
              )}
            >
              {this.renderBlocks()}
            </ScrollView>
            <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
              <Image
                style={styles.headerImage}
                source={gradientImage}
                resizeMode={'cover'}
              />
            </Animated.View>
          </Fragment>
        );
      }
      return (
        <ScrollView
          refreshControl={
            this.props.refreshControl && <RefreshControl
              refreshing={this.props.isLoading}
              onRefresh={this.props.refreshControl}
            />
          }
        >
          {this.renderBlocks()}
        </ScrollView>
      );
    }

    render(): JSX.Element {
      const { json } = this.props;
      return (
        <View style={styles.container}>
          {this.renderScrollView()}
          {this.props.backButton &&
            <TouchableOpacity onPress={this.onBackPress} style={styles.backButton}>
              <Image
                resizeMode='contain'
                source={backArrow}
                style={[styles.backIcon, json.backArrow]}
              />
            </TouchableOpacity>}
        </View>
      );
    }
  };
}

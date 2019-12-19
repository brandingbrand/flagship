// tslint:disable:jsx-use-translation-function
import React, { Component, ComponentClass, Fragment } from 'react';
import {
  ActivityIndicator,
  Animated,
  DeviceEventEmitter,
  Dimensions,
  FlatList,
  Image,
  Linking,
  ListRenderItem,
  Platform,
  RefreshControl,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
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
import EngagementProductModal from './EngagementProductModal';
import Carousel from 'react-native-snap-carousel';
import * as Animatable from 'react-native-animatable';

Navigation.registerComponent('EngagementWebView', () => EngagementWebView);
Navigation.registerComponent('EngagementProductModal', () => EngagementProductModal);

const win = Dimensions.get('window');
const imageAspectRatio = 0.344;
const WHITE_INBOX_WRAPPER = 'WhiteInboxWrapper';
const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    zIndex: 10,
    top: 50,
    left: 8,
    padding: 12
  },
  closeModalButton: {
    position: 'absolute',
    zIndex: 10,
    bottom: -60,
    left: (win.width / 2) - 35,
    padding: 0
  },
  growAndCenter: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  backIcon: {
    width: 14,
    height: 25
  },
  appleCloseIcon: {
    width: 60,
    height: 60
  },
  headerName: {
    fontFamily: 'HelveticaNeue-Bold',
    fontWeight: 'bold',
    color: '#000',
    fontSize: 26,
    marginBottom: 0,
    marginTop: 70,
    paddingHorizontal: 25
  },
  pageCounter: {
    position: 'absolute',
    top: 70,
    left: 20
  },
  pageNum: {
    color: '#ffffff',
    fontWeight: '500'
  },
  animatedContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    flex: 1
  },
  navBarTitle: {
    color: '#000000',
    fontSize: 14,
    textAlign: 'center',
    position: 'absolute',
    top: 60,
    width: '100%'
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
const appleCloseIcon = require('../assets/images/apple-close-icn.png');

export interface EngagementScreenProps extends ScreenProps, EmitterProps {
  json: JSON;
  backButton?: boolean;
  noScrollView?: boolean;
  navBarTitle?: string;
  renderType?: string;
  refreshControl?: () => void;
  isLoading: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  autoplayInterval?: number;
  containerStyle?: StyleProp<ViewStyle>;
  animateScroll?: boolean;
  onBack?: () => void;
  AnimatedImage?: any;
  welcomeHeader?: boolean;
  headerName?: string;
}
export interface EngagementState {
  scrollY: Animated.Value;
  pageNum: number;
  showCarousel: boolean;
  isClosingAnimation: boolean;
}

export default function(
  api: EngagementService,
  layoutComponents: ComponentList
): ComponentClass<EngagementScreenProps> {
  return class EngagementComp extends Component<EngagementScreenProps, EngagementState> {
    static childContextTypes: any = {
      handleAction: PropTypes.func,
      story: PropTypes.object
    };

    state: any = {};
    AnimatedStory: any;
    AnimatedAppleClose: any;
    AnimatedWelcome: any;
    scrollPosition: number = 0;
    flatListRef: any;
    constructor(props: EngagementScreenProps) {
      super(props);
      this.state = {
        scrollY: new Animated.Value(0),
        pageNum: 1,
        isLoading: true,
        showCarousel: false,
        isClosingAnimation: false
      };
    }

    handleAnimatedRef = (ref: any) => this.AnimatedStory = ref;
    handleWelcomeRef = (ref: any) => this.AnimatedWelcome = ref;
    handleAppleCloseRef = (ref: any) => this.AnimatedAppleClose = ref;
    componentDidMount(): void {
      if (this.props.animateScroll) {
        if (this.AnimatedStory) {
          this.AnimatedStory.transition(
            { translateY: 700 },
            { translateY: 0 },
            700, 'ease-out-cubic');
        }
        if (this.AnimatedAppleClose) {
          setTimeout(() => {
            this.AnimatedAppleClose.transition(
              { translateY: 0 },
              { translateY: -85 },
              800, 'ease-in-out-back');
          }, 300);
        }
      }
      if (!(this.props.json && this.props.json.private_type === 'story')) {
        setTimeout(() => {
          this.setState({ showCarousel: true });
        }, 700);
      }
    }
    componentDidUpdate(prevProps: EngagementScreenProps): void {
      const PRIVATE_BLOCKS = 'private_blocks';
      const prevBlocks = prevProps.json && prevProps.json[PRIVATE_BLOCKS] || [];
      const blocks = this.props.json && this.props.json[PRIVATE_BLOCKS] || [];

      if (!prevBlocks.length && blocks.length) {
        if (this.props.welcomeHeader && this.AnimatedWelcome) {
          this.AnimatedWelcome.transition(
            { translateY: -100 },
            { translateY: 0 },
            600, 'ease-out-cubic');
        }
      }
    }

    getChildContext = () => ({
      handleAction: this.handleAction,
      story: this.props.backButton ? this.props.json : null
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

    renderBlockItem: ListRenderItem<BlockItem> = ({ item, index }) => {
      item.index = index;
      if (this.props.animateScroll) {
        return this.renderBlockWrapper(item);
      }
      return this.renderBlock(item);
    }
    renderHeaderName = () => {
      const name = this.props.headerName || '';
      const comma = name ? ', ' : '';
      return (
        <Text style={styles.headerName}>
          HELLO{comma}{name.toUpperCase()}
        </Text>
      );
    }
    renderFlatlistFooter = () => {
      if (this.props.welcomeHeader) {
        return (
          <View
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0)',
              height: 20
            }}
          />
        );
      }
      if (!(this.props.animateScroll)) {
        return <View />;
      }
      return (
        <View
          style={{
            backgroundColor: '#fff',
            height: 100
          }}
        />
      );
    }
    // tslint:disable-next-line:cyclomatic-complexity
    renderFlatlistHeader = () => {
      if (!(this.props.animateScroll || this.props.welcomeHeader)) {
        return <View />;
      }

      const welcomeOpacity = this.state.scrollY.interpolate({
        inputRange: [0, 70],
        outputRange: [1, 0],
        extrapolate: 'clamp'
      });
      const welcomeFont = this.state.scrollY.interpolate({
        inputRange: [-70, 70],
        outputRange: [1.2, 0.8],
        extrapolate: 'clamp'
      });
      const welcomeY = this.state.scrollY.interpolate({
        inputRange: [0, 70],
        outputRange: [0, 50],
        extrapolate: 'clamp'
      });
      const welcomeX = this.state.scrollY.interpolate({
        inputRange: [-70, 70],
        outputRange: [30, -30],
        extrapolate: 'clamp'
      });

      if (this.props.welcomeHeader) {
        return (
          <Animatable.View
            ref={this.handleWelcomeRef}
            useNativeDriver
            style={{
              transform: [
                { translateY: -100 }
              ]
            }}
          >
            <Animated.View
              style={{
                opacity: welcomeOpacity,
                transform: [
                  { translateY: welcomeY },
                  { translateX: welcomeX },
                  { scale: welcomeFont }
                ]
              }}
            >
              {this.renderHeaderName()}
            </Animated.View>
          </Animatable.View>);
      }
      return (
        <View
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0)',
            height: 450
          }}
        />
      );
    }
    renderBlockWrapper = (item: BlockItem): React.ReactElement | null => {
      const {
        private_blocks,
        private_type,
        ...restProps } = item;
      const { id, name } = this.props;
      const props = {
        id,
        name,
        ...restProps
      };
      if (!layoutComponents[private_type]) {
        return null;
      }

      props.navigator = this.props.navigator;
      return React.createElement(
        layoutComponents[WHITE_INBOX_WRAPPER],
        {
          key: this.dataKeyExtractor(item)
        },
        this.renderBlock(item)
      );
    }
    renderBlock = (item: BlockItem): React.ReactElement | null => {
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
        return null;
      }

      props.navigator = this.props.navigator;
      return React.createElement(
        layoutComponents[private_type],
        {
          ...props,
          storyGradient: props.story ? json.storyGradient : null,
          api,
          key: this.dataKeyExtractor(item)
        },
        private_blocks && private_blocks.map(this.renderBlock)
      );
    }
    scrollToTop = () => {
      this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
    }
    onAnimatedClose = (): void => {
      if (this.state.isClosingAnimation) { return; }
      this.setState({
        isClosingAnimation: true
      });
      const timeout = this.scrollPosition < 1400 ?
        this.scrollPosition / 7 : 200;
      const outYPositon = 700;
      if (this.scrollPosition > 0) {
        this.scrollToTop();
      }

      if (this.AnimatedAppleClose) {
        this.AnimatedAppleClose.transition(
          { translateY: -85 },
          { translateY: 0 },
          500, 'ease-in-out-back');
      }

      setTimeout(() => {
        if (this.AnimatedStory) {
          this.AnimatedStory.transitionTo(
            { translateY: outYPositon },
            timeout + 550, 'ease-out');
        }

        if (this.props.onBack) {
          this.props.onBack();
        }
      }, timeout);
      setTimeout(() => {
        this.props.navigator.dismissModal();
      }, 550);
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

    renderStoryGradient(): JSX.Element {
      const { json: { storyGradient } } = this.props;
      const { scrollY } = this.state;
      const empty: any = this.props.json.empty || {};
      const {
        startFadePosition = 0,
        endFadePosition = 250
      } = storyGradient || {};
      const headerOpacity = scrollY.interpolate({
        inputRange: [startFadePosition, endFadePosition],
        outputRange: [0, 1],
        extrapolate: 'clamp'
      });
      return (
        <Fragment>
          <FlatList
            data={this.props.json.private_blocks || []}
            renderItem={this.renderBlockItem}
            ListEmptyComponent={(
              <Text style={[styles.emptyMessage, empty.textStyle]}>
                {empty.message || 'No content found.'}</Text>
            )}
            style={styles.growStretch}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }]
            )}
          >
            {this.renderBlocks()}
          </FlatList>
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

    onScrollFlatList = (event: any) => {
      this.scrollPosition = event.nativeEvent.contentOffset.y;
      if (this.scrollPosition < -40) {
        this.onAnimatedClose();
      }
    }
    onSnapToItem = (index: number): void => {
      const pageNum = index + 1;
      this.setState({
        pageNum
      });
    }
    // tslint:disable-next-line:cyclomatic-complexity
    renderScrollView(): JSX.Element {
      const { json, json: { storyGradient } } = this.props;
      const empty: any = this.props.json.empty || {};

      if (this.props.renderType && this.props.renderType === 'carousel') {
        const autoplay = this.props.autoplay || false;
        const autoplayDelay = this.props.autoplayDelay || 1000;
        const autoplayInterval = this.props.autoplayInterval || 3000;
        return (
          <Fragment>
            {empty && !(json.private_blocks && json.private_blocks.length) &&
              <Text style={[styles.emptyMessage, empty.textStyle]}>
                {empty.message || 'No content found.'}</Text>}

            {this.state.showCarousel && <Carousel
              data={json.private_blocks || []}
              layout={'default'}
              autoplay={autoplay}
              autoplayDelay={autoplayDelay}
              autoplayInterval={autoplayInterval}
              sliderWidth={Dimensions.get('screen').width}
              itemWidth={Dimensions.get('screen').width}
              renderItem={this.renderBlockItem}
              inactiveSlideOpacity={1}
              inactiveSlideScale={1}
              onSnapToItem={this.onSnapToItem}
              useScrollView={Platform.OS === 'ios' ? true : false}
            />}
            {!this.state.showCarousel && <ActivityIndicator style={styles.growAndCenter} />}
            {(json.private_blocks && json.private_blocks.length) &&
              <View style={[styles.pageCounter, json.pageCounterStyle]}>
                <Text
                  style={[styles.pageNum, json.pageNumberStyle]}
                >
                  {this.state.pageNum} / {json.private_blocks.length}
                </Text>
              </View>
            }
          </Fragment>
        );
      } else if (this.props.noScrollView) {
        return (
          <Fragment>
            {this.renderBlocks()}
          </Fragment>
        );
      } else if (this.props.backButton && storyGradient && storyGradient.enabled) {
        return this.renderStoryGradient();
      } else if (this.props.welcomeHeader) {
        return (
          <Fragment>
            <Animated.FlatList
              data={this.props.json.private_blocks || []}
              keyExtractor={this.dataKeyExtractor}
              renderItem={this.renderBlockItem}
              scrollEventThrottle={16}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
                { useNativeDriver: true }
              )}
              ListHeaderComponent={this.renderFlatlistHeader}
              ListFooterComponent={this.renderFlatlistFooter}
              ListEmptyComponent={(
                <Text style={[styles.emptyMessage, empty.textStyle]}>
                  {empty.message || 'No content found.'}</Text>
              )}
              refreshControl={
                this.props.refreshControl && <RefreshControl
                  refreshing={this.props.isLoading}
                  onRefresh={this.props.refreshControl}
                />
              }
            >
              {this.renderBlocks()}
            </Animated.FlatList>
          </Fragment>
        );
      }
      return (
        <Fragment>
          <FlatList
            data={this.props.json.private_blocks || []}
            keyExtractor={this.dataKeyExtractor}
            renderItem={this.renderBlockItem}
            ref={(ref: any) => { this.flatListRef = ref; }}
            onScroll={this.onScrollFlatList}
            ListHeaderComponent={this.renderFlatlistHeader}
            ListFooterComponent={this.renderFlatlistFooter}
            ListEmptyComponent={(
              <Text style={[styles.emptyMessage, empty.textStyle]}>
                {empty.message || 'No content found.'}</Text>
            )}
            refreshControl={
              this.props.refreshControl && <RefreshControl
                refreshing={this.props.isLoading}
                onRefresh={this.props.refreshControl}
              />
            }
          >
            {this.renderBlocks()}
          </FlatList>
        </Fragment>

      );
    }

    render(): JSX.Element {
      const { animateScroll, backButton, containerStyle, json, navBarTitle } = this.props;
      if (animateScroll) {
        return (
          <Fragment>
            <Animatable.View
              ref={this.handleAnimatedRef}
              useNativeDriver
              style={[styles.animatedContainer]}
            >
              {this.renderScrollView()}
            </Animatable.View>
            {backButton &&
              <Animatable.View
                ref={this.handleAppleCloseRef}
                useNativeDriver
                style={styles.closeModalButton}
              >
                <TouchableOpacity activeOpacity={1} onPress={this.onAnimatedClose}>
                  <Image
                    resizeMode='contain'
                    source={appleCloseIcon}
                    style={styles.appleCloseIcon}
                  />
                </TouchableOpacity>
              </Animatable.View>}
          </Fragment>
        );
      }
      return (
        <View style={[styles.container, containerStyle]}>
          {this.renderScrollView()}
          {backButton &&
            <TouchableOpacity onPress={this.onBackPress} style={styles.backButton}>
              <Image
                resizeMode='contain'
                source={backArrow}
                style={[styles.backIcon, json.backArrow]}
              />
            </TouchableOpacity>}
          {navBarTitle &&
            <Text
              style={[styles.navBarTitle, json.navBarTitleStyle]}
            >
              {navBarTitle}
            </Text>}
        </View>
      );
    }

    dataKeyExtractor = (item: BlockItem): string => {
      return item.id || item.key || Math.floor(Math.random() * 1000000).toString();
    }
  };
}

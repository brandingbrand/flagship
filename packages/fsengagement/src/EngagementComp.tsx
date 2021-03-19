// tslint:disable:jsx-use-translation-function
import React, { Component, ComponentClass, Fragment } from 'react';
import {
  ActivityIndicator,
  Animated,
  DeviceEventEmitter,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  ListRenderItem,
  Platform,
  RefreshControl,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { Navigator } from '@brandingbrand/fsapp';
import { EngagementService } from './EngagementService';
import TabbedStory from './inboxblocks/TabbedStory';
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
import { debounce } from 'lodash-es';

Navigation.registerComponent('EngagementWebView', () => EngagementWebView);
Navigation.registerComponent('EngagementProductModal', () => EngagementProductModal);

const win = Dimensions.get('window');
const imageAspectRatio = 0.344;
const WHITE_INBOX_WRAPPER = 'WhiteInboxWrapper';
const INBOX_WRAPPER = 'InboxWrapper';
const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    zIndex: 10,
    top: 50,
    left: 8,
    padding: 12
  },
  animatedClose: {
    position: 'absolute',
    zIndex: 10,
    top: Platform.OS === 'ios' ? 44 : 64,
    left: 19,
    padding: 0
  },
  animatedList: {
    marginBottom: 100,
    marginTop: -100,
    backgroundColor: 'rgba(255, 255, 255, 0)'
  },
  fullScreen: {
    width: Dimensions.get('screen').width + 45,
    height: Dimensions.get('screen').height + 60
  },
  backIconCloseX: {
    width: 44,
    height: 44
  },
  animatedContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    flex: 1
  },
  progressBar: {
    position: 'absolute',
    flexDirection: 'row',
    top: 67,
    flex: 1,
    marginLeft: 65,
    marginRight: 33
  },
  progressItem: {
    flex: 1,
    marginHorizontal: 3,
    backgroundColor: 'rgba(79, 79, 79, .3)',
    height: 2
  },
  activeProgress: {
    backgroundColor: 'rgba(79, 79, 79, .8)'
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
  editorial: {
    marginTop: 0,
    backgroundColor: 'transparent'
  },
  backIcon: {
    width: 14,
    height: 25
  },
  appleCloseIcon: {
    width: 60,
    height: 60
  },
  fullScreenDeeplink: {
    width: Dimensions.get('screen').width + 45,
    height: Dimensions.get('screen').height + 60,
    backgroundColor: '#000',
    overflow: 'hidden'
  },
  headerName: {
    fontFamily: 'HelveticaNeue-Bold',
    textTransform: 'uppercase',
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
  },
  imageStyle: {
    transform: [{ scale: 1.06 }],
    opacity: 0.8,
    marginTop: 20
  },
  deeplinkStory: {
    marginTop: -(Dimensions.get('screen').height + 60)
  },
  storyFooter: {
    marginBottom: -35,
    height: 40,
    backgroundColor: '#fff'
  }
});

const gradientImage = require('../assets/images/gradient.png');
const backArrow = require('../assets/images/backArrow.png');
const appleCloseIcon = require('../assets/images/apple-close-icn.png');
const iconCloseXLight = require('../assets/images/iconCloseXLight.png');
const iconCloseXDark = require('../assets/images/iconCloseXDark.png');

const topOffset = Platform.OS === 'ios' ? -40 : 1;

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
  storyType?: string;
  tabbedItems?: any[];
  lastUpdate?: number;
  containerStyle?: StyleProp<ViewStyle>;
  animateScroll?: boolean;
  onBack?: () => void;
  language?: string;
  AnimatedImage?: any;
  welcomeHeader?: boolean;
  headerName?: string;
  animate?: boolean;
  cardPosition?: number;
  navigator: Navigator;
  renderHeader?: () => void;
}
export interface EngagementState {
  scrollY: Animated.Value;
  pageNum: number;
  showCarousel: boolean;
  isClosingAnimation: boolean;
  showDarkX: boolean;
  slideBackground: boolean;
  activeProgressBarIndex: number;
  scrollEnabled: boolean;
}

export default function(
  api: EngagementService,
  layoutComponents: ComponentList
): ComponentClass<EngagementScreenProps> {
  return class EngagementComp extends Component<EngagementScreenProps, EngagementState> {
    static childContextTypes: any = {
      handleAction: PropTypes.func,
      story: PropTypes.object,
      language: PropTypes.string,
      cardPosition: PropTypes.number
    };

    state: any = {};
    AnimatedStory: any;
    AnimatedCloseIcon: any;
    flatListRef: any;
    AnimatedPageCounter: any;
    AnimatedNavTitle: any;
    pageCounterStyle: StyleProp<ViewStyle>;
    pageNumberStyle: StyleProp<TextStyle>;
    cardMove: any;
    scrollPosition: number = 0;
    AnimatedAppleClose: any;
    AnimatedWelcome: any;
    componentIsMounted: boolean = false;

    constructor(props: EngagementScreenProps) {
      super(props);
      this.state = {
        scrollY: new Animated.Value(0),
        pageNum: 1,
        isLoading: true,
        showCarousel: false,
        showDarkX: false,
        slideBackground: false,
        isClosingAnimation: false,
        activeProgressBarIndex: 0,
        scrollEnabled: true
      };
    }

    handleCloseIconRef = (ref: any) => this.AnimatedCloseIcon = ref;
    handleAnimatedRef = (ref: any) => this.AnimatedStory = ref;
    handlePageCounterRef = (ref: any) => this.AnimatedPageCounter = ref;
    handleNavTitleRef = (ref: any) => this.AnimatedNavTitle = ref;
    handleWelcomeRef = (ref: any) => this.AnimatedWelcome = ref;
    handleAppleCloseRef = (ref: any) => this.AnimatedAppleClose = ref;
    componentWillUnmount(): void {
      // Check if closing because of navigation change or ui
      if (!this.state.isClosingAnimation) {
        // If navigation change also try to return back out of the story
        if (this.props.onBack) {
          this.props.onBack();
        }
      }

      this.componentIsMounted = false;
    }
    componentDidMount(): void {
      this.componentIsMounted = true;

      if (this.props.animate) {
        if (this.props.json && this.props.json.tabbedItems && this.props.json.tabbedItems.length) {
          this.setState({ showDarkX: true });
        }
        this.AnimatedStory.transition(
          { translateY: 700 },
          { translateY: 100 },
          700, 'ease-out-cubic');
        this.AnimatedCloseIcon.transition(
          { opacity: 0 },
          { opacity: 1 },
          400, 'linear');
      }
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
          if (this.componentIsMounted) {
            this.setState({ showCarousel: true });
          }
        }, 500);
      }
    }
    scrollToTop = () => {
      this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
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
      story: this.props.backButton ? this.props.json : null,
      language: this.props.language,
      cardPosition: this.props.cardPosition || 0
    })

    // tslint:disable-next-line:cyclomatic-complexity member-ordering typedef
    handleAction = debounce(async (actions: Action) => {
      if (!(actions && actions.type && actions.value)) {
        return false;
      }
      DeviceEventEmitter.emit('viewLink', {
        title: actions.name,
        id: actions.id,
        type: actions.type,
        value: actions.value,
        position: actions.position
      });
      switch (actions.type) {
        case 'blog-url':
          await this.props.navigator.push({
            component: {
              name: 'EngagementWebView',
              options: {
                topBar: {
                  visible: false
                }
              },
              passProps: {
                actions,
                isBlog: true,
                backButton: true
              }
            }
          });
          break;
        case 'web-url':
          await this.props.navigator.showModal({
            component: {
              name: 'EngagementWebView',
              passProps: { actions },
              options: {
                statusBar: {
                  style: 'dark' as 'dark'
                },
                topBar: {
                  background: { color: '#f5f2ee'},
                  rightButtons: [{
                    color: '#866d4b',
                    icon: require('../assets/images/closeBronze.png'),
                    id: 'close'
                  }]
                }
              }
            }
          });
          break;
        case 'deep-link':
          const separator = ~actions.value.indexOf('?') ? '&' : '?';
          const query = separator + 'engagementDeeplink=true';
          const url = actions.value + query;
          Linking.canOpenURL(actions.value).then(supported => {
            if (!supported) {
              alert('An error occurred: can\'t handle url ' + url);
              return false;
            } else {
              return Linking.openURL(url);
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
    }, 300);

    onBackPress = async (): Promise<void> => {
      return this.props.navigator.pop();
    }

    renderBlockItem: ListRenderItem<BlockItem> = ({ item, index }) => {
      item.index = index;
      if (this.props.animate || (this.props.json && this.props.json.fullScreenCardImage)) {
        item.wrapper = true;
        item.animateIndex = index;
      }
      if (this.props.renderType && this.props.renderType === 'carousel') {
        item.fullScreenCard = true;
        item.position = index + 1;
      }
      if (this.props.animateScroll) {
        return this.renderBlockWrapper(item);
      }
      return this.renderBlock(item);
    }
    renderHeaderName = () => {
      const { json, headerName } = this.props;
      const name = headerName || '';
      const headerTitleStyle = json && json.headerTitleStyle || {};
      const comma = name ? ', ' : '';
      return (
        <Text style={[styles.headerName, headerTitleStyle]}>
          Hello{comma}{name}
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
      if (!(this.props.animateScroll || this.props.welcomeHeader) || this.props.renderHeader) {
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
            useNativeDriver={false}
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
          </Animatable.View>
        );
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
      const { private_type } = item;
      if (!layoutComponents[private_type]) {
        return null;
      }

      return React.createElement(
        layoutComponents[WHITE_INBOX_WRAPPER],
        {
          key: this.dataKeyExtractor(item),
          navigator: this.props.navigator
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
      if (item.fullScreenCard) {
        delete item.fullScreenCard;
        props.AnimatedPageCounter = this.AnimatedPageCounter;
        props.AnimatedNavTitle = this.AnimatedNavTitle;
        props.setScrollEnabled = this.setScrollEnabled;
      }
      if (item.animateIndex) {
        props.animateIndex = item.animateIndex;
        props.onBack = this.onAnimatedClose;
      }
      if (item.wrapper) {
        delete item.wrapper;
        return React.createElement(
          layoutComponents[INBOX_WRAPPER],
          {
            key: this.dataKeyExtractor(item),
            animateIndex: item.animateIndex,
            navigator: this.props.navigator,
            slideBackground: item.animateIndex && item.animateIndex <= 2 ?
              this.state.slideBackground : false
          },
          this.renderBlock(item)
        );
      }
      return React.createElement(
        layoutComponents[private_type],
        {
          ...props,
          navigator: this.props.navigator,
          storyGradient: props.story ? json.storyGradient : null,
          api,
          key: this.dataKeyExtractor(item)
        },
        private_blocks && private_blocks.map(this.renderBlock)
      );
    }
    onAnimatedClose = (): void => {
      if (this.state.isClosingAnimation) { return; }
      this.setState({
        isClosingAnimation: true
      });
      const { json } = this.props;
      const tabbedItems = json && json.tabbedItems;
      const timeout = this.scrollPosition < 1400 ?
        this.scrollPosition / 7 : 200;
      const outYPositon = tabbedItems && tabbedItems.length ? 1020 : 700;
      if (this.scrollPosition > 0) {
        this.scrollToTop();
      }
      setTimeout(() => {
        if (this.AnimatedCloseIcon) {
          this.AnimatedCloseIcon.transition(
            { opacity: 1 },
            { opacity: 0 },
            400, 'linear');
        }
      }, 200);

      if (this.AnimatedAppleClose) {
        this.AnimatedAppleClose.transition(
          { translateY: -85 },
          { translateY: 0 },
          500, 'ease-in-out-back');
      }

      setTimeout(() => {
        if (this.AnimatedStory) {
          if (this.props.renderType && this.props.renderType === 'carousel') {
            this.AnimatedStory.transition(
              { translateY: 100 },
              { translateY: outYPositon },
              timeout + 550, 'ease-out');
          } else {
            this.AnimatedStory.transitionTo(
              { translateY: outYPositon },
              timeout + 550, 'ease-out');
          }
        }
        if (this.props.onBack) {
          this.props.onBack();
        }
      }, timeout);
      setTimeout(async () => {
        return this.props.navigator.dismissModal();
      }, 550);
    }
    setScrollEnabled = (enabled: boolean): void => {
      this.setState({
        scrollEnabled: enabled
      });
    }
    renderBlocks(): JSX.Element {
      const { json } = this.props;
      const empty: any = json && json.empty || {};
      return (
        <Fragment>
          {(json && json.private_blocks || []).map(this.renderBlock)}
          {empty && !(json && json.private_blocks && json.private_blocks.length) && (
            <Text style={[styles.emptyMessage, empty.textStyle]}>
              {empty.message || 'No content found.'}</Text>
          )}
        </Fragment>
      );
    }
    // tslint:disable-next-line:cyclomatic-complexity
    renderStoryGradient(): JSX.Element {
      const { json: { storyGradient, tabbedItems } } = this.props;
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
      if (tabbedItems && tabbedItems.length) {
        return (
          <TabbedStory
            items={tabbedItems}
            activeIndex={this.state.activeProgressBarIndex}
            onCardPress={this.onTabbedCardPress}
          />
        );
      } else if (this.props.animate) {
        return (
          <FlatList
            data={this.props.json && this.props.json.private_blocks || []}
            keyExtractor={this.dataKeyExtractor}
            renderItem={this.renderBlockItem}
            ref={ref => { this.flatListRef = ref; }}
            style={[styles.growStretch, styles.animatedList]}
            onScroll={this.onScrollFlatList}
            ListEmptyComponent={(
              <Text style={[styles.emptyMessage, empty && empty.textStyle]}>
                {empty && empty.message || 'No content found.'}</Text>
            )}
          >
            {this.renderBlocks()}
          </FlatList>
        );
      }
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
    onTabbedCardPress = () => {
      const { json } = this.props;
      if (json.tabbedItems &&
        (this.state.activeProgressBarIndex >= (json.tabbedItems.length - 1))) {
        this.onAnimatedClose();
      } else {
        this.setState({
          activeProgressBarIndex: this.state.activeProgressBarIndex + 1
        });
      }
    }
    // tslint:disable-next-line:cyclomatic-complexity
    renderContent(): JSX.Element {
      const { animate, animateScroll, backButton, containerStyle, json } = this.props;
      if (animateScroll) {
        return (
          <Fragment>
            <Animatable.View
              ref={this.handleAnimatedRef}
              useNativeDriver={false}
              style={[styles.animatedContainer]}
            >
              {this.renderScrollView()}
            </Animatable.View>
            {backButton && (
              <Animatable.View
                ref={this.handleAppleCloseRef}
                useNativeDriver={false}
                style={styles.closeModalButton}
              >
                <TouchableOpacity activeOpacity={1} onPress={this.onAnimatedClose}>
                  <Image
                    resizeMode='contain'
                    source={appleCloseIcon}
                    style={styles.appleCloseIcon}
                  />
                </TouchableOpacity>
              </Animatable.View>
            )}
          </Fragment>
        );
      }
      if (animate) {
        return (
          <Fragment>
            <Animatable.View
              ref={this.handleAnimatedRef}
              useNativeDriver={false}
              style={[styles.animatedContainer]}
            >
              {this.renderScrollView()}
            </Animatable.View>
            {(json && json.tabbedItems && json.tabbedItems.length) &&
              (
              <View style={styles.progressBar}>
                {(json.tabbedItems || []).map((item: any, index: number) => {
                  return (
                    <View
                      key={item.key}
                      style={[
                        styles.progressItem,
                        (this.state.activeProgressBarIndex === index) && styles.activeProgress
                      ]}
                    />
                  );
                })}
              </View>
              )}
            {backButton &&
              (
              <TouchableOpacity
                onPress={this.onAnimatedClose}
                style={styles.animatedClose}
                activeOpacity={1}
              >
                <Animatable.Image
                  resizeMode='contain'
                  ref={this.handleCloseIconRef}
                  source={this.state.showDarkX ? iconCloseXDark : iconCloseXLight}
                  style={[styles.backIconCloseX]}
                />
              </TouchableOpacity>
              )}
          </Fragment>
        );
      }
      return (
        <View style={[styles.container, containerStyle]}>
          {this.renderScrollView()}
          {backButton &&
            (
            <TouchableOpacity onPress={this.onBackPress} style={styles.backButton}>
              <Image
                resizeMode='contain'
                source={backArrow}
                style={[styles.backIcon, json.backArrow]}
              />
            </TouchableOpacity>
            )}
        </View>
      );
    }

    onScrollFlatList = (event: any) => {
      this.scrollPosition = event.nativeEvent.contentOffset.y;
      if (this.scrollPosition < topOffset) {
        this.onAnimatedClose();
      }
    }
    onSnapToItem = (index: number): void => {
      const pageNum = index + 1;
      if (this.props.json && this.props.json.private_blocks &&
        this.props.json.private_blocks.length && this.props.json.private_blocks[index]) {
        DeviceEventEmitter.emit('swipeCard', {
          title: this.props.json.private_blocks[index].name,
          id: this.props.json.private_blocks[index].id,
          position: pageNum
        });
      }
      this.setState({
        pageNum
      });
    }
    renderFlatlistFooterPadding = (): JSX.Element => {
      return (
        <View style={styles.storyFooter} />
      );
    }
    // tslint:disable-next-line:cyclomatic-complexity
    renderScrollView(): JSX.Element {
      const { json } = this.props;
      const storyGradient = json && json.storyGradient;
      const tabbedItems = json && json.tabbedItems;
      const empty: any = json && json.empty || {};
      const fullScreenCardImage = json && json.fullScreenCardImage;

      if (this.props.renderType && this.props.renderType === 'carousel') {
        const autoplay = this.props.autoplay || false;
        const autoplayDelay = this.props.autoplayDelay || 1000;
        const autoplayInterval = this.props.autoplayInterval || 3000;
        return (
          <Fragment>
            {empty && !(json && json.private_blocks && json.private_blocks.length) && (
              <Text style={[styles.emptyMessage, empty && empty.textStyle]}>
                {empty && empty.message || 'No content found.'}</Text>
            )}

            {this.state.showCarousel && (
              <Carousel
                data={json && json.private_blocks || []}
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
              />
            )}
            {!this.state.showCarousel && <ActivityIndicator style={styles.growAndCenter} />}
          </Fragment>
        );
      } else if (fullScreenCardImage) {
        return (
          <Fragment>
            <ImageBackground
              source={fullScreenCardImage}
              imageStyle={styles.imageStyle}
              style={styles.fullScreenDeeplink}
            />
            <FlatList
              data={this.props.json && this.props.json.private_blocks || []}
              keyExtractor={this.dataKeyExtractor}
              renderItem={this.renderBlockItem}
              style={[styles.growStretch, styles.deeplinkStory]}
              ListFooterComponent={this.renderFlatlistFooterPadding}
              ListEmptyComponent={(
                <Text style={[styles.emptyMessage, empty && empty.textStyle]}>
                  {empty && empty.message || 'No content found.'}</Text>
              )}
              refreshControl={
                this.props.refreshControl && (
                  <RefreshControl
                    refreshing={this.props.isLoading}
                    onRefresh={this.props.refreshControl}
                  />
                )
              }
            >
              {this.renderBlocks()}
            </FlatList>
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
      } else if (tabbedItems && tabbedItems.length) {
        return (
          <TabbedStory
            items={tabbedItems}
            activeIndex={this.state.activeProgressBarIndex}
            onCardPress={this.onTabbedCardPress}
          />
        );
      } else if (this.props.welcomeHeader) {
        return (
          <Fragment>
            <Animated.FlatList
              data={this.props.json && this.props.json.private_blocks || []}
              keyExtractor={this.dataKeyExtractor}
              renderItem={this.renderBlockItem}
              scrollEventThrottle={16}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
                { useNativeDriver: false }
              )}
              ListHeaderComponent={this.renderFlatlistHeader}
              ListFooterComponent={this.renderFlatlistFooter}
              ListEmptyComponent={(
                <Text style={[styles.emptyMessage, empty && empty.textStyle]}>
                  {empty && empty.message || 'No content found.'}</Text>
              )}
              refreshControl={
                this.props.refreshControl && (
                <RefreshControl
                  refreshing={this.props.isLoading}
                  onRefresh={this.props.refreshControl}
                />
              )}
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
              this.props.refreshControl && (
              <RefreshControl
                refreshing={this.props.isLoading}
                onRefresh={this.props.refreshControl}
              />
            )}
          >
            {this.renderBlocks()}
          </FlatList>
        </Fragment>

      );
    }

    // tslint:disable-next-line:cyclomatic-complexity
    render(): JSX.Element {
      const { json, navBarTitle } = this.props;
      this.pageCounterStyle =
        json && json.pageCounterStyle ? json.pageCounterStyle : this.pageCounterStyle;
      this.pageNumberStyle =
        json && json.pageNumberStyle ? json.pageNumberStyle : this.pageNumberStyle;
      const navBarTitleStyle = json && json.navBarTitleStyle || {};

      return (
        <Fragment>
          {this.props.renderHeader && this.props.renderHeader()}
          {this.renderContent()}
          {(this.props.renderType && this.props.renderType === 'carousel' &&
            json && json.private_blocks && json.private_blocks.length > 0) &&
            (
              <Animatable.View
                ref={this.handlePageCounterRef}
                useNativeDriver={false}
                style={[styles.pageCounter, this.pageCounterStyle]}
              >
                <Text
                  style={[styles.pageNum, this.pageNumberStyle]}
                >
                  {this.state.pageNum} / {json.private_blocks.length}
                </Text>
              </Animatable.View>
            )
          }
          {navBarTitle && (
            <Animatable.Text
              style={[styles.navBarTitle, navBarTitleStyle]}
              ref={this.handleNavTitleRef}
              useNativeDriver={false}
            >
              {navBarTitle}
            </Animatable.Text>
          )}
        </Fragment>
      );
    }

    dataKeyExtractor = (item: BlockItem): string => {
      return item.id || item.key || Math.floor(Math.random() * 1000000).toString();
    }
  };
}

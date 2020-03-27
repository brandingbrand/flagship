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
import { EngagementService } from './EngagementService';
import TabbedStory from './inboxblocks/TabbedStory';
import PropTypes from 'prop-types';
import { Navigation } from 'react-native-navigation';
import * as Animatable from 'react-native-animatable';
import {
  Action,
  BlockItem,
  ComponentList,
  EmitterProps,
  JSON,
  ScreenProps
} from './types';
import EngagementWebView from './WebView';
import Carousel from 'react-native-snap-carousel';
import { debounce } from 'lodash-es';

Navigation.registerComponent('EngagementWebView', () => EngagementWebView);

const win = Dimensions.get('window');
const imageAspectRatio = 0.344;
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
  growAndCenter: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  fullScreen: {
    width: Dimensions.get('screen').width + 45,
    height: Dimensions.get('screen').height + 60
  },
  fullScreenDeeplink: {
    width: Dimensions.get('screen').width + 45,
    height: Dimensions.get('screen').height + 60,
    backgroundColor: '#000',
    overflow: 'hidden'
  },
  backIcon: {
    width: 14,
    height: 25
  },
  backIconCloseX: {
    width: 44,
    height: 44
  },
  pageCounter: {
    position: 'absolute',
    top: 70,
    left: 20
  },
  editorial: {
    marginTop: 0,
    backgroundColor: 'transparent'
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
  animatedContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
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
const iconCloseXLight = require('../assets/images/iconCloseXLight.png');
const iconCloseXDark = require('../assets/images/iconCloseXDark.png');

// Offset for swipe up, android is always >=0
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
  animate?: boolean;
  onBack?: () => void;
  language?: string;
  cardPosition?: number;
}
export interface EngagementState {
  scrollY: Animated.Value;
  pageNum: number;
  showCarousel: boolean;
  showDarkX: boolean;
  slideBackground: boolean;
  activeProgressBarIndex: number;
  isClosingAnimation: boolean;
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

    constructor(props: EngagementScreenProps) {
      super(props);
      this.state = {
        scrollY: new Animated.Value(0),
        pageNum: 1,
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

    componentDidMount(): void {
      if (this.props.animate) {
        if (this.props.json && this.props.json.tabbedItems && this.props.json.tabbedItems.length) {
          this.setState({ showDarkX: true });
        }
        this.AnimatedStory.transition(
          { translateY: 700},
          { translateY: 100 },
          700, 'ease-out-cubic');
        this.AnimatedCloseIcon.transition(
          { opacity: 0 },
          { opacity: 1 },
          400, 'linear');

      }
      if (!(this.props.json && this.props.json.private_type === 'story')) {
        setTimeout(() => {
          this.setState({ showCarousel: true });
        }, 500);
      }
    }
    scrollToTop = () => {
      this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
    }

    getChildContext = () => ({
      handleAction: this.handleAction,
      story: this.props.backButton ? this.props.json : null,
      language: this.props.language,
      cardPosition: this.props.cardPosition || 0
    })

    // tslint:disable-next-line: cyclomatic-complexity member-ordering typedef
    handleAction = debounce((actions: Action) => {
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
          Navigation.push(this.props.componentId, {
            component: {
              name: 'EngagementWebView',
              options: {
                topBar: {
                  visible: false,
                  drawBehind: true
                }
              },
              passProps: {
                actions,
                isBlog: true,
                backButton: true
              }
            }
          }).catch(err => console.log('EngagementWebView PUSH error:', err));
          break;
        case 'web-url':
          Navigation.showModal({
            component: {
              name: 'EngagementWebView',
              options: {
                topBar: {
                  background: {
                    color: '#f5f2ee'
                  },
                  rightButtons: [
                    {
                      id: 'close',
                      icon: require('../assets/images/closeBronze.png')
                    }
                  ],
                  leftButtonColor: '#866d4b',
                  rightButtonColor: '#866d4b',
                  backButton: {
                    color: 'red'
                  }
                },
                statusBar: {
                  style: 'dark'
                }
              },
              passProps: { actions }
            }
          }).catch(err => console.log('EngagementWebView SHOWMODAL error:', err));
          break;
        case 'deep-link':
          const separator = ~actions.value.indexOf('?') ? '&' : '?';
          const componentId = this.props.componentId;
          const query = separator + 'engagementDeeplink=true&componentId=' + componentId;
          const url = actions.value + query;
          Linking.canOpenURL(url).then(supported => {
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
        this.AnimatedCloseIcon.transition(
          { opacity: 1 },
          { opacity: 0 },
          400, 'linear');
      }, 200);

      setTimeout(() => {
        this.AnimatedStory.transition(
          { translateY: 100 },
          { translateY: outYPositon },
          timeout + 550, 'ease-out');
        if (this.props.onBack) {
          this.props.onBack();
        }
      }, timeout);
      setTimeout(() => {
        Navigation.dismissModal(this.props.componentId)
          .catch(err => console.log('onBackPress dismissModal error:', err));
      }, 800);
    }

    setScrollEnabled = (enabled: boolean): void => {
      this.setState({
        scrollEnabled: enabled
      });
    }

    onBackPress = (): void => {
      Navigation.pop(this.props.componentId)
        .catch(err => console.log('onBackPress POP error:', err));
    }

    renderBlockItem: ListRenderItem<BlockItem> = ({ item, index }) => {
      if (this.props.animate || (this.props.json && this.props.json.fullScreenCardImage)) {
        item.wrapper = true;
        item.animateIndex = index;
      }
      if (this.props.renderType && this.props.renderType === 'carousel') {
        item.fullScreenCard = true;
        item.position = index + 1;
      }
      return this.renderBlock(item);
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
      props.componentId = this.props.componentId;

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
          storyGradient: props.story ? json.storyGradient : null,
          api,
          key: this.dataKeyExtractor(item)
        },
        private_blocks && private_blocks.map(this.renderBlock)
      );
    }

    renderBlocks(): JSX.Element {
      const { json } = this.props;
      const empty: any = json && json.empty || {};
      return (
        <Fragment>
          {(json && json.private_blocks || []).map(this.renderBlock)}
          {empty && !(json && json.private_blocks && json.private_blocks.length) &&
            <Text style={[styles.emptyMessage, empty.textStyle]}>
              {empty.message || 'No content found.'}</Text>}
        </Fragment>
      );
    }

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
            componentId={this.props.componentId}
          />
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
            style={[styles.growStretch,
              this.props.animate && { backgroundColor: 'rgba(255, 255, 255, 0)' }]}
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
      if (this.scrollPosition < topOffset) {
        this.onAnimatedClose();
      }
      if (!this.state.showDarkX && event.nativeEvent.contentOffset.y >= 378) {
        this.setState({ showDarkX: true });
      } else if (this.state.showDarkX && event.nativeEvent.contentOffset.y < 378) {
        this.setState({ showDarkX: false });
      }
      if (!this.state.slideBackground && event.nativeEvent.contentOffset.y >= 100) {
        this.setState({ slideBackground: true });
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
            {empty && !(json && json.private_blocks && json.private_blocks.length) &&
              <Text style={[styles.emptyMessage, empty && empty.textStyle]}>
                {empty && empty.message || 'No content found.'}</Text>}

            {this.state.showCarousel && <Carousel
              data={json && json.private_blocks || []}
              layout={'default'}
              autoplay={autoplay}
              scrollEnabled={this.state.scrollEnabled}
              swipeThreshold={50}
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
            onCardPress={this.onTabbedCardPress}
            activeIndex={this.state.activeProgressBarIndex}
            componentId={this.props.componentId}
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
      return (
        <FlatList
          data={this.props.json && this.props.json.private_blocks || []}
          keyExtractor={this.dataKeyExtractor}
          renderItem={this.renderBlockItem}
          style={[styles.growStretch]}
          ListEmptyComponent={(
            <Text style={[styles.emptyMessage, empty && empty.textStyle]}>
              {empty && empty.message || 'No content found.'}</Text>
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

    renderContent(): JSX.Element {
      const { animate, backButton, containerStyle, json } = this.props;
      if (animate) {
        return (
          <Fragment>
            <Animatable.View
              ref={this.handleAnimatedRef}
              useNativeDriver
              style={[styles.animatedContainer]}
            >
              {this.renderScrollView()}
            </Animatable.View>
            {(json && json.tabbedItems && json.tabbedItems.length) &&
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
              </View>}
            {backButton &&
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
              </TouchableOpacity>}
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
        </View>
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
          {this.renderContent()}
          {(this.props.renderType && this.props.renderType === 'carousel' &&
            json && json.private_blocks && json.private_blocks.length > 0) &&
            <Animatable.View
              ref={this.handlePageCounterRef}
              useNativeDriver
              style={[styles.pageCounter, this.pageCounterStyle]}
            >
              <Text
                style={[styles.pageNum, this.pageNumberStyle]}
              >
                {this.state.pageNum} / {json.private_blocks.length}
              </Text>
            </Animatable.View>
          }
            <Animatable.Text
              style={[styles.navBarTitle, navBarTitleStyle]}
              ref={this.handleNavTitleRef}
              useNativeDriver
            >
              {navBarTitle}
            </Animatable.Text>

        </Fragment>
      );
    }

    dataKeyExtractor = (item: BlockItem): string => {
      return item.id || item.key || Math.floor(Math.random() * 1000000).toString();
    }
  };
}

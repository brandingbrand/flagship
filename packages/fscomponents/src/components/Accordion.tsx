import React, { Component, RefObject } from 'react';
import {
  Animated,
  findNodeHandle,
  Image,
  ImageStyle,
  ImageURISource,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableHighlight,
  UIManager,
  View,
  ViewStyle
} from 'react-native';

export interface AccordionProps {
  /**
   * Duration of the icon spin animation
   */
  animationDuration?: number;
  /**
   * Arrow icon to use; should be oriented facing right (>)
   */
  arrowIconImage?: ImageURISource;
  /**
   * Styles for the arrow icon
   */
  arrowIconStyle?: StyleProp<ImageStyle>;
  /**
   * Icon to use when open if icon format is 'image'
   */
  openIconImage?: ImageURISource;
  /**
   * Styles for open icon image
   */
  openIconStyle?: StyleProp<ImageStyle>;
  /**
   * Icon to use when closed if icon format is 'image'
   */
  closedIconImage?: ImageURISource;
  /**
   * Styles for open icon image
   */
  closedIconStyle?: StyleProp<ImageStyle>;
  /**
   * Content of the accordion
   */
  content?: JSX.Element;
  /**
   * Styles for the accordion content container
   */
  contentStyle?: StyleProp<ViewStyle>;
  /**
   * Whether to disable the animation (default false)
   */
  disableAnimation?: boolean;
  /**
   * Whether to display the icon as an image w open/closed options,
   * an arrow which rotates on open/close, or plus/minus (default is plus/minus)
   */
  iconFormat?: 'image' | 'plusminus' | 'arrow';
  /**
   * Styles for the accordion container when open
   */
  openStyle?: StyleProp<ViewStyle>;
  /**
   * Styles for the accordion title when open
   */
  openTitleStyle?: StyleProp<ViewStyle>;
  /**
   * Left, right, and bottom padding
   */
  padding?: number;
  /**
   * Styles for the plus minus icon
   */
  plusMinusStyle?: StyleProp<TextStyle>;
  /**
   * Function to be invoked when the accordion is opened. Animation will be disabled!
   */
  renderContent?: () => React.ReactNode;
  /**
   * Whether to initialize as open or closed
   */
  state?: 'open' | 'closed';
  /**
   * Styles for the accordion container
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Content of the accordion title
   */
  title: JSX.Element;
  /**
   *  Styles for the accordion title container
   */
  titleContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Height of the accordion title container
   */
  titleHeight?: number;
  /**
   * Styles for the accordion title
   */
  titleStyle?: StyleProp<ViewStyle>;
  /**
   * Color of the title touch highlight
   */
  titleUnderlayColor?: string;
}

export interface AccordionState {
  arrowTranslateAnimation: Animated.Value;
  contentHeightAnimation: Animated.Value;
  isOpen: boolean;
  isMeasuring: boolean;
  hasMeasured: boolean;

  padding: {
    paddingLeft: number;
    paddingRight: number;
  };

  titleTouchableHighlight: {
    height: number;
  };
}

const ACCORDION_PADDING_DEFAULT = 15;
const ACCORDION_ANIMATION_DURATION_DEFAULT = 200; // in ms
const ACCORDION_ARROW_ICON_DEFAULT = require('../../assets/images/arrow.png');
const ACCORDION_TITLE_HEIGHT_DEFAULT = 50;

const AccordionStyles = StyleSheet.create({
  container: {
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  content: {
    overflow: 'hidden'
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    flex: 1
  },
  arrowImage: {
    width: 12,
    height: 20
  },
  plusMinus: {
    fontSize: 20,
    lineHeight: 20,
    fontWeight: 'bold'
  },
  iconImage: {
    width: 15,
    height: 15
  }
});

/**
 * Component for a single accordion with a title that will show/hide the contents
 * via a slide animation when tapped. The default state can be 'open' or 'closed'
 * via the state property. The default is closed.
 *
 * Because of how padding and flexed items are handled, the dimensions of the
 * accordion can be customized via two props: titleHeight and padding. The titleHeight
 * prop controls the height of the title, and the padding prop controls the size of
 * the left and right padding for the title as well as the padding around the contents.
 * This is because on iOS padding does not affect the height of a flexed container; the
 * height of said container is determined solely based on the hight of its children. (On
 * web the height is the padding + height of the children.)
 */
export class Accordion extends Component<AccordionProps, AccordionState> {
  static defaultProps: Partial<AccordionProps> = {
    titleUnderlayColor: '#eee'
  };

  static getDerivedStateFromProps(
    nextProps: AccordionProps,
    prevState: AccordionState
  ): Partial<AccordionState> | null {
    return {
      padding: {
        paddingLeft: nextProps.padding || ACCORDION_PADDING_DEFAULT,
        paddingRight: nextProps.padding || ACCORDION_PADDING_DEFAULT
      },
      titleTouchableHighlight: {
        height: nextProps.titleHeight || ACCORDION_TITLE_HEIGHT_DEFAULT
      }
    };
  }

  private contentView: RefObject<View>;

  constructor(props: AccordionProps) {
    super(props);

    this.contentView = React.createRef<View>();

    this.state = {
      arrowTranslateAnimation: new Animated.Value(props.state === 'open' ? -90 : 90),
      contentHeightAnimation: new Animated.Value(0),
      isOpen: (props.state === 'open'),
      isMeasuring: false,
      hasMeasured: false,
      padding: {
        paddingLeft: props.padding || ACCORDION_PADDING_DEFAULT,
        paddingRight: props.padding || ACCORDION_PADDING_DEFAULT
      },
      titleTouchableHighlight: {
        height: props.titleHeight || ACCORDION_TITLE_HEIGHT_DEFAULT
      }
    };
  }

  render(): JSX.Element {
    let computedContentStyle;

    if (this.shouldEnableAnimation()) {
      // If we're animating, we need to determine the height of the accordion contents
      // so we know to what height the animation should stop. When the the contents are
      // laid out, this.contentOnLayout will be called, after which we can use
      // state.contentHeightAnimation. This value will be 0 if the accordion defaults
      // to closed, the height if the accordion defaults to open, or the current height
      // of the animation if actively animating.
      if (this.state.isMeasuring) {
        computedContentStyle = { position: 'absolute', opacity: 0 };
      } else if (this.state.hasMeasured) {
        computedContentStyle = {
          height: this.state.contentHeightAnimation
        };
      } else if (this.state.isOpen) {
        computedContentStyle = {};
      } else {
        // Default to height: 'auto' until we determine the height of the contents.
        // Because RN doesn't have this option for height we simply pass an empty
        // object as the style.
        computedContentStyle = { height: 0 };
      }
    } else {
      computedContentStyle = this.state.isOpen ? {} : { height: 0 };
    }

    return (
      <View
        style={[
          AccordionStyles.container,
          this.props.style,
          this.state.isOpen && this.props.openStyle
        ]}
      >
        <TouchableHighlight
          style={this.state.titleTouchableHighlight}
          underlayColor={this.props.titleUnderlayColor}
          onPress={this.toggleAccordion}
        >
          <View
            style={[
              AccordionStyles.titleContainer,
              this.state.padding,
              this.props.titleContainerStyle
            ]}
          >
            <View
              style={[
                AccordionStyles.title,
                this.props.titleStyle,
                this.state.isOpen && this.props.openTitleStyle
              ]}
            >
              {this.props.title}
            </View>
            {this.renderIcon()}
          </View>
        </TouchableHighlight>
        <Animated.View
          ref={this.contentView}
          style={[
            AccordionStyles.content,
            this.state.padding,
            this.props.contentStyle,
            computedContentStyle
          ]}
          onLayout={this.contentOnLayout}
        >
          <View>
            {this.props.content}
            {this.state.isOpen && this.props.renderContent && this.props.renderContent()}
          </View>
        </Animated.View>
      </View>
    );
  }

  /**
   * Animates the content to a given height and rotates the disclosure indicator.
   *
   * @param {number} height The height to which to animate the accordion.
   * @param {boolean} shouldOpen Whether to set the diclosure indicator to an open or closed state.
   */
  private animateContent = (height: number, shouldOpen: boolean) => {
    if (this.shouldEnableAnimation()) {
      Animated.spring(this.state.contentHeightAnimation, {
        bounciness: 0,
        toValue: height
      }).start();
    }

    // TODO - make the rotation customizable
    Animated.timing(this.state.arrowTranslateAnimation, {
      toValue: shouldOpen ? -90 : 90,
      duration: this.props.animationDuration || ACCORDION_ANIMATION_DURATION_DEFAULT,
      useNativeDriver: true
    }).start();
  }

  /**
   * On first layout, get the height of the contents so we can determine how high we should expand
   * the container when we animate.
   *
   * @param {LayoutChangeEvent} event The layout event.
   */
  private contentOnLayout = (event: LayoutChangeEvent) => {
    if (
      !this.state.hasMeasured &&
      !this.state.isMeasuring &&
      this.state.isOpen
    ) {
      this.state.contentHeightAnimation.setValue(
        event.nativeEvent.layout.height + this.state.padding.paddingLeft
      );
      this.setState({ hasMeasured: true });
    }
  }

  /**
   * Returns whether or not the accordion should animate opening.
   *
   * @returns {boolean} Returns true if the accordion should animate opening.
   */
  private shouldEnableAnimation = (): boolean => {
    return !this.props.disableAnimation && !this.props.renderContent;
  }

  /**
   * Renders the accordion disclosure icon.
   *
   * @returns {React.ReactNode} The accordion disclosure icon.
   */
  private renderIcon(): React.ReactNode {

    const {
      arrowIconImage,
      closedIconImage,
      closedIconStyle,
      iconFormat,
      openIconImage,
      openIconStyle
    } = this.props;

    if (iconFormat === 'arrow') {
      const computedArrowStyle = {
        transform: [
          {
            rotate: this.state.arrowTranslateAnimation.interpolate({
              inputRange: [-90, 90],
              outputRange: ['-90deg', '90deg']
            })
          }
        ]
      };

      return (
        <Animated.Image
          source={arrowIconImage || ACCORDION_ARROW_ICON_DEFAULT}
          style={[
            AccordionStyles.arrowImage,
            this.props.arrowIconStyle,
            computedArrowStyle
          ]}
        />
      );
    }

    if (iconFormat === 'image'
    && (closedIconImage || openIconImage)) {
      const { isOpen } = this.state;
      const image = isOpen ? openIconImage : closedIconImage;
      const imageStyle = isOpen ? openIconStyle : closedIconStyle;
      if (image) {
        return (
          <Image
            source={image}
            style={[
              AccordionStyles.iconImage,
              imageStyle
            ]}
          />
        );
      } else {
        return null;
      }
    }

    const icon = this.state.isOpen ? '–' : '+';

    return (
      <Text style={[AccordionStyles.plusMinus, this.props.plusMinusStyle]}>
        {icon}
      </Text>
    );
  }

  /**
   * Toggles the accordion open or closed.
   */
  private toggleAccordion = () => {
    const isCurrentlyOpen = this.state.isOpen;

    this.setState({
      isOpen: !isCurrentlyOpen
    });

    if (isCurrentlyOpen) {
      this.animateContent(0, false);
    } else {
      this.setState({ isMeasuring: true }, () => {
        requestAnimationFrame(() => {
          const node = findNodeHandle(this.contentView.current);

          if (node) {
            UIManager.measure(node, (x: number, y: number, width: number, height: number) => {
              this.setState({
                isMeasuring: false,
                hasMeasured: true
              });

              this.animateContent(height + this.state.padding.paddingLeft, true);
            });
          }
        });
      });
    }
  }
}

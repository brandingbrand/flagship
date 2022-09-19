import React, { Component } from 'react';

import type {
  GestureResponderEvent,
  ImageSourcePropType,
  ImageStyle,
  LayoutChangeEvent,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Animated, Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import ACCORDION_ARROW_ICON_DEFAULT from '../../assets/images/arrow.png';

export interface AccordionProps {
  /**
   * Duration of the icon spin animation
   */
  animationDuration?: number;
  /**
   * Arrow icon to use; should be oriented facing right (>)
   */
  arrowIconImage?: ImageSourcePropType;
  /**
   * Range of rotation for open/closed arrows
   */
  arrowRange?: string[];
  /**
   * Icon to use when open if icon format is 'image'
   */
  openIconImage?: ImageSourcePropType;
  /**
   * Icon to use when closed if icon format is 'image'
   */
  closedIconImage?: ImageSourcePropType;
  /**
   * Whether to disable the animation (default false)
   */
  disableAnimation?: boolean;
  /**
   * Whether to display the icon as an image w open/closed options,
   * an arrow which rotates on open/close, or plus/minus (default is plus/minus)
   */
  iconFormat?: 'arrow' | 'image' | 'plusminus';
  /**
   * Bottom padding
   *
   * @deprecated Put the padding on the accordion contents instead
   */
  padding?: number;
  /**
   * Whether to initialize as open or closed
   */
  state?: 'closed' | 'open';
  /**
   * Color of the title touch highlight
   */
  titleUnderlayColor?: string;
  /**
   * Left and right padding (has defaults)
   */
  paddingHorizontal?: number;

  /**
   * Styles for the arrow icon
   */
  arrowIconStyle?: StyleProp<ImageStyle>;
  /**
   * Styles for open icon image
   */
  openIconStyle?: StyleProp<ImageStyle>;
  /**
   * Styles for open icon image
   */
  closedIconStyle?: StyleProp<ImageStyle>;
  /**
   * Content of the accordion
   *
   * @deprecated Make the contents a child instead
   */
  content?: JSX.Element | JSX.Element[];
  /**
   * Styles for the accordion content container
   */
  contentStyle?: StyleProp<ViewStyle>;
  /**
   * Styles for the accordion container when open
   */
  openStyle?: StyleProp<ViewStyle>;
  /**
   * Styles for the accordion title when open
   */
  openTitleStyle?: StyleProp<ViewStyle>;
  /**
   * Styles for the plus minus icon
   */
  plusMinusStyle?: StyleProp<TextStyle>;
  /**
   * Function to be invoked when the accordion is opened. Animation will be disabled!
   */
  renderContent?: () => React.ReactNode;
  /**
   * Styles for the accordion container
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Content of the accordion title
   */
  title: JSX.Element | string;
  /**
   * Styles for the accordion title container
   */
  titleContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Image to include on left side of title
   */
  titleImage?: ImageSourcePropType;
  /**
   * Styles for the title image
   */
  titleImageStyle?: StyleProp<ImageStyle>;
  /**
   * Styles for the accordion title
   */
  titleStyle?: StyleProp<ViewStyle>;
  /**
   * Styles for the accordion title text
   */
  titleTextStyle?: StyleProp<TextStyle>;
  /**
   * Height of title touch highlight (has default)
   */
  titleTouchStyle?: StyleProp<ViewStyle>;

  dataSet?: Record<string, ''>;

  liftPropsForm?: JSX.Element;
}

export interface AccordionState {
  arrowTranslateAnimation: Animated.Value;
  contentHeightAnimation: Animated.Value;
  contentHeight: number;
  isOpen: boolean;
}

const ACCORDION_PADDING_DEFAULT = 15;
const ACCORDION_ANIMATION_DURATION_DEFAULT = 200; // in ms
const ACCORDION_TITLE_HEIGHT_DEFAULT = 50;

const AccordionStyles = StyleSheet.create({
  arrowImage: {
    height: 20,
    width: 12,
  },
  container: {
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  content: {
    overflow: 'hidden',
  },
  contentLayout: {
    // Need to do this so that heights are still calculated inside overflow: hidden
    left: 0,
    right: 0,
    position: 'absolute',
  },
  iconImage: {
    height: 15,
    width: 15,
  },
  plusMinus: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  title: {
    flex: 1,
    flexDirection: 'row',
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  titleImage: {
    height: 50,
    width: 50,
  },
});

/**
 * Component for a single accordion with a title that will show/hide the contents
 * via a slide animation when tapped. The default state can be 'open' or 'closed'
 * via the state property. The default is closed.
 *
 * Because of how padding and flexed items are handled, the dimensions of the
 * accordion can be customized via two props: padding and paddingHorizontal. The padding
 * prop controls the height of the contents, and the paddingHorizontal prop controls the size of
 * the left and right padding for the title as well as the padding around the contents.
 * This is because on iOS padding does not affect the height of a flexed container; the
 * height of said container is determined solely based on the height of its children. (On
 * web the height is the padding + height of the children.)
 */
export class Accordion extends Component<AccordionProps, AccordionState> {
  public static defaultProps: Partial<AccordionProps> = {
    titleUnderlayColor: 'transparent',
    paddingHorizontal: ACCORDION_PADDING_DEFAULT,
    titleTouchStyle: {
      height: ACCORDION_TITLE_HEIGHT_DEFAULT,
    },
  };

  constructor(props: AccordionProps) {
    super(props);

    this.state = {
      arrowTranslateAnimation: new Animated.Value(props.state === 'open' ? -90 : 90),
      contentHeightAnimation: new Animated.Value(0),
      contentHeight: 0,
      isOpen: props.state === 'open',
    };
  }

  /**
   * Animates the content to a given height and rotates the disclosure indicator.
   *
   * @param height The height to which to animate the accordion.
   * @param shouldOpen Whether to set the diclosure indicator to an open or closed state.
   */
  private readonly animateContent = (height: number, shouldOpen: boolean) => {
    if (this.shouldEnableAnimation()) {
      Animated.spring(this.state.contentHeightAnimation, {
        bounciness: 0,
        toValue: height,
        useNativeDriver: false,
      }).start();
    } else {
      this.state.contentHeightAnimation.setValue(height);
    }

    // TODO - make the rotation customizable
    Animated.timing(this.state.arrowTranslateAnimation, {
      toValue: shouldOpen ? -90 : 90,
      duration: this.props.animationDuration || ACCORDION_ANIMATION_DURATION_DEFAULT,
      useNativeDriver: true,
    }).start();
  };

  /**
   * On first layout, get the height of the contents so we can determine how high we should expand
   * the container when we animate.
   *
   * @param event The layout event.
   */
  private readonly contentOnLayout = (event: LayoutChangeEvent) => {
    const padding = this.props.padding || 0;
    const height = event.nativeEvent.layout.height + padding;
    if (height !== this.state.contentHeight) {
      this.setState({
        contentHeight: height,
      });
    }
    if (this.state.isOpen) {
      this.state.contentHeightAnimation.setValue(height);
    }
  };

  /**
   * Returns whether or not the accordion should animate opening.
   *
   * @return Returns true if the accordion should animate opening.
   */
  private readonly shouldEnableAnimation = (): boolean =>
    !this.props.disableAnimation && !this.props.renderContent;

  /**
   * Renders the accordion disclosure icon as an arrow.
   *
   * @return The accordion disclosure icon.
   */
  private renderArrowIcon(): React.ReactNode {
    const { arrowIconImage } = this.props;
    const computedArrowStyle = {
      transform: [
        {
          rotate: this.state.arrowTranslateAnimation.interpolate({
            inputRange: [-90, 90],
            outputRange: this.props.arrowRange || ['-90deg', '90deg'],
          }),
        },
      ],
    };

    return (
      <Animated.Image
        source={arrowIconImage || ACCORDION_ARROW_ICON_DEFAULT}
        style={[AccordionStyles.arrowImage, this.props.arrowIconStyle, computedArrowStyle]}
      />
    );
  }

  /**
   * Renders the accordion disclosure icon.
   *
   * @return The accordion disclosure icon.
   */
  private renderIcon(): React.ReactNode {
    const { closedIconImage, closedIconStyle, iconFormat, openIconImage, openIconStyle } =
      this.props;

    if (iconFormat === 'arrow') {
      return this.renderArrowIcon();
    }

    if (iconFormat === 'image' && (closedIconImage || openIconImage)) {
      const { isOpen } = this.state;
      const image = isOpen ? openIconImage : closedIconImage;
      const imageStyle = isOpen ? openIconStyle : closedIconStyle;
      if (image) {
        return <Image source={image} style={[AccordionStyles.iconImage, imageStyle]} />;
      }
      return null;
    }

    const icon = this.state.isOpen ? '–' : '+';

    return <Text style={[AccordionStyles.plusMinus, this.props.plusMinusStyle]}>{icon}</Text>;
  }

  /**
   * Toggles the accordion open or closed.
   */
  private readonly toggleAccordion = (event: GestureResponderEvent): void => {
    event.persist();
    const target = event.target as unknown as HTMLInputElement | undefined;

    if (target !== undefined && target.tagName === 'INPUT') {
      return;
    }

    const isCurrentlyOpen = this.state.isOpen;

    this.setState({
      isOpen: !isCurrentlyOpen,
    });

    if (isCurrentlyOpen) {
      this.animateContent(0, false);
    } else {
      this.animateContent(this.state.contentHeight, true);
    }
  };

  public render(): JSX.Element {
    let computedContentStyle = {};
    let layoutStyle;

    if (
      this.shouldEnableAnimation() &&
      // If the content height hasn't been calculated yet
      // and the accordion starts open just let it autosize
      (this.state.contentHeight || this.props.state !== 'open')
    ) {
      computedContentStyle = {
        height: this.state.contentHeightAnimation,
      };
      layoutStyle = AccordionStyles.contentLayout;
    } else if (!this.state.isOpen) {
      computedContentStyle = { height: 0 };
    }

    return (
      <View
        {...{ dataSet: this.props.dataSet }}
        style={[
          AccordionStyles.container,
          this.props.style,
          this.state.isOpen && this.props.openStyle,
        ]}
      >
        <TouchableHighlight
          accessibilityRole="button"
          onPress={this.toggleAccordion}
          style={this.props.titleTouchStyle || Accordion.defaultProps.titleTouchStyle}
          underlayColor={this.props.titleUnderlayColor || Accordion.defaultProps.titleUnderlayColor}
        >
          <View
            style={[
              AccordionStyles.titleContainer,
              { paddingHorizontal: this.props.paddingHorizontal },
              this.props.titleContainerStyle,
            ]}
          >
            {this.props.titleImage ? (
              <Image
                source={this.props.titleImage}
                style={[AccordionStyles.titleImage, this.props.titleImageStyle]}
              />
            ) : null}
            <View
              style={[
                AccordionStyles.title,
                this.props.titleStyle,
                this.state.isOpen && this.props.openTitleStyle,
              ]}
            >
              {typeof this.props.title === 'string' ? (
                <Text style={this.props.titleTextStyle}>{this.props.title}</Text>
              ) : (
                this.props.title
              )}
              {this.props.liftPropsForm}
            </View>
            {this.renderIcon()}
          </View>
        </TouchableHighlight>
        <Animated.View style={[AccordionStyles.content, computedContentStyle]}>
          <View
            onLayout={this.contentOnLayout}
            style={[
              { paddingHorizontal: this.props.paddingHorizontal },
              this.props.contentStyle,
              layoutStyle,
            ]}
          >
            {this.props.content || this.props.children}
            {this.state.isOpen && this.props.renderContent ? this.props.renderContent() : null}
          </View>
        </Animated.View>
      </View>
    );
  }
}

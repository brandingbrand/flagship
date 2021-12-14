import React, { PureComponent } from 'react';
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';

import { style as S } from '../styles/MoreText';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
const componentTranslationKeys = translationKeys.flagship.moreText;

export type FormatType = 'outward' | 'inward';

export interface SerializableMoreTextProps {
  numberOfCharacters: number;
  format?: FormatType;

  // Container
  containerStyle?: ViewStyle;

  // Text
  text: string;
  textStyle?: TextStyle;

  // More/Less Section
  textMore?: string;
  textLess?: string;
  textMoreLessStyle?: TextStyle;
}

export interface MoreTextProps extends Omit<SerializableMoreTextProps,
  'containerStyle' |
  'textStyle' |
  'textMoreLessStyle'
  > {
  // Container
  containerStyle?: StyleProp<ViewStyle>;

  // Text
  textStyle?: StyleProp<TextStyle>;

  // More/Less Section
  textMoreLessStyle?: StyleProp<TextStyle>;
  renderMoreLessOutwardSection?:
    (shouldShowMore: boolean, handlePress: () => void) => React.ReactNode;
}

export interface MoreTextState {
  shouldShowMore: boolean;
  visibleText: string;
}

export class MoreText extends PureComponent<MoreTextProps, MoreTextState> {
  private readonly kButtonTouchabilityOpacity: number = 0.5;
  private readonly kTextMore: string = FSI18n.string(componentTranslationKeys.readMore);
  private readonly kTextLess: string = FSI18n.string(componentTranslationKeys.readLess);

  constructor(props: MoreTextProps) {
    super(props);

    this.state = {
      shouldShowMore: props.text.length > props.numberOfCharacters,
      visibleText: props.text.length > props.numberOfCharacters ?
        props.text.substring(0, props.numberOfCharacters) : props.text
    };
  }

  handlePress = () => {
    const {
      text,
      numberOfCharacters
    } = this.props;

    if (this.state.shouldShowMore) {
      this.setState({
        shouldShowMore: false,
        visibleText: text
      });
    } else {
      this.setState({
        shouldShowMore: true,
        visibleText: text.length > numberOfCharacters ?
          text.substring(0, numberOfCharacters) : text
      });
    }
  }

  renderMoreLessOutwardSection = () => {
    const {
      shouldShowMore
    } = this.state;

    const {
      textMore,
      textLess,
      textMoreLessStyle,
      renderMoreLessOutwardSection
    } = this.props;

    if (renderMoreLessOutwardSection) {
      return renderMoreLessOutwardSection(shouldShowMore, this.handlePress);
    }

    const titleMore = textMore ? textMore : this.kTextMore;
    const titleLess = textLess ? textLess : this.kTextLess;

    return (
      <TouchableOpacity
        accessibilityLabel={shouldShowMore ? titleMore : titleLess}
        activeOpacity={this.kButtonTouchabilityOpacity}
        onPress={this.handlePress}
      >
        <Text style={textMoreLessStyle ? textMoreLessStyle : S.textMoreLess}>
          {shouldShowMore ? titleMore : titleLess}
        </Text>
      </TouchableOpacity>
    );
  }

  renderOutward = () => {
    const {
      visibleText
    } = this.state;

    const {
      containerStyle,
      textStyle
    } = this.props;

    return(
      <View style={containerStyle ? containerStyle : S.container}>
        <Text style={textStyle ? textStyle : S.text}>
          {visibleText}
        </Text>

        {this.renderMoreLessOutwardSection()}
      </View>
    );
  }

  renderInward = () => {
    const {
      shouldShowMore,
      visibleText
    } = this.state;

    const {
      containerStyle,
      textLess,
      textMore,
      textMoreLessStyle,
      textStyle
    } = this.props;

    const titleMore = textMore ? textMore : this.kTextMore;
    const titleLess = textLess ? textLess : this.kTextLess;

    return(
      <View style={containerStyle ? containerStyle : S.container}>
        <TouchableOpacity
          accessibilityLabel={shouldShowMore ? titleMore : titleLess}
          activeOpacity={this.kButtonTouchabilityOpacity}
          onPress={this.handlePress}
        >
          <Text style={textStyle ? textStyle : S.text}>
            {visibleText}
            {' '}
            <Text style={textMoreLessStyle ? textMoreLessStyle : S.textMoreLess}>
              {shouldShowMore ? titleMore : titleLess}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render(): JSX.Element {
    const { text, textStyle, numberOfCharacters } = this.props;

    if (text.length <= numberOfCharacters) {
      return (
      <Text style={textStyle ? textStyle : S.text}>
        {text}
      </Text>
      );
    }

    switch (this.props.format) {
      case 'outward':
        return this.renderOutward();
      case 'inward':
        return this.renderInward();
      default:
        return this.renderOutward();
    }
  }
}

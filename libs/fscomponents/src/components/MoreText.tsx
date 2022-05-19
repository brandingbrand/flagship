import React, { PureComponent } from 'react';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Text, TouchableOpacity, View } from 'react-native';

import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

import { style as S } from '../styles/MoreText';

const componentTranslationKeys = translationKeys.flagship.moreText;

export type FormatType = 'inward' | 'outward';

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

export interface MoreTextProps
  extends Omit<SerializableMoreTextProps, 'containerStyle' | 'textMoreLessStyle' | 'textStyle'> {
  // Container
  containerStyle?: StyleProp<ViewStyle>;

  // Text
  textStyle?: StyleProp<TextStyle>;

  // More/Less Section
  textMoreLessStyle?: StyleProp<TextStyle>;
  renderMoreLessOutwardSection?: (
    shouldShowMore: boolean,
    handlePress: () => void
  ) => React.ReactNode;
}

export interface MoreTextState {
  shouldShowMore: boolean;
  visibleText: string;
}

export class MoreText extends PureComponent<MoreTextProps, MoreTextState> {
  constructor(props: MoreTextProps) {
    super(props);

    this.state = {
      shouldShowMore: props.text.length > props.numberOfCharacters,
      visibleText:
        props.text.length > props.numberOfCharacters
          ? props.text.slice(0, Math.max(0, props.numberOfCharacters))
          : props.text,
    };
  }

  private readonly kButtonTouchabilityOpacity: number = 0.5;
  private readonly kTextMore: string = FSI18n.string(componentTranslationKeys.readMore);
  private readonly kTextLess: string = FSI18n.string(componentTranslationKeys.readLess);

  private readonly handlePress = () => {
    const { numberOfCharacters, text } = this.props;

    if (this.state.shouldShowMore) {
      this.setState({
        shouldShowMore: false,
        visibleText: text,
      });
    } else {
      this.setState({
        shouldShowMore: true,
        visibleText:
          text.length > numberOfCharacters ? text.slice(0, Math.max(0, numberOfCharacters)) : text,
      });
    }
  };

  private readonly renderMoreLessOutwardSection = () => {
    const { shouldShowMore } = this.state;

    const { renderMoreLessOutwardSection, textLess, textMore, textMoreLessStyle } = this.props;

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
  };

  private readonly renderOutward = () => {
    const { visibleText } = this.state;

    const { containerStyle, textStyle } = this.props;

    return (
      <View style={containerStyle ? containerStyle : S.container}>
        <Text style={textStyle ? textStyle : S.text}>{visibleText}</Text>

        {this.renderMoreLessOutwardSection()}
      </View>
    );
  };

  private readonly renderInward = () => {
    const { shouldShowMore, visibleText } = this.state;

    const { containerStyle, textLess, textMore, textMoreLessStyle, textStyle } = this.props;

    const titleMore = textMore ? textMore : this.kTextMore;
    const titleLess = textLess ? textLess : this.kTextLess;

    return (
      <View style={containerStyle ? containerStyle : S.container}>
        <TouchableOpacity
          accessibilityLabel={shouldShowMore ? titleMore : titleLess}
          activeOpacity={this.kButtonTouchabilityOpacity}
          onPress={this.handlePress}
        >
          <Text style={textStyle ? textStyle : S.text}>
            {visibleText}{' '}
            <Text style={textMoreLessStyle ? textMoreLessStyle : S.textMoreLess}>
              {shouldShowMore ? titleMore : titleLess}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  public render(): JSX.Element {
    const { numberOfCharacters, text, textStyle } = this.props;

    if (text.length <= numberOfCharacters) {
      return <Text style={textStyle ? textStyle : S.text}>{text}</Text>;
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

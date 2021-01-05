import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View
} from 'react-native';
import * as Animatable from 'react-native-animatable';

const styles = StyleSheet.create({
  default: {
    color: '#000'
  }
});

interface LocalizationData {
  value: string;
  language: string;
}
export interface TextBlockProps {
  text: string;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<TextStyle>;
  animateIndex?: number;
  localization?: LocalizationData[];
  subtitle?: TextBlockProps;
  link?: string;
}
export default class TextBlock extends Component<TextBlockProps> {
  static contextTypes: any = {
    language: PropTypes.string,
    handleAction: PropTypes.func
  };
  fadeInView: any;
  handleFadeInRef = (ref: any) => this.fadeInView = ref;
  componentDidMount(): void {
    if (this.props.animateIndex && this.props.animateIndex <= 3) {
      this.fadeInView.transition(
        { opacity: 0 },
        { opacity: 1 },
        400, 'ease-out');
    }
  }

  shouldComponentUpdate(nextProps: TextBlockProps): boolean {
    return nextProps.textStyle !== this.props.textStyle ||
      nextProps.containerStyle !== this.props.containerStyle ||
      nextProps.text !== this.props.text;
  }
  onPress = (link: string) => () => {
    const { handleAction } = this.context;
    handleAction({
      type: 'deep-link',
      value: link
    });
  }
  render(): JSX.Element {
    const {
      textStyle,
      containerStyle,
      localization,
      link,
      subtitle
    } = this.props;

    let { text } = this.props;
    const { language } = this.context;
    const filterLocalization = localization && localization.find(item => {
      return item.language === language;
    }) || null;
    if (filterLocalization) {
      text = filterLocalization.value;
    }
    if (this.props.animateIndex && this.props.animateIndex <= 3) {
      return (
        <View style={containerStyle}>
          <Animatable.Text
            style={[styles.default, textStyle]}
            ref={this.handleFadeInRef}
            useNativeDriver
            delay={250}
          >
            {text}
          </Animatable.Text>
        </View>

      );
    }
    if (link) {
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={this.onPress(link)}
        >
          <View style={containerStyle}>
            <Text style={[styles.default, textStyle]}>{text}</Text>
            {subtitle &&
              (
                <View style={subtitle.containerStyle}>
                  <Text style={[styles.default, subtitle.textStyle]}>{subtitle.text}</Text>
                </View>
              )
            }
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <View style={containerStyle}>
        <Text style={[styles.default, textStyle]}>{text}</Text>
        {subtitle &&
          (
            <View style={subtitle.containerStyle}>
              <Text style={[styles.default, subtitle.textStyle]}>{subtitle.text}</Text>
            </View>
          )
        }
      </View>
    );
  }
}

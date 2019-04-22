import React, { Component } from 'react';
import {
  Image,
  ImageStyle,
  ImageURISource,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

const componentTranslationKeys = translationKeys.flagship.step;

const styles = StyleSheet.create({
  completedIcon: {
    height: 32,
    flex: 0,
    width: 32
  },
  container: {
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    flexDirection: 'row',
    flex: 1,
    padding: 5
  },
  titleText: {
    flexGrow: 1
  }
});

export interface StepProps {
  completed: boolean;
  completedIcon?: ImageURISource;
  completedIconStyle?: StyleProp<ImageStyle>;
  onPress?: () => void;
  title: string;
  titleStyle?: StyleProp<TextStyle>;
  stepNumber: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Individual step of the step indicator
 *  is a touchable element if step is completed
 */
export class Step extends Component<StepProps> {
  render(): JSX.Element {
    if (this.props.completed) {
      const stepCompletedLabel =
        FSI18n.string(componentTranslationKeys.announcements.stepCompleted);
      const accessibilityLabel = `${this.props.title}, ${stepCompletedLabel}`;

      return (
        <TouchableOpacity
          onPress={this.props.onPress}
          style={[styles.container, this.props.style]}
          accessibilityRole='button'
          accessibilityLabel={accessibilityLabel}
        >
          {this.renderTitle()}
          {this.renderDoneIcon()}
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={[styles.container, this.props.style]}>
          {this.renderTitle()}
          {this.renderDoneIcon()}
        </View>
      );
    }
  }

  private renderDoneIcon = () => {
    if (!this.props.completed || !this.props.completedIcon) {
      return null;
    }

    return (
      <Image
        style={[styles.completedIcon, this.props.completedIconStyle]}
        source={this.props.completedIcon}
      />
    );
  }

  private renderTitle = () => {
    return (
      <Text style={[styles.titleText, this.props.titleStyle]}>
        {this.props.title}
      </Text>
    );
  }
}

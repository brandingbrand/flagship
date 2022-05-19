import type { FunctionComponent } from 'react';
import React, { memo } from 'react';

import type { ImageStyle, ImageURISource, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

const componentTranslationKeys = translationKeys.flagship.step;

const styles = StyleSheet.create({
  completedIcon: {
    flex: 0,
    height: 32,
    width: 32,
  },
  container: {
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    flexDirection: 'row',
    flex: 1,
    padding: 5,
  },
  titleText: {
    flexGrow: 1,
  },
});

export interface SerializableStepProps {
  completed: boolean;
  completedIconStyle?: ImageStyle;
  title: string;
  titleStyle?: TextStyle;
  stepNumber: number;
  style?: ViewStyle;
}

export interface StepProps
  extends Omit<SerializableStepProps, 'completedIconStyle' | 'style' | 'titleStyle'> {
  completedIcon?: ImageURISource;
  completedIconStyle?: StyleProp<ImageStyle>;
  onPress?: () => void;
  titleStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}

/**
 * Individual step of the step indicator
 *  is a touchable element if step is completed
 */
export const Step: FunctionComponent<StepProps> = memo((props): JSX.Element => {
  const renderDoneIcon = () => {
    if (!props.completed || !props.completedIcon) {
      return null;
    }

    return (
      <Image
        source={props.completedIcon}
        style={[styles.completedIcon, props.completedIconStyle]}
      />
    );
  };

  const renderTitle = () => <Text style={[styles.titleText, props.titleStyle]}>{props.title}</Text>;

  if (props.completed) {
    const stepCompletedLabel = FSI18n.string(componentTranslationKeys.announcements.stepCompleted);
    const accessibilityLabel = `${props.title}, ${stepCompletedLabel}`;

    return (
      <TouchableOpacity
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        onPress={props.onPress}
        style={[styles.container, props.style]}
      >
        {renderTitle()}
        {renderDoneIcon()}
      </TouchableOpacity>
    );
  }
  return (
    <View style={[styles.container, props.style]}>
      {renderTitle()}
      {renderDoneIcon()}
    </View>
  );
});

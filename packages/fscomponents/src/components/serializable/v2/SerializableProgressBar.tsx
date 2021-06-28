import React, { FC, memo } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';


const styles = StyleSheet.create({
  bar: {
    height: 10,
    borderColor: '#000',
    flexDirection: 'row',
    flex: 1,
    padding: 0,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  },
  container: {
    borderRadius: 10,
    alignSelf: 'center',
    borderColor: '#777',
    borderWidth: 2
  }
});

export interface SerializableProgressBarProps {
  min: number;
  max: number;
  value: number;
  barBackgroudColor?: string;
  progressColor?: string;
  barBorderWidth?: number;
  barBorderColor?: string;
  barWidth?: string;
  barHeight?: number;
}

const calculateColorBarPercentage = (min: number, max: number, value: number) => {
  return `${(value / (max - min)) * 100}%`;
};

export const SerializableProgressBar: FC<SerializableProgressBarProps> = memo(({
  progressColor,
  barBackgroudColor,
  barWidth,
  barBorderColor,
  min,
  max,
  value,
  barBorderWidth,
  barHeight
}): JSX.Element => {

  const progressBarWidth = calculateColorBarPercentage(min, max, value);

  return (
    <View
      style={[styles.container, {
        backgroundColor: barBackgroudColor,
        borderWidth: barBorderWidth,
        borderColor: barBorderColor,
        width: barWidth,
        height: barHeight
      }]}
    >
      <View
        style={[styles.bar, {
          width: progressBarWidth,
          backgroundColor: progressColor,
          height: barHeight}]}
      />
    </View>
  );
});

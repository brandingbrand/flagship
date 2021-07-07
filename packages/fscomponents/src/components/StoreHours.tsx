import React, { Component } from 'react';
import {
  Image,
  ImageRequireSource,
  ImageStyle,
  ImageURISource,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { style as S } from '../styles/StoreHours';
import { checkIfOpen } from '../lib/helpers';
import { Hour } from '../types/Store';

const icons = {
  arrow: require('../../assets/images/arrow-up.png')
};

const DAYS_OF_WEEK_INDEX = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export interface StoreScheduleProps {
  hours: Hour[];
  expandedView?: boolean;
  dropdownIcon?: ImageURISource | ImageRequireSource;
  styles?: {
    container?: StyleProp<ViewStyle>;
    headerContainer?: StyleProp<ViewStyle>;
    headerText?: StyleProp<TextStyle>;
    headerIcon?: StyleProp<ImageStyle>;
    contentContainer?: StyleProp<ViewStyle>;
    contentRow?: StyleProp<ViewStyle>;
    currentDay?: StyleProp<TextStyle>;
    textDay?: StyleProp<TextStyle>;
    textHours?: StyleProp<TextStyle>;
  };
}

interface StoreScheduleState {
  expanded: boolean;
}

export class StoreHours extends Component<StoreScheduleProps, StoreScheduleState> {
  private nowDate: Date = new Date();

  constructor(props: StoreScheduleProps) {
    super(props);
    this.state = {
      expanded: !(props.expandedView !== undefined && !props.expandedView)
    };
  }

  renderHeaderTitle(): JSX.Element {
    let nowDayHours: any = null;
    let isOpen: boolean;
    const { styles } = this.props;

    this.props.hours.map((item: Hour): Hour | void => {
      if (item.dayOfWeek === this.nowDate.getDay()) {
        return nowDayHours = item;
      }
    });

    if (nowDayHours !== null) {
      isOpen = checkIfOpen(this.nowDate, nowDayHours.open, nowDayHours.close);
    } else {
      isOpen = false;
    }

    return (
      <Text style={[S.headerText, !!styles && styles.headerText]}>
        {this.state.expanded ?
          `${isOpen ? 'Open now' : 'Close now'}` :
          `${isOpen ?
             `Open now: ${nowDayHours.open.replace(' ', '')} - ${nowDayHours.close.
             replace(' ', '')}`
             : 'Close now'}`
      }</Text>
    );
  }

  renderContent(): JSX.Element {
    let currentIndexDay: number = 0;
    const { styles } = this.props;
    const ascendedSortedDays: Hour[] =
      [...this.props.hours].sort((a: Hour, b: Hour) => a.dayOfWeek - b.dayOfWeek);
    ascendedSortedDays.forEach((day: Hour, index) => {
      if (day.dayOfWeek === this.nowDate.getDay()) {
        currentIndexDay = index;
      }
    });
    const sortedDays: Hour[] =
      ascendedSortedDays.slice(currentIndexDay)
      .concat(ascendedSortedDays.slice(0, currentIndexDay));

    return (
      <View style={[S.contentContainer, !!styles && styles.contentContainer]}>
        {sortedDays.map((day: Hour) => {
          const currentDayStyle = day.dayOfWeek === this.nowDate.getDay() ? S.currentDay : null;
          const currentDayCustomStyle =
            day.dayOfWeek === this.nowDate.getDay() ? !!styles && styles.currentDay : null;
          return (
            <View key={day.dayOfWeek} style={[S.contentRow, !!styles && styles.contentRow]}>
              <Text
                style={[
                  S.textDay,
                  !!styles && styles.textDay,
                  currentDayStyle,
                  currentDayCustomStyle
                ]}
              >
                {DAYS_OF_WEEK_INDEX[day.dayOfWeek]}
              </Text>
              <Text
                style={[
                  S.textHours,
                  !!styles && styles.textHours,
                  currentDayStyle,
                  currentDayCustomStyle
                ]}
              >
                {day.open.replace(' ', '')}
                {' - '}
                {day.close.replace(' ', '')}
              </Text>
            </View>
          );
        })}
      </View>
    );
  }

  toggleLayout = (): void => {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  render(): JSX.Element {
    const dropdownIconStyle: StyleProp<ImageStyle> =
      this.state.expanded ? { transform: [{ rotate: '180deg'}] } : {};
    const dropdownIconSource: ImageURISource | ImageRequireSource =
      this.props.dropdownIcon ? this.props.dropdownIcon : icons.arrow;
    const { styles } = this.props;

    return (
      <View style={[S.container, !!styles && styles.container]}>
        <TouchableOpacity onPress={this.toggleLayout}>
          <View style={[S.headerContainer, !!styles && styles.headerContainer]}>
            {this.renderHeaderTitle()}
            <Image
              source={dropdownIconSource}
              style={[!!styles && styles.headerIcon, dropdownIconStyle]}
            />
          </View>
        </TouchableOpacity>
        {this.state.expanded ? this.renderContent() : null}
      </View>
    );
  }
}

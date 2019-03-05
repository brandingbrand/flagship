/* tslint:disable:jsx-use-translation-function */
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PSScreenWrapper from '../components/PSScreenWrapper';
import { NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import { navBarTabLanding } from '../styles/Navigation';
import PageDots, { PageDotsProps } from '../components/PageDots';
import { color, palette } from '../styles/variables';

type Screen = import ('react-native-navigation').Screen;

export interface PageDotsSampleScreenProps extends ScreenProps, PageDotsProps {}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 15,
    height: 85
  },
  activeDot: {
    backgroundColor: palette.primary,
    width: 15,
    height: 15,
    borderRadius: 15
  },
  inactiveDot: {
    backgroundColor: color.lightGray,
    width: 15,
    height: 15,
    borderRadius: 15,
    borderColor: palette.secondary,
    borderWidth: 0.5
  }
});

class PageDotsSample extends Component<PageDotsSampleScreenProps> {
  static navigatorStyle: NavigatorStyle = navBarTabLanding;

  render(): JSX.Element {

    const { navigator } = this.props;

    return (
      <PSScreenWrapper
        hideGlobalBanner={true}
        navigator={navigator}
      >
        <View style={styles.container}>
          <Text>{'First Page'}</Text>
          <PageDots
            numDots={5}
            activeIndex={0}
            activeDotStyle={styles.activeDot}
            inactiveDotStyle={styles.inactiveDot}
          />
        </View>
        <View style={styles.container}>
          <Text>{'Second Page'}</Text>
          <PageDots
            numDots={5}
            activeIndex={1}
            activeDotStyle={styles.activeDot}
            inactiveDotStyle={styles.inactiveDot}
          />
      </View>
      <View style={styles.container}>
        <Text>{'Fourth Page'}</Text>
        <PageDots
          numDots={5}
          activeIndex={3}
          activeDotStyle={styles.activeDot}
          inactiveDotStyle={styles.inactiveDot}
        />
    </View>
      </PSScreenWrapper>
    );
  }

  goTo = (screen: Screen) => () => {
    this.props.navigator.push(screen);
  }
}

export default PageDotsSample;

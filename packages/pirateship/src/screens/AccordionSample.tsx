/* tslint:disable:jsx-use-translation-function */
import React, { Component } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { LayoutComponent, Options } from 'react-native-navigation';
import PSScreenWrapper from '../components/PSScreenWrapper';
import { ScreenProps } from '../lib/commonTypes';
import { navBarTabLanding } from '../styles/Navigation';
import { Accordion, AccordionProps } from '@brandingbrand/fscomponents';

export interface AccordionSampleScreenProps extends ScreenProps, AccordionProps {}

const styles = StyleSheet.create({
  section: {
    padding: 15
  }
});

class AccordionSample extends Component<AccordionSampleScreenProps> {
  static options: Options = navBarTabLanding;

  render(): JSX.Element {
    const icons = {
      closed: require('../../assets/images/alert.png'),
      open: require('../../assets/images/check.png'),
      arrow: require('../../assets/images/arrow-green.png')
    };
    const content = (
      <View>
        <Text>Sub Menu Item</Text>
      </View>
    );
    const imageContent = (
      <View>
        <Text>Sub Menu Item</Text>
        <Image
          resizeMode='contain'
          source={{ uri: 'https://via.placeholder.com/350x150' }}
          style={{ height: 150, width: 350 }}
        />
      </View>
    );

    return (
      <PSScreenWrapper
        hideGlobalBanner={true}
        navigator={this.props.navigator}
      >
        <View style={styles.section}>
          <Accordion
            title={<Text>Basic Usage</Text>}
            content={content}
          />
          <Accordion
            title={<Text>Accordion with Image</Text>}
            content={imageContent}
          />
          <Accordion
            title={<Text>Accordion with Arrow Disclosure Icon</Text>}
            content={content}
            arrowIconImage={icons.arrow}
            iconFormat={'arrow'}
          />
          <Accordion
            title={<Text>Accordion with Custom Disclosure Icon</Text>}
            content={content}
            iconFormat={'image'}
            openIconImage={icons.open}
            closedIconImage={icons.closed}
          />
          <Accordion
            title={'Open Parent Accordion with Image'}
            state={'open'}
          >
            <Accordion
              title={<Text>Nested Accordion with Image</Text>}
              content={imageContent}
              paddingHorizontal={0}
            />
          </Accordion>
        </View>
      </PSScreenWrapper>
    );
  }

  goTo = (component: LayoutComponent) => () => {
    this.props.navigator.push({ component })
    .catch(e => console.warn(`${component.name} PUSH error: `, e));
  }
}

export default AccordionSample;

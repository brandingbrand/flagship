/* tslint:disable */
import React, { Component } from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from './SliderEntry.style';

export interface RenderItemProps {
  data?: any;
  index?: number;
  parallax?: any;
  parallaxProps?: any;
  even?: boolean;
  navigator: any;
  onPressOpenModal?: boolean;
  horizPadding: number;
  itemWidth: number;
}

const { height: viewportHeight } = Dimensions.get('window');
const products = [
  {
    brand: 'Yeti',
    title: 'YETI 18 oz. Rambler Bottle',
    price: '$29.99',
    reviewCount: 2095,
    image: {
      "source": {
        "uri": "https://d3qb1nni77cli0.cloudfront.net/undefined-1575577197611-yeti.jpg"
      },
      "size": {
        "width": 250,
        "height": 357
      },
      "ratio": "0.70"
    },
    productInfo: "No matter if it's hot piping coffee or cool crisp water, the YETI 18 oz.Rambler® Bottle keeps your beverage hot or cold. Featuring Over-the - Nose™ technology and an Insulated TripleHaul™ cap, the YETI Bottle is easy to drink from and offers a tight seal that prevents leaking and spills.Designed from kitchen- grade 18/8 stainless steel for a highly durable construction, you can take the YETI 18 oz. Rambler® Bottle anywhere.",
    tech: [
      'DuraCoat™ Color Coating is built to last with no chipping, fading or cracking',
      '18/8 Kitchen-grade stainless steel construction for extreme durability',
      'Double-wall vacuum insulation keeps your beverage cold longer',
      'No Sweat™ Design keeps the outside and your hands dry',
      'Over-the-Nose™ technology provides a wide opening for easy drinking and cleaning',
      'TripleHaul™ Cap is insulated, 100% leak-proof, protects from spills, and makes for simple carrying with 3-finger grip'
    ]
  },
  {
    brand: 'Hydro Flask',
    title: 'Hydro Flask Standard Mouth 24 oz. Bottle',
    price: '$26.21',
    reviewCount: 1526,
    image: {
      "source": {
        "uri": "https://d3qb1nni77cli0.cloudfront.net/undefined-1575605375608-hydro-flash.jpg"
      },
      "size": {
        "width": 250,
        "height": 355
      },
      "ratio": "0.70"
    },
    productInfo: "Cool off or heat up with this awesome Standard Mouth Bottle by Hydro Flask®! Whether you prefer coffee or refreshing ice water, this bottle keeps your favorite drink at the perfect temperature. BPA free and compatible with other Hydro Flask® lids, this water bottle boasts a powder-coated, sweat-free finish, making it ideal for your daily jaunt.",
    tech: [
      'DuraCoat™ Color Coating is built to last with no chipping, fading or cracking',
      '18/8 Kitchen-grade stainless steel construction for extreme durability',
      'Double-wall vacuum insulation keeps your beverage cold longer',
      'No Sweat™ Design keeps the outside and your hands dry',
      'Over-the-Nose™ technology provides a wide opening for easy drinking and cleaning',
      'TripleHaul™ Cap is insulated, 100% leak-proof, protects from spills, and makes for simple carrying with 3-finger grip'
    ]
  },
  {
    brand: 'Hydro Flask',
    title: 'Hydro Flask Flip Top 20 oz. Bottle',
    price: '$20.96',
    reviewCount: 562,
    image: {
      "source": {
        "uri": "https://d3qb1nni77cli0.cloudfront.net/undefined-1575605548620-hydro-flask2.jpg"
      },
      "size": {
        "width": 250,
        "height": 325
      },
      "ratio": "0.77"
    },
    productInfo: "Take your daily caffeine to go when you travel with the Hydro Flask® Flip Top Coffee Mug! Built for hot and cold beverages alike, this travel bottle delivers the same capacity as coffee shops so you’ll enjoy every drop of coffee while reducing waste! The large, wide mouth design works with the flip top lid for easy drinking and easy commutes. This bottle boasts a powder-coated finish and durable design.",
    tech: [
      'DuraCoat™ Color Coating is built to last with no chipping, fading or cracking',
      '18/8 Kitchen-grade stainless steel construction for extreme durability',
      'Double-wall vacuum insulation keeps your beverage cold longer',
      'No Sweat™ Design keeps the outside and your hands dry',
      'Over-the-Nose™ technology provides a wide opening for easy drinking and cleaning',
      'TripleHaul™ Cap is insulated, 100% leak-proof, protects from spills, and makes for simple carrying with 3-finger grip'
    ]
  },
]
export default class RenderItem extends Component<RenderItemProps> {
  get image(): any {
    const { data: { source }, parallax, parallaxProps, even } = this.props;

    return parallax ? (
      <ParallaxImage
        source={source}
        containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
        style={styles.image}
        parallaxFactor={0.35}
        showSpinner={true}
        spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
        {...parallaxProps}
      />
    ) : (
        <Image
          source={source}
          style={styles.image}
        />
      );
  }
  openCarouselModal = () => {
    if (!this.props.onPressOpenModal) {
      return;
    }
    this.props.navigator.showModal({
      screen: 'EngagementProductModal',
      animationType: 'none',
      passProps: {
        products,
        index: this.props.index
      },
      navigatorStyle: {
        navBarHidden: true,
        screenBackgroundColor: 'transparent',
        modalPresentationStyle: 'overCurrentContext',
        tabBarHidden: true,
        navBarTranslucent: true
      }
    });
  }
  render() {
    const {
      data: {
        ratio,
      title,
      subtitle
      },
      even,
      itemWidth,
      horizPadding = 0
    } = this.props;

    let itemStyle: any = {};
    if (ratio && itemWidth) {
      itemStyle = {
        width: itemWidth,
        height: itemWidth / parseFloat(ratio),
        paddingHorizontal: horizPadding
      };
    } else {
      itemStyle = {
        width: itemWidth,
        height: viewportHeight * .36,
        paddingHorizontal: horizPadding
      };
    }
    const uppercaseTitle = title ? (
      <Text
        style={[styles.title, even ? styles.titleEven : {}]}
        numberOfLines={2}
      >
        {title.toUpperCase()}
      </Text>
    ) : false;

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={itemStyle}
        onPress={this.openCarouselModal}
      >
        <View style={[styles.imageContainerNoCard, even ? {} : {}]}>
          {this.image}
        </View>
        {title && <View style={[styles.textContainer, even ? styles.textContainerEven : {}]}>
          {uppercaseTitle}
          <Text
            style={styles.subtitle}
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        </View>}
      </TouchableOpacity>
    );
  }
}

import React, { Component } from 'react';
import {
  Image,
  ImageRequireSource,
  ImageURISource,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { CartItem, Selector } from '@brandingbrand/fscomponents';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import PSStepper from './PSStepper';
import PSToggle from './PSToggle';
import { palette } from '../styles/variables';
import translate, { translationKeys } from '../lib/translations';

const noopPromise = async () => (Promise.resolve());
const icons = {
  heart: require('../../assets/images/heart.png')
};

const styles = StyleSheet.create({
  container: {
    margin: 20
  },
  itemHeader: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  itemTextHeader: {
    fontWeight: 'bold',
    color: palette.onBackground,
    fontSize: 15,
    flex: 1
  },
  itemHeaderFavorite: {
    marginLeft: 5
  },
  rightColumnStyle: {
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  stepper: {
    maxWidth: 83
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  stepperContainer: {
    minWidth: 100
  },
  itemTotal: {
    marginLeft: 'auto',
    color: palette.secondary,
    fontWeight: 'bold',
    fontSize: 17
  },
  priceContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  listPrice: {
    fontSize: 15,
    textDecorationLine: 'line-through',
    marginRight: 5
  },
  price: {
    fontSize: 15
  },
  savings: {
    fontSize: 13,
    color: palette.accent
  },
  availabilityText: {
    fontSize: 11,
    color: palette.accent
  },
  detailsText: {
    fontSize: 11
  },
  giftWrapToggle: {
    marginTop: 10
  },
  qtyText: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  productFees: {
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 13,
    fontWeight: '700'
  }
});

export interface ItemDetails {
  label: string;
  value: string;
}

export interface PSCartItemProps {
  navigateToProduct?: (item: any) => void;
  containerStyle?: StyleProp<ViewStyle>;
  itemHeaderStyle?: StyleProp<ViewStyle>;
  itemTextHeaderStyle?: StyleProp<TextStyle>;
  // TODO: fix these types to adhere to the commerce types
  item: CommerceTypes.CartItem & { [key: string]: any };
  defaultItemImage?: ImageURISource;
  updateQty?: (newQty: number) => void;
  maxQty?: number;
  addToFavorites?: () => void;
  addToFavoritesImage?: ImageURISource | ImageRequireSource;
  addToFavoritesStyle?: StyleProp<ViewStyle>;
  onGiftWrapToggle?: Function;
  isLoggedIn?: boolean;
  setItemDropshipValue?: Function;
}

export default class PSCartItem extends Component<PSCartItemProps> {
  renderRemoveButton = (): React.ReactNode => {
    // This component adds its own remove button in the form of an "x" that replaces
    // the minus quantity button when quantity is 1.
    return null;
  }

  render(): JSX.Element {
    const {
      containerStyle,
      itemHeaderStyle,
      itemTextHeaderStyle,
      item,
      addToFavorites,
      addToFavoritesImage,
      addToFavoritesStyle
    } = this.props;

    const favoriteBadge = addToFavoritesImage || icons.heart;

    return (
      <TouchableOpacity
        disabled={!this.props.navigateToProduct}
        style={[styles.container, containerStyle]}
        onPress={this.handleNav}
      >
        <View style={[styles.itemHeader, itemHeaderStyle]}>
          <Text style={[styles.itemTextHeader, itemTextHeaderStyle]}>
            {item.title}
          </Text>
          {this.props.isLoggedIn &&
          (<TouchableOpacity
            style={[styles.itemHeaderFavorite, addToFavoritesStyle]}
            onPress={addToFavorites}
          >
            <Image source={favoriteBadge} />
          </TouchableOpacity>)}
        </View>
        <CartItem
          renderDetails={this.renderDetails}
          renderStepper={this.renderStepper}
          renderRemoveButton={this.renderRemoveButton}
          rightColumnStyle={styles.rightColumnStyle}
          removeItem={noopPromise}
          updateQty={noopPromise}
          {...item}
        />
      </TouchableOpacity>
    );
  }

  handleNav = () => {
    if (this.props.navigateToProduct) {
      this.props.navigateToProduct(this.props.item);
    }
  }

  serializeDetails = (item: CommerceTypes.CartItem): ItemDetails[] => {
    const details: ItemDetails[] = [];

    if (Array.isArray(item.options)) {
      item.options.forEach(option => {
        if (Array.isArray(option.values)) {
          option.values.forEach(value =>
            details.push({
              label: option.name,
              value: value.name
            })
          );
        }
      });
    }

    return details;
  }

  /* tslint:disable:cyclomatic-complexity */
  renderDetails = () => {
    const out = [] as JSX.Element[];
    const { item, setItemDropshipValue } = this.props;
    const details = this.serializeDetails(item).map((detail, index) => {
      return (
        <Text key={index} style={styles.detailsText}>
          {`${detail.label}: ${detail.value}`}
        </Text>
      );
    });
    out.push(<View key='details'>{details}</View>);

    // need a horizontal view of strike listPrice if exits + price
    const prices = [];
    if (item.listPrice) {
      prices.push(
        <Text key='listPrice' style={styles.listPrice}>
          {translate.currency(item.listPrice)}
        </Text>
      );
    }

    if (item.price) {
      prices.push(
        <Text key='price' style={styles.price}>
          {translate.currency(item.price)}
        </Text>
      );
    }
    out.push(
      <View key='prices' style={styles.priceContainer}>
        {prices}
      </View>
    );

    // red line of savings price
    if (item.savings) {
      out.push(
        <Text key='savings' style={styles.savings}>
          {item.savings}
        </Text>
      );
    }

    if (item.promotions) {
      item.promotions.forEach((promo, index) => {
        if (!promo.price) {
          return;
        }

        out.push(
          <Text key={'promo' + index} style={styles.savings}>
            {translate.currency(promo.price)}
          </Text>
        );
      });
    }

    // product fees e.g. truck freight
    if (item.productFees) {
      out.push(
        <Text key='productFees' style={styles.productFees}>
          {item.productFees}
        </Text>
      );
    }
    // red line of shipping status
    if (item.availableText) {
      out.push(
        <Text key='availableText' style={styles.availabilityText}>
          {item.availableText}
        </Text>
      );
    }

    if (item.shippingOptions && item.shippingOptions.shipComplete) {
      const options = Object.keys(item.shippingOptions).map(value => ({
        value,
        label: item.shippingOptions[value]
      }));
      out.push(
        <View key={'shipOpts'} style={{ paddingRight: 10 }}>
          <Selector
            selectButtonStyle={{ height: 'auto', paddingRight: 25 }}
            itemHeight={65}
            items={options}
            selectedValue={item.selectedDropshipOption}
            onValueChange={!!setItemDropshipValue && setItemDropshipValue(item)}
          />
        </View>
      );
    }

    // if item supports gift wrapping, add a checkbox for it
    if (item.giftwrap) {
      out.push(
        <PSToggle
          style={styles.giftWrapToggle}
          key='giftwrap'
          enabled={item.giftwrap === 'yes'}
          label={(
            <Text>
              {translate.string(translationKeys.item.actions.addGiftWrap.actionBtn)}
            </Text>
          )}
          onPress={this.giftWrapToggle}
        />
      );
    }

    return <View>{out}</View>;
  }

  giftWrapToggle = (enable: boolean): void => {
    if (this.props.onGiftWrapToggle) {
      this.props.onGiftWrapToggle(enable);
    }
  }

  renderStepper = () => {
    const { item, updateQty, maxQty } = this.props;

    return (
      <View style={styles.stepperRow}>
        <TouchableOpacity style={styles.stepperContainer}>
          {updateQty ? (
            <PSStepper
              initialQuantity={item.quantity}
              onChange={updateQty}
              upperLimit={maxQty}
              stepperStyle={styles.stepper}
            />
          ) : (
            <Text style={styles.qtyText}>
              {translate.string(translationKeys.item.qty)}: {item.quantity}
            </Text>
          )}
        </TouchableOpacity>
        {item.totalPrice &&
          <Text style={styles.itemTotal}>
            {translate.currency(item.totalPrice)}
          </Text>
        }
      </View>
    );
  }
}

/**
 * type: 1
 * - no detail button
 * - link phone
 *
 * type 2
 * - view detail button
 * - link phone
 *
 * type 3
 * - no detail button
 * - button phone
 *
 * type 4
 * - navigate button
 * - phone icon button
 * - no detail button
 *
 */

import React, { Component } from 'react';
import {
  Image,
  ImageStyle,
  ImageURISource,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { Distance } from '@brandingbrand/fsfoundation';
import { style as S } from '../styles/LocationItem';

import { formatAddress, formatDistance, formatHours } from '../lib/helpers';
import { Address, Hour } from '../types/Store';
import { Button } from './Button';

export interface LocationItemProps {
  format: string;

  // address
  locationName: string;
  address: Address;

  // hour
  hours: Hour[];
  hourFormat?: string;

  // bottom button
  buttonTitle?: string;
  onButtonPress?: () => void;

  // nav button
  navIcon?: ImageURISource;
  onNavButtonPress?: () => void;

  // distance
  distance?: Distance;
  distanceFormat?: string;

  // phone button
  phone: string;
  phoneIcon?: ImageURISource;
  onPhoneButtonPress?: () => void;

  // store image
  storeImage?: ImageURISource;
  storeImageStyle?: StyleProp<ImageStyle>;

  // style
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  textStyle?: StyleProp<TextStyle>;
  linkStyle?: StyleProp<ViewStyle>;
  linkTitleStyle?: StyleProp<TextStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTitleStyle?: StyleProp<TextStyle>;
}

export class LocationItem extends Component<LocationItemProps> {
  render(): any {
    const { format, style } = this.props;

    return (
      <View style={[S.container, style]}>{this.renderByFormat(format)}</View>
    );
  }

  /* tslint:disable */
  renderByFormat = (format: string) => {
    switch (format) {
      case '1':
        return this.renderFormat1();
      case '2':
        return this.renderFormat2();
      case '3':
        return this.renderFormat3();
      case '4':
        return this.renderFormat4();
      case '5':
        return this.renderFormat5();
      case '6':
        return this.renderFormat6();
      case '7':
        return this.renderFormat7();
      case '8':
        return this.renderFormat8();
      case '9':
        return this.renderFormat9();
      case '10':
        return this.renderFormat10();
      case '11':
        return this.renderFormat11();
      default:
        return this.renderFormat1();
    }
  };
  /* tslint:enable */

  renderStoreDetail = (options: any = {}) => {
    const {
      locationName,
      address,
      hours,
      hourFormat,
      titleStyle,
      textStyle,
      distance,
      distanceFormat
    } = this.props;
    return (
      <View style={S.storeDetailContainer} accessible={true}>
        <Text style={[S.locationName, titleStyle]}>{locationName}</Text>
        <Text style={textStyle}>{formatAddress(address)}</Text>
        {options.showDistance &&
        distance && (
          <Text style={textStyle}>
            {formatDistance(distance, distanceFormat)} | {address.city}
          </Text>
        )}
        <Text style={textStyle}>
          {formatHours(hours, new Date(), hourFormat)}
        </Text>
      </View>
    );
  }

  renderNavIcon = (options: any = {}) => {
    const {
      navIcon,
      distance,
      onNavButtonPress,
      distanceFormat,
      locationName
    } = this.props;

    if (!navIcon) {
      return null;
    }

    const shouldShowDistance = options.showDistance && distance;
    return (
      <TouchableOpacity
        style={S.navIconContainer}
        onPress={onNavButtonPress}
        accessibilityLabel={`Start navigating to ${locationName}`}
        accessible={true}
      >
        <View>
          <Image source={navIcon} style={S.icon} resizeMode='contain' />
          {distance && shouldShowDistance && (
            <Text style={S.distance}>
              {formatDistance(distance, distanceFormat)}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  renderPhoneIcon = () => {
    const { phoneIcon, onPhoneButtonPress, locationName } = this.props;

    if (!phoneIcon) {
      return null;
    }

    return (
      <TouchableOpacity
        style={S.phoneIconContainer}
        onPress={onPhoneButtonPress}
        accessibilityLabel={`Call ${locationName}`}
        accessible={true}
      >
        <Image source={phoneIcon} style={S.icon} resizeMode='contain' />
      </TouchableOpacity>
    );
  }

  renderBottomButton = () => {
    const {
      buttonTitle,
      onButtonPress,
      buttonStyle,
      buttonTitleStyle
    } = this.props;

    if (!onButtonPress) {
      console.warn('onButtonPress must be specified to display bottom button');
      return null;
    }

    if (!buttonTitle) {
      console.warn('buttonTitle is required for this format');
      return null;
    }

    return (
      <Button
        title={buttonTitle}
        style={buttonStyle}
        titleStyle={buttonTitleStyle}
        onPress={onButtonPress}
      />
    );
  }

  renderFormat1 = () => {
    const { phone, onPhoneButtonPress, linkStyle, linkTitleStyle } = this.props;

    if (!onPhoneButtonPress) {
      console.warn('onPhoneButtonPress is required for this format');
      return null;
    }

    return (
      <View>
        <View style={S.topSection}>
          <View style={S.leftSection}>
            {this.renderStoreDetail()}
            <Button
              link
              style={[S.linkButton, linkStyle]}
              titleStyle={[S.linkButtonText, linkTitleStyle]}
              title={phone}
              onPress={onPhoneButtonPress}
              accessibilityLabel={`call ${phone}`}
            />
          </View>
          <View style={S.rightSection}>
            {this.renderNavIcon({ showDistance: true })}
          </View>
        </View>
      </View>
    );
  }

  renderFormat2 = () => {
    const { phone, onPhoneButtonPress, linkStyle, linkTitleStyle } = this.props;

    if (!onPhoneButtonPress) {
      console.warn('onPhoneButtonPress is required for this format');
      return null;
    }

    return (
      <View>
        <View style={S.topSection}>
          <View style={S.leftSection}>
            {this.renderStoreDetail()}
            <Button
              link
              style={[S.linkButton, linkStyle]}
              titleStyle={[S.linkButtonText, linkTitleStyle]}
              title={phone}
              onPress={onPhoneButtonPress}
              accessibilityLabel={`call ${phone}`}
            />
          </View>
          <View style={S.rightSection}>
            {this.renderNavIcon({ showDistance: true })}
          </View>
        </View>
        <View style={S.bottomSection}>{this.renderBottomButton()}</View>
      </View>
    );
  }

  renderFormat3 = () => {
    return (
      <View>
        <View style={S.topSection}>
          <View style={S.leftSection}>{this.renderStoreDetail()}</View>
          <View style={S.rightSection}>
            {this.renderNavIcon({ showDistance: true })}
          </View>
        </View>
        <View style={S.bottomSection}>{this.renderBottomButton()}</View>
      </View>
    );
  }

  renderFormat4 = () => {
    return (
      <View>
        <View style={S.topSection}>
          <View style={S.leftSection}>{this.renderStoreDetail()}</View>
          <View style={S.rightSection}>{this.renderPhoneIcon()}</View>
        </View>
        <View style={S.bottomSection}>{this.renderBottomButton()}</View>
      </View>
    );
  }

  renderFormat5 = () => {
    return (
      <View>
        <View style={S.topSection}>
          <View style={S.leftSection}>
            {this.renderStoreDetail({ showDistance: true })}
          </View>
          <View style={S.twoIconsContainer}>
            {this.renderPhoneIcon()}
            {this.renderNavIcon({ showDistance: false })}
          </View>
        </View>
      </View>
    );
  }

  renderFormat6 = () => {
    return (
      <View>
        <View style={S.topSection}>
          <View style={S.leftSection}>
            {this.renderStoreDetail({ showDistance: true })}
          </View>
          <View style={S.twoIconsContainer}>
            {this.renderPhoneIcon()}
            {this.renderNavIcon({ showDistance: false })}
          </View>
        </View>
        <View style={S.bottomSection}>{this.renderBottomButton()}</View>
      </View>
    );
  }

  renderFormat7 = () => {
    const { storeImage } = this.props;
    return (
      <View>
        <View style={S.topSection}>
          {!!storeImage && <Image source={storeImage} style={S.storeImage} />}
          <View style={S.leftSection}>
            {this.renderStoreDetail({ showDistance: true })}
          </View>
          <View style={S.twoIconsContainerVertical}>
            {this.renderNavIcon({ showDistance: false })}
            {this.renderPhoneIcon()}
          </View>
        </View>
      </View>
    );
  }

  renderFormat8 = () => {
    const { storeImage } = this.props;
    return (
      <View>
        <View style={S.topSection}>
          {!!storeImage && <Image source={storeImage} style={S.storeImage} />}
          <View style={S.leftSection}>
            {this.renderStoreDetail({ showDistance: true })}
          </View>
          <View style={S.twoIconsContainerVertical}>
            {this.renderNavIcon({ showDistance: false })}
            {this.renderPhoneIcon()}
          </View>
        </View>
        <View style={S.bottomSection}>{this.renderBottomButton()}</View>
      </View>
    );
  }

  renderFormat9 = () => {
    const { storeImage } = this.props;
    return (
      <View>
        <View style={S.topSection}>
          {!!storeImage && <Image source={storeImage} style={S.storeImage} />}
          <View style={S.leftSection}>
            {this.renderStoreDetail({ showDistance: true })}
          </View>
          <View style={S.rightSection}>
            {this.renderNavIcon({ showDistance: false })}
          </View>
        </View>
        <View style={S.bottomSection}>{this.renderBottomButton()}</View>
      </View>
    );
  }

  renderFormat10 = () => {
    const { storeImage } = this.props;
    return (
      <View>
        <View style={S.topSection}>
          {!!storeImage && <Image source={storeImage} style={S.storeImage} />}
          <View style={S.leftSection}>
            {this.renderStoreDetail({ showDistance: true })}
          </View>
          <View style={S.rightSection}>{this.renderPhoneIcon()}</View>
        </View>
        <View style={S.bottomSection}>{this.renderBottomButton()}</View>
      </View>
    );
  }

  renderFormat11 = () => {
    const {
      linkStyle,
      linkTitleStyle,
      buttonTitle,
      onButtonPress
    } = this.props;

    if (!onButtonPress) {
      console.warn('onButtonPress is required for this format');
      return null;
    }

    if (!buttonTitle) {
      console.warn('buttonTitle is required for this format');
      return null;
    }

    return (
      <View>
        <View style={S.topSection}>
          <View style={S.leftSection}>
            {this.renderStoreDetail({ showDistance: true })}
            <Button
              link
              style={[S.linkButton, linkStyle]}
              titleStyle={[S.linkButtonText, linkTitleStyle]}
              title={buttonTitle}
              onPress={onButtonPress}
            />
          </View>
          <View
            style={[
              S.twoIconsContainerVertical,
              S.twoIconsContainerVerticalTall
            ]}
          >
            {this.renderNavIcon({ showDistance: true })}
            {this.renderPhoneIcon()}
          </View>
        </View>
      </View>
    );
  }
}

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

import React from 'react';

import { Image, Text, TouchableOpacity, View } from 'react-native';
import type {
  ImageSourcePropType,
  ImageStyle,
  ImageURISource,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import type { Distance } from '@brandingbrand/types-location';

import { formatAddress, formatDistance, formatHours } from '../lib/helpers';
import { style as S } from '../styles/LocationItem';
import type { Address, Hour } from '../types/Store';

import { Button } from './Button';

export interface SerializableLocationItemProps {
  format: string;

  // address
  locationName: string;

  // hour
  hourFormat?: string;

  // bottom button
  buttonTitle?: string;

  // distance
  distanceFormat?: string;

  // phone button
  phone: string;

  // store image
  storeImageStyle?: ImageStyle;

  // style
  style?: ViewStyle;
  titleStyle?: TextStyle;
  textStyle?: TextStyle;
  linkStyle?: ViewStyle;
  linkTitleStyle?: TextStyle;
  buttonStyle?: ViewStyle;
  buttonTitleStyle?: TextStyle;
}

export interface LocationItemProps
  extends Omit<
    SerializableLocationItemProps,
    | 'buttonStyle'
    | 'buttonTitleStyle'
    | 'linkStyle'
    | 'linkTitleStyle'
    | 'storeImageStyle'
    | 'style'
    | 'textStyle'
    | 'titleStyle'
  > {
  // address
  address: Address;

  // hour
  hours: Hour[];

  // bottom button
  onButtonPress?: () => void;

  // nav button
  navIcon?: ImageSourcePropType;
  onNavButtonPress?: () => void;

  // distance
  distance?: Distance;

  // phone button
  phoneIcon?: ImageSourcePropType;
  onPhoneButtonPress?: () => void;

  // store image
  storeImage?: ImageSourcePropType;
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

interface RenderOption {
  showDistance?: boolean;
}

// eslint-disable-next-line max-lines-per-function
export const LocationItem: React.FunctionComponent<LocationItemProps> = (props) => {
  const { format, style } = props;

  const renderByFormat = (format: string) => {
    switch (format) {
      case '1':
        return renderFormat1();
      case '2':
        return renderFormat2();
      case '3':
        return renderFormat3();
      case '4':
        return renderFormat4();
      case '5':
        return renderFormat5();
      case '6':
        return renderFormat6();
      case '7':
        return renderFormat7();
      case '8':
        return renderFormat8();
      case '9':
        return renderFormat9();
      case '10':
        return renderFormat10();
      case '11':
        return renderFormat11();
      default:
        return renderFormat1();
    }
  };

  const renderStoreDetail = (options: RenderOption = {}) => {
    const {
      address,
      distance,
      distanceFormat,
      hourFormat,
      hours,
      locationName,
      textStyle,
      titleStyle,
    } = props;
    return (
      <View accessible style={S.storeDetailContainer}>
        <Text style={[S.locationName, titleStyle]}>{locationName}</Text>
        <Text style={textStyle}>{formatAddress(address)}</Text>
        {options.showDistance && distance ? (
          <Text style={textStyle}>
            {formatDistance(distance, distanceFormat)} | {address.city}
          </Text>
        ) : null}
        <Text style={textStyle}>{formatHours(hours, new Date(), hourFormat)}</Text>
      </View>
    );
  };

  const renderNavIcon = (options: RenderOption = {}) => {
    const { distance, distanceFormat, locationName, navIcon, onNavButtonPress } = props;

    if (!navIcon) {
      return null;
    }

    const shouldShowDistance = options.showDistance && distance;
    return (
      <TouchableOpacity
        accessibilityLabel={`Start navigating to ${locationName}`}
        accessible
        onPress={onNavButtonPress}
        style={S.navIconContainer}
      >
        <View>
          <Image resizeMode="contain" source={navIcon} style={S.icon} />
          {distance && shouldShowDistance ? (
            <Text style={S.distance}>{formatDistance(distance, distanceFormat)}</Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const renderPhoneIcon = () => {
    const { locationName, onPhoneButtonPress, phoneIcon } = props;

    if (!phoneIcon) {
      return null;
    }

    return (
      <TouchableOpacity
        accessibilityLabel={`Call ${locationName}`}
        accessible
        onPress={onPhoneButtonPress}
        style={S.phoneIconContainer}
      >
        <Image resizeMode="contain" source={phoneIcon} style={S.icon} />
      </TouchableOpacity>
    );
  };

  const renderBottomButton = () => {
    const { buttonStyle, buttonTitle, buttonTitleStyle, onButtonPress } = props;

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
        onPress={onButtonPress}
        style={buttonStyle}
        title={buttonTitle}
        titleStyle={buttonTitleStyle}
      />
    );
  };

  const renderFormat1 = () => {
    const { linkStyle, linkTitleStyle, onPhoneButtonPress, phone } = props;

    if (!onPhoneButtonPress) {
      console.warn('onPhoneButtonPress is required for this format');
      return null;
    }

    return (
      <View>
        <View style={S.topSection}>
          <View style={S.leftSection}>
            {renderStoreDetail()}
            <Button
              accessibilityLabel={`call ${phone}`}
              link
              onPress={onPhoneButtonPress}
              style={[S.linkButton, linkStyle]}
              title={phone}
              titleStyle={[S.linkButtonText, linkTitleStyle]}
            />
          </View>
          <View style={S.rightSection}>{renderNavIcon({ showDistance: true })}</View>
        </View>
      </View>
    );
  };

  const renderFormat2 = () => {
    const { linkStyle, linkTitleStyle, onPhoneButtonPress, phone } = props;

    if (!onPhoneButtonPress) {
      console.warn('onPhoneButtonPress is required for this format');
      return null;
    }

    return (
      <View>
        <View style={S.topSection}>
          <View style={S.leftSection}>
            {renderStoreDetail()}
            <Button
              accessibilityLabel={`call ${phone}`}
              link
              onPress={onPhoneButtonPress}
              style={[S.linkButton, linkStyle]}
              title={phone}
              titleStyle={[S.linkButtonText, linkTitleStyle]}
            />
          </View>
          <View style={S.rightSection}>{renderNavIcon({ showDistance: true })}</View>
        </View>
        <View style={S.bottomSection}>{renderBottomButton()}</View>
      </View>
    );
  };

  const renderFormat3 = () => (
    <View>
      <View style={S.topSection}>
        <View style={S.leftSection}>{renderStoreDetail()}</View>
        <View style={S.rightSection}>{renderNavIcon({ showDistance: true })}</View>
      </View>
      <View style={S.bottomSection}>{renderBottomButton()}</View>
    </View>
  );

  const renderFormat4 = () => (
    <View>
      <View style={S.topSection}>
        <View style={S.leftSection}>{renderStoreDetail()}</View>
        <View style={S.rightSection}>{renderPhoneIcon()}</View>
      </View>
      <View style={S.bottomSection}>{renderBottomButton()}</View>
    </View>
  );

  const renderFormat5 = () => (
    <View>
      <View style={S.topSection}>
        <View style={S.leftSection}>{renderStoreDetail({ showDistance: true })}</View>
        <View style={S.twoIconsContainer}>
          {renderPhoneIcon()}
          {renderNavIcon({ showDistance: false })}
        </View>
      </View>
    </View>
  );

  const renderFormat6 = () => (
    <View>
      <View style={S.topSection}>
        <View style={S.leftSection}>{renderStoreDetail({ showDistance: true })}</View>
        <View style={S.twoIconsContainer}>
          {renderPhoneIcon()}
          {renderNavIcon({ showDistance: false })}
        </View>
      </View>
      <View style={S.bottomSection}>{renderBottomButton()}</View>
    </View>
  );

  const renderFormat7 = () => {
    const { storeImage } = props;
    return (
      <View>
        <View style={S.topSection}>
          {storeImage !== undefined && <Image source={storeImage} style={S.storeImage} />}
          <View style={S.leftSection}>{renderStoreDetail({ showDistance: true })}</View>
          <View style={S.twoIconsContainerVertical}>
            {renderNavIcon({ showDistance: false })}
            {renderPhoneIcon()}
          </View>
        </View>
      </View>
    );
  };

  const renderFormat8 = () => {
    const { storeImage } = props;
    return (
      <View>
        <View style={S.topSection}>
          {storeImage !== undefined && <Image source={storeImage} style={S.storeImage} />}
          <View style={S.leftSection}>{renderStoreDetail({ showDistance: true })}</View>
          <View style={S.twoIconsContainerVertical}>
            {renderNavIcon({ showDistance: false })}
            {renderPhoneIcon()}
          </View>
        </View>
        <View style={S.bottomSection}>{renderBottomButton()}</View>
      </View>
    );
  };

  const renderFormat9 = () => {
    const { storeImage } = props;
    return (
      <View>
        <View style={S.topSection}>
          {storeImage !== undefined && <Image source={storeImage} style={S.storeImage} />}
          <View style={S.leftSection}>{renderStoreDetail({ showDistance: true })}</View>
          <View style={S.rightSection}>{renderNavIcon({ showDistance: false })}</View>
        </View>
        <View style={S.bottomSection}>{renderBottomButton()}</View>
      </View>
    );
  };

  const renderFormat10 = () => {
    const { storeImage } = props;
    return (
      <View>
        <View style={S.topSection}>
          {storeImage !== undefined && <Image source={storeImage} style={S.storeImage} />}
          <View style={S.leftSection}>{renderStoreDetail({ showDistance: true })}</View>
          <View style={S.rightSection}>{renderPhoneIcon()}</View>
        </View>
        <View style={S.bottomSection}>{renderBottomButton()}</View>
      </View>
    );
  };

  const renderFormat11 = () => {
    const { buttonTitle, linkStyle, linkTitleStyle, onButtonPress } = props;

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
            {renderStoreDetail({ showDistance: true })}
            <Button
              link
              onPress={onButtonPress}
              style={[S.linkButton, linkStyle]}
              title={buttonTitle}
              titleStyle={[S.linkButtonText, linkTitleStyle]}
            />
          </View>
          <View style={[S.twoIconsContainerVertical, S.twoIconsContainerVerticalTall]}>
            {renderNavIcon({ showDistance: true })}
            {renderPhoneIcon()}
          </View>
        </View>
      </View>
    );
  };
  return <View style={[S.container, style]}>{renderByFormat(format)}</View>;
};

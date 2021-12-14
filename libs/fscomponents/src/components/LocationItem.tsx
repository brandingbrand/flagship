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

export interface LocationItemProps extends Omit<SerializableLocationItemProps,
  'storeImageStyle' |
  'style' |
  'titleStyle' |
  'textStyle' |
  'linkStyle' |
  'linkTitleStyle' |
  'buttonStyle' |
  'buttonTitleStyle'
  > {

  // address
  address: Address;

  // hour
  hours: Hour[];

  // bottom button
  onButtonPress?: () => void;

  // nav button
  navIcon?: ImageURISource;
  onNavButtonPress?: () => void;

  // distance
  distance?: Distance;

  // phone button
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

interface RenderOption {
  showDistance?: boolean;
}

export const LocationItem: React.FunctionComponent<LocationItemProps> = props => {
  const { format, style } = props;

  /* tslint:disable */
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

  /* tslint:enable */

  const renderStoreDetail = (options: RenderOption = {}) => {
    const {
      locationName,
      address,
      hours,
      hourFormat,
      titleStyle,
      textStyle,
      distance,
      distanceFormat
    } = props;
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
  };

  const renderNavIcon = (options: RenderOption = {}) => {
    const {
      navIcon,
      distance,
      onNavButtonPress,
      distanceFormat,
      locationName
    } = props;

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
  };

  const renderPhoneIcon = () => {
    const { phoneIcon, onPhoneButtonPress, locationName } = props;

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
  };

  const renderBottomButton = () => {
    const {
      buttonTitle,
      onButtonPress,
      buttonStyle,
      buttonTitleStyle
    } = props;

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
  };

  const renderFormat1 = () => {
    const { phone, onPhoneButtonPress, linkStyle, linkTitleStyle } = props;

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
              link
              style={[S.linkButton, linkStyle]}
              titleStyle={[S.linkButtonText, linkTitleStyle]}
              title={phone}
              onPress={onPhoneButtonPress}
              accessibilityLabel={`call ${phone}`}
            />
          </View>
          <View style={S.rightSection}>
            {renderNavIcon({ showDistance: true })}
          </View>
        </View>
      </View>
    );
  };

  const renderFormat2 = () => {
    const { phone, onPhoneButtonPress, linkStyle, linkTitleStyle } = props;

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
              link
              style={[S.linkButton, linkStyle]}
              titleStyle={[S.linkButtonText, linkTitleStyle]}
              title={phone}
              onPress={onPhoneButtonPress}
              accessibilityLabel={`call ${phone}`}
            />
          </View>
          <View style={S.rightSection}>
            {renderNavIcon({ showDistance: true })}
          </View>
        </View>
        <View style={S.bottomSection}>{renderBottomButton()}</View>
      </View>
    );
  };

  const renderFormat3 = () => {
    return (
      <View>
        <View style={S.topSection}>
          <View style={S.leftSection}>{renderStoreDetail()}</View>
          <View style={S.rightSection}>
            {renderNavIcon({ showDistance: true })}
          </View>
        </View>
        <View style={S.bottomSection}>{renderBottomButton()}</View>
      </View>
    );
  };

  const renderFormat4 = () => {
    return (
      <View>
        <View style={S.topSection}>
          <View style={S.leftSection}>{renderStoreDetail()}</View>
          <View style={S.rightSection}>{renderPhoneIcon()}</View>
        </View>
        <View style={S.bottomSection}>{renderBottomButton()}</View>
      </View>
    );
  };

  const renderFormat5 = () => {
    return (
      <View>
        <View style={S.topSection}>
          <View style={S.leftSection}>
            {renderStoreDetail({ showDistance: true })}
          </View>
          <View style={S.twoIconsContainer}>
            {renderPhoneIcon()}
            {renderNavIcon({ showDistance: false })}
          </View>
        </View>
      </View>
    );
  };

  const renderFormat6 = () => {
    return (
      <View>
        <View style={S.topSection}>
          <View style={S.leftSection}>
            {renderStoreDetail({ showDistance: true })}
          </View>
          <View style={S.twoIconsContainer}>
            {renderPhoneIcon()}
            {renderNavIcon({ showDistance: false })}
          </View>
        </View>
        <View style={S.bottomSection}>{renderBottomButton()}</View>
      </View>
    );
  };

  const renderFormat7 = () => {
    const { storeImage } = props;
    return (
      <View>
        <View style={S.topSection}>
          {!!storeImage && <Image source={storeImage} style={S.storeImage} />}
          <View style={S.leftSection}>
            {renderStoreDetail({ showDistance: true })}
          </View>
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
          {!!storeImage && <Image source={storeImage} style={S.storeImage} />}
          <View style={S.leftSection}>
            {renderStoreDetail({ showDistance: true })}
          </View>
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
          {!!storeImage && <Image source={storeImage} style={S.storeImage} />}
          <View style={S.leftSection}>
            {renderStoreDetail({ showDistance: true })}
          </View>
          <View style={S.rightSection}>
            {renderNavIcon({ showDistance: false })}
          </View>
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
          {!!storeImage && <Image source={storeImage} style={S.storeImage} />}
          <View style={S.leftSection}>
            {renderStoreDetail({ showDistance: true })}
          </View>
          <View style={S.rightSection}>{renderPhoneIcon()}</View>
        </View>
        <View style={S.bottomSection}>{renderBottomButton()}</View>
      </View>
    );
  };

  const renderFormat11 = () => {
    const {
      linkStyle,
      linkTitleStyle,
      buttonTitle,
      onButtonPress
    } = props;

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
            {renderNavIcon({ showDistance: true })}
            {renderPhoneIcon()}
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={[S.container, style]}>{renderByFormat(format)}</View>
  );
};

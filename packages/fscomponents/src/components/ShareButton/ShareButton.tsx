import React, { FunctionComponent, memo } from 'react';
import { Clipboard, Image, Share, TouchableOpacity } from 'react-native';
import { Alert } from '../Alert';
import { ShareButtonProps } from './ShareButtonProps';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
const componentTranslationKeys = translationKeys.flagship.shareButton;

const shareImage = require('../../../assets/images/share.png');

export const ShareButton: FunctionComponent<ShareButtonProps> = memo(props => {
  const onSharePress = () => {
    Share.share(props.content, props.options).catch(e => {
      // Check for the message in react-native-web, because cancelling saving a file also throws
      if (e.message === 'Share is not supported in this browser') {
        // navigator.share isn't support by the web browser
        // Try to copy to clipboard if it is url, instead
        // @ts-ignore ShareContent has a version with url and one without
        if (props.content && props.content.url) {
          // @ts-ignore ShareContent has a version with url and one without
          const { url } = props.content;
          // @ts-ignore Web returns false on failure, native returns void
          if (Clipboard.setString(url) !== false) {
            Alert.alert(FSI18n.string(componentTranslationKeys.copied) + ': ' + url);
          } else {
            Alert.alert(FSI18n.string(componentTranslationKeys.notCopied));
          }
        } else {
          Alert.alert(FSI18n.string(componentTranslationKeys.notSupported));
        }
      }
    });
  };

  const renderShareIcon = () => {
    if (props.renderShareIcon) {
      return props.renderShareIcon();
    }

    return (
      <Image
        source={shareImage}
        style={[{
          width: 19,
          height: 23
        }, props.style]}
      />
    );
  };


  return (
    <TouchableOpacity
      onPress={onSharePress}
      accessibilityRole={'button'}
      accessibilityLabel={FSI18n.string(componentTranslationKeys.text)}
    >
      {renderShareIcon()}
    </TouchableOpacity>
  );
});

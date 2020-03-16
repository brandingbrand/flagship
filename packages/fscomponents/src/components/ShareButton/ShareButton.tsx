import React, { FunctionComponent, memo } from 'react';
import { Image, Share, TouchableOpacity } from 'react-native';
import { ShareButtonProps } from './ShareButtonProps';
import { translationKeys } from '@brandingbrand/fsi18n';
const componentTranslation = translationKeys.flagship.shareButton.text;

const shareImage = require('../../../assets/images/share.png');

export const ShareButton: FunctionComponent<ShareButtonProps> = memo(props => {
  const onSharePress = async () => {
    return Share.share(props.content, props.options);
  };

  const renderShareIcon = () => {
    if (props.renderShareIcon) {
      return props.renderShareIcon();
    }

    return <Image source={shareImage} />;
  };


  return (
    <TouchableOpacity
      onPress={onSharePress}
      accessibilityRole={'button'}
      accessibilityLabel={componentTranslation}
    >
      {renderShareIcon()}
    </TouchableOpacity>
  );
});

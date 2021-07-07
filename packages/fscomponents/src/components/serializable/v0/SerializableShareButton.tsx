import React from 'react';
import { ImageStyle } from 'react-native';
import {
  ShareButton,
  ShareButtonProps
} from '../../ShareButton';

export interface SerializableShareButtonProps extends ShareButtonProps {
  style?: ImageStyle;
}

export const SerializableShareButton = React.memo<SerializableShareButtonProps>(props => {
  return <ShareButton {...props} />;
});

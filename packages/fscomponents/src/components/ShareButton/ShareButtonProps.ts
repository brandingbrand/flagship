import {
  ImageStyle,
  ShareContent,
  ShareOptions,
  StyleProp
} from 'react-native';

// Required: content.message OR content.url
// Optional: content: title; options: dialogTitle, excludedActivityTypes, tintColor
export interface SerializeShareButtonProps {
  content: ShareContent;
  options?: ShareOptions;
  style?: ImageStyle;
}

export interface ShareButtonProps extends Omit<
  SerializeShareButtonProps,
  'style'
  > {
  renderShareIcon?: () => React.ReactElement;
  style?: StyleProp<ImageStyle>;
}

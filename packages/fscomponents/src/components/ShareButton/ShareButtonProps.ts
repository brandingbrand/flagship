import {
  ImageStyle,
  ShareContent,
  ShareOptions,
  StyleProp
} from 'react-native';

// Required: content.message OR content.url
// Optional: content: title; options: dialogTitle, excludedActivityTypes, tintColor
export interface ShareButtonProps {
  content: ShareContent;
  options?: ShareOptions;
  renderShareIcon?: () => React.ReactElement;
  style?: StyleProp<ImageStyle>;
}

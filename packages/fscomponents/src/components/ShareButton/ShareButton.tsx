import React, { PureComponent } from 'react';
import { Image, Share, TouchableOpacity } from 'react-native';
import { ShareButtonProps } from './ShareButtonProps';

const shareImage = require('../../../assets/images/share.png');

export class ShareButton extends PureComponent<ShareButtonProps> {
  onSharePress = async () => {
    return Share.share(this.props.content, this.props.options);
  }

  renderShareButton(): React.ReactNode {
    if (this.props.renderShareButton) {
      return this.props.renderShareButton();
    }

    return (
      <Image style={this.props.style} source={shareImage} />
    );
  }

  render(): JSX.Element {
    return (
      <TouchableOpacity onPress={this.onSharePress}>
        {this.renderShareButton()}
      </TouchableOpacity>
    );
  }
}

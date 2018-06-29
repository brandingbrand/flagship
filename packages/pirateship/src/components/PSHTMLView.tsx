import React, { Component } from 'react';

// @ts-ignore TODO: Add types for react-native-htmlview
import HTMLView from 'react-native-htmlview';

import { PSHTMLViewProps } from './PSHTMLViewProps';

export default class PSHTMLView extends Component<PSHTMLViewProps> {
  render(): JSX.Element {
    let innerHtml = this.props.html;

    if (this.props.collapseWhiteSpace) {
      innerHtml = innerHtml.replace(/\r+/g, '\r').trim();
    }

    let html = '<div>' + innerHtml + '</div>';

    const firstLi = html.indexOf('<li');
    if (firstLi > 0) {
      html = html.substr(0, firstLi) + '<br/><ul>' + html.substr(firstLi);
    }
    let lastLi = html.lastIndexOf('li/>');
    if (lastLi > 0) {
      lastLi += 4;
      html = html.substr(0, lastLi) + '<ul/>' + html.substr(lastLi);
    }

    return (
      <HTMLView
        value={html}
        stylesheet={this.props.stylesheet}
        renderNode={this.props.renderNode}
      />
    );
  }
}

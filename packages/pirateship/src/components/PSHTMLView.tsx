import React, { FunctionComponent } from 'react';

// @ts-ignore TODO: Add types for react-native-htmlview
import HTMLView from 'react-native-htmlview';
import { PSHTMLViewProps } from './PSHTMLViewProps';

const PSHTMLView: FunctionComponent<PSHTMLViewProps> = (props): JSX.Element => {

  let innerHtml = props.html;

  if (props.collapseWhiteSpace) {
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
      stylesheet={props.stylesheet}
      renderNode={props.renderNode}
    />
  );
};

export default PSHTMLView;

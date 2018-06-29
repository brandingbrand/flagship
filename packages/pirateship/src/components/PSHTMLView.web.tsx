import React, { Component } from 'react';

import { PSHTMLViewProps } from './PSHTMLViewProps';

export default class PSHTMLView extends Component<PSHTMLViewProps> {
  render(): JSX.Element {
    return (
      <div className='htmlView' dangerouslySetInnerHTML={{ __html: this.props.html }} />
    );
  }
}

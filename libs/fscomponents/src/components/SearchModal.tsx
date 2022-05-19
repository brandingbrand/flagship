import React, { Component } from 'react';

import { Modal } from './Modal';
import type { SearchScreenProps, SerializableSearchScreenProps } from './SearchScreen';
import { SearchScreen } from './SearchScreen';

interface SharedSearchModalProps {
  visible: boolean;
}

export interface SerializableSearchModalProps
  extends SerializableSearchScreenProps,
    SharedSearchModalProps {}

export interface SearchModalProps extends SearchScreenProps, SharedSearchModalProps {}

export class SearchModal extends Component<SearchModalProps> {
  public render(): JSX.Element {
    const { visible, ...searchProps } = this.props;
    return (
      <Modal animationType="fade" onRequestClose={this.props.onClose} visible={this.props.visible}>
        <SearchScreen {...searchProps} />
      </Modal>
    );
  }
}

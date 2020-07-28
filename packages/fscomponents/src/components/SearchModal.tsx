import React, { Component } from 'react';
import { Modal } from './Modal';
import { SearchScreen, SearchScreenProps, SerializableSearchScreenProps } from './SearchScreen';

interface SharedSearchModalProps {
  visible: boolean;
}

export interface SerializableSearchModalProps extends
  SerializableSearchScreenProps, SharedSearchModalProps {
}

export interface SearchModalProps extends SearchScreenProps, SharedSearchModalProps {
}

export class SearchModal extends Component<SearchModalProps> {
  searchBar: any;

  componentDidUpdate(prevProps: SearchModalProps): void {
    if (!prevProps.visible && this.props.visible) {
      setTimeout(() => {
        this.searchBar.focusInput();
      }, 100);
    }
  }

  render(): JSX.Element {
    const { visible, ...searchProps } = this.props;
    return (
      <Modal
        visible={this.props.visible}
        animationType='fade'
        onRequestClose={this.props.onClose}
      >
        <SearchScreen
          {...searchProps}
        />
      </Modal>
    );
  }
}

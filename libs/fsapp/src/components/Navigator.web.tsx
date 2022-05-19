import React, { Component } from 'react';

import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
// @ts-expect-error TODO: Update react-native-web-modal to support typing
import Modal from 'react-native-web-modal';

import type { GenericNavProp } from '../lib/nav-wrapper.web';
import type Navigator from '../lib/nav-wrapper.web';
import type { NavLayoutComponent, NavModal } from '../types';

export interface NavigatorProp extends GenericNavProp {
  navigator: Navigator;
  onDismiss: (index: number) => void;
}

const navStyle = StyleSheet.create({
  backdrop: {
    backgroundColor: 'black',
    bottom: 0,
    height: '100%',
    left: 0,
    opacity: 0.7,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%',
  },
  modal: {},
});

export default class NavRender extends Component<NavigatorProp> {
  private renderComponent(component: NavLayoutComponent): JSX.Element | null {
    const Screen = this.props.appConfig.screens[component.name];
    if (Screen) {
      return (
        <Screen
          appConfig={this.props.appConfig}
          isWebModal
          navigator={this.props.navigator}
          {...component.passProps}
        />
      );
    }
    return null;
  }

  private onDismiss(index: number): () => void {
    return (): void => {
      this.props.onDismiss(index);
    };
  }

  private readonly renderModal = (modal: NavModal, index: number): JSX.Element | null => {
    if (modal.layout.component) {
      const modalOptions =
        (modal.layout.component.options && modal.layout.component.options.modal) || {};
      return (
        <Modal
          animationType="fade"
          key={`${modal.layout.component.name}modal${index}`}
          onDismiss={this.onDismiss(index)}
          transparent
          visible
          {...modalOptions.modalProps}
        >
          <TouchableWithoutFeedback onPress={this.onDismiss(index)}>
            <View style={[navStyle.backdrop, modalOptions.backdropStyle]} />
          </TouchableWithoutFeedback>
          <View style={[navStyle.modal, modalOptions.style]}>
            {modal.layout.component.options &&
            modal.layout.component.options.topBar &&
            modal.layout.component.options.topBar.title &&
            modal.layout.component.options.topBar.title.text ? (
              <Text>{modal.layout.component.options.topBar.title.text}</Text>
            ) : null}
            {this.renderComponent(modal.layout.component)}
          </View>
        </Modal>
      );
    }
    return null;
  };

  public render(): JSX.Element {
    return <View>{this.props.modals.map(this.renderModal)}</View>;
  }
}

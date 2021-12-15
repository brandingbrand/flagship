import React, { Component } from 'react';
import { NavLayoutComponent, NavModal } from '../types';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import Navigator, { GenericNavProp } from '../lib/nav-wrapper.web';
// @ts-ignore TODO: Update react-native-web-modal to support typing
import Modal from 'react-native-web-modal';

export interface NavigatorProp extends GenericNavProp {
  navigator: Navigator;
  onDismiss: (index: number) => void;
}

const navStyle = StyleSheet.create({
  modal: {},
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0.7,
  },
});

export default class NavRender extends Component<NavigatorProp> {
  renderComponent(component: NavLayoutComponent): JSX.Element | null {
    const Screen = this.props.appConfig.screens[component.name];
    if (Screen) {
      return (
        <Screen
          appConfig={this.props.appConfig}
          navigator={this.props.navigator}
          isWebModal={true}
          {...component.passProps}
        />
      );
    }
    return null;
  }

  onDismiss(index: number): () => void {
    return (): void => {
      this.props.onDismiss(index);
    };
  }

  renderModal = (modal: NavModal, index: number): JSX.Element | null => {
    if (modal.layout.component) {
      const modalOptions =
        (modal.layout.component.options && modal.layout.component.options.modal) || {};
      return (
        <Modal
          key={modal.layout.component.name + 'modal' + index}
          transparent={true}
          visible={true}
          animationType="fade"
          onDismiss={this.onDismiss(index)}
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
    } else {
      return null;
    }
  };

  render(): JSX.Element {
    return <View>{this.props.modals.map(this.renderModal)}</View>;
  }
}

import React, { Component } from 'react';
import { NavLayoutComponent, NavModal } from '../types';
import { Modal, Text, View } from 'react-native';
import { GenericNavProp } from './screenWrapper.web';

export default class Navigator extends Component<GenericNavProp> {
  renderComponent(component: NavLayoutComponent): JSX.Element | null {
    const Screen = this.props.appConfig.screens[component.name];
    if (Screen) {
      return (
        <Screen
          appConfig={this.props.appConfig}
          navigator={this}
          {...component.passProps}
        />
      );
    }
    return null;
  }

  renderModal = (modal: NavModal, index: number): JSX.Element | null => {
    if (modal.layout.component) {
      return (
        <Modal key={'modal' + index}>
          {modal.layout.component.options &&
            modal.layout.component.options.topBar &&
            modal.layout.component.options.topBar.title &&
            modal.layout.component.options.topBar.title.text ? (
              <Text>{modal.layout.component.options.topBar.title.text}</Text>
            ) : null}
          {this.renderComponent(modal.layout.component)}
        </Modal>
      );
    } else {
      return null;
    }
  }

  render(): JSX.Element {
    return (
      <View>
        {this.props.modals.map(this.renderModal)}
      </View>
    );
  }
}

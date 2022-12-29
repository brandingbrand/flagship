import React, { Component } from 'react';

import {
  DevSettings,
  Modal,
  NativeModules,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import TouchableRow from './TouchableRow';
import type { ProjectDevMenu } from './Dev';

const styles = StyleSheet.create({
  bottomBtns: {
    flexDirection: 'row',
    marginBottom: 5,
    marginLeft: 5
  },
  closeBtn: {
    alignItems: 'center',
    backgroundColor: '#eee',
    flex: 1,
    height: 50,
    justifyContent: 'center',
    marginRight: 5
  },
  closeBtnText: {
    color: '#333'
  },
  configView: { padding: 10 },
  configViewItem: {
    marginBottom: 10,
  },
  configViewText: {
    fontSize: 12,
  },
  configViewTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  devViewcontainer: {
    backgroundColor: 'white',
    flex: 1
  },
  reloadBtn: {
    alignItems: 'center',
    backgroundColor: '#555',
    flex: 1,
    height: 50,
    justifyContent: 'center',
    marginRight: 5
  },
  reloadBtnText: {
    color: 'white'
  },
  switchBtns: {
    flexDirection: 'row',
    margin: 10
  },
  envView: {
    flex: 1,
    padding: 10,
  },
  envViewText: {
    fontSize: 12,
  }
});

interface DevMenuModalProps {
  closeModal: () => void;
  isVisible: boolean;
  projectDevMenus: ProjectDevMenu[];
  hideDevMenu: () => void;
}

interface DevMenuState {
  devView: string;
  devKeepPage: boolean;
  selectedEnv: string;
}

export default class DevMenuModal extends Component<DevMenuModalProps, DevMenuState> {
  public state: DevMenuState = {
    devView: 'menu',
    selectedEnv: '',
    devKeepPage: false
  };

  public render(): JSX.Element {
    let view = this.renderDevMenu();

    const projectDevMenu = (this.props.projectDevMenus ?? []).find(screen => screen.title == this.state.devView);
    if (!!projectDevMenu) {
      view = projectDevMenu.component;
    }

    const reloadJS = 'Reload JS';
    const close = 'Close';

    return (
      <Modal
        animationType='slide'
        transparent={false}
        visible={this.props.isVisible}
        onRequestClose={this.props.closeModal}
        style={styles.devViewcontainer}
      >
        <ScrollView>{view}</ScrollView>

        <View style={styles.bottomBtns}>
          <TouchableOpacity onPress={this.restart} style={styles.reloadBtn}>
            <Text style={styles.reloadBtnText}>{reloadJS}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.dismissModal} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>{close}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  private readonly renderDevMenu = () => {
    const projectDevMenuScreens = (this.props.projectDevMenus ?? []).map((screen, i) => (
      <TouchableRow
        key={i.toString()}
        onPress={this.showDevView(screen.title)}
        text={screen.title}
      />
    ));
    return (
      <View style={styles.devViewcontainer}>
        { projectDevMenuScreens }
        <TouchableRow onPress={this.handleHideDevMenu} text="Hide Dev Menu" />
      </View>
    );
  }

  private readonly handleHideDevMenu = () => {
    this.props.hideDevMenu();
    this.props.closeModal();
  };

  private readonly restart = () => {
    this.setState({
      devView: 'menu'
    })
    this.dismissModal();
    DevSettings.reload();
  }

  private readonly dismissModal = () => {
    this.setState({ devView: 'menu' });
    this.props.closeModal();
  }

  private readonly showDevView = (devView: string) => () => {
    this.setState({ devView });
  }
}

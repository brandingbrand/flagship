import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity} from 'react-native';
import DevModal from './DevModal';

const styles = StyleSheet.create({
  ctaContainer: {
    backgroundColor: 'rgba(0,0,0,0.36)',
    bottom: 0,
    position: 'absolute',
    left: 0
  },
  cta: {
    color: 'white',
    fontSize: 15,
    paddingLeft: 5,
    paddingRight: 5
  }
});

export interface ProjectDevMenu {
  title: string;
  component: JSX.Element;
}


export interface DevProps {
  projectDevMenus?: ProjectDevMenu[];
  version?: string;
  children: React.ReactNode;
}

const Dev: React.FC<DevProps> = props => {
  const [ctaVisible, setCtaVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const hideDevMenu = () => setCtaVisible(false);
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const devNote = props.version;

  return (
    <React.Fragment>
      {props.children}
      {ctaVisible && (
        <TouchableOpacity
          style={styles.ctaContainer}
          accessibilityLabel={'development menu'}
          accessible
          onPress={openModal}
        >
          <Text style={styles.cta}>
            {devNote}
          </Text>
        </TouchableOpacity>
      )}
      <DevModal
        hideDevMenu={hideDevMenu}
        isVisible={modalVisible}
        closeModal={closeModal}
        projectDevMenus={props.projectDevMenus ?? []}
      />
    </React.Fragment>
  );
};

export default Dev;

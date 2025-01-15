import React, {useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {useModal} from '../../shared/components/ModalProvider';

export function SignInModal(props: any) {
  const {hideModal} = useModal();

  useEffect(() => {
    new Promise(res => setTimeout(res, 3000)).then(() => {
      console.log('Pending resolve');

      hideModal('blah');
    });
  }, [hideModal]);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>/account/signin</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});

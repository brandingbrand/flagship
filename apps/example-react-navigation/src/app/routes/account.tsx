import React from 'react';
import {Text, View, StyleSheet, Button} from 'react-native';
import {useModal} from '../../shared/components/ModalProvider';

export function Account() {
  const {showModal} = useModal();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>/account</Text>
      <Button
        title="Settings"
        onPress={async () => {
          const res = await showModal('SignInModal');

          console.log('RES: ', res);
        }}
      />
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

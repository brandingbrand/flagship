import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  buttonDisable: {
    borderRadius: 1,
    tintColor: '#df3c2b',
  },
  buttonImage: {
    height: 25,
    width: 25,
  },
  buttonIncreaseHorizontalLeft: {
    marginLeft: 5,
  },
  counterHorizontalCenter: {
    marginLeft: 10,
    marginRight: 10,
  },
  counterHorizontalLeft: {
    marginRight: 10,
  },
  counterVertical: {
    marginBottom: 10,
    marginTop: 10,
  },
  stepperHorizontalContainer: {
    alignItems: 'center',
    borderColor: '#333',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 5,
  },
  stepperVerticalContainer: {
    alignItems: 'center',
    borderColor: '#333',
    borderWidth: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 5,
  },
});

export type { ImageStyle, RegisteredStyle, TextStyle, ViewStyle } from 'react-native';

import { ImageStyle, RegisteredStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
export { ImageStyle, RegisteredStyle, TextStyle, ViewStyle };

export const style = StyleSheet.create({
  buttonImage: {
    width: 25,
    height: 25,
  },
  buttonDisable: {
    tintColor: '#df3c2b',
    borderRadius: 1,
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
    marginTop: 10,
    marginBottom: 10,
  },
  stepperHorizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  stepperVerticalContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
});

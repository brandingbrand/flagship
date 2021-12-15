import { ImageStyle, RegisteredStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
export { RegisteredStyle, ViewStyle, TextStyle, ImageStyle };

export const style = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 1,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 10,
    fontSize: 14,
  },
  container: {},
  innerContainer: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 14,
    paddingHorizontal: 10,
    color: 'white',
    alignSelf: 'center',
  },
  button: {
    height: 40,
    backgroundColor: '#555',
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  errorMessageText: {
    color: 'red',
  },
});

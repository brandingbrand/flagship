import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  button: {
    alignSelf: 'stretch',
    backgroundColor: '#555',
    height: 40,
    justifyContent: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonText: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 14,
    paddingHorizontal: 10,
  },
  container: {},
  errorMessageText: {
    color: 'red',
  },
  innerContainer: {
    flexDirection: 'row',
  },
  textInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    flex: 1,
    fontSize: 14,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  title: {
    alignSelf: 'center',
    fontSize: 30,
    marginBottom: 30,
  },
});

export type { ImageStyle, RegisteredStyle, TextStyle, ViewStyle } from 'react-native';

import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    height: 30,
    paddingHorizontal: 10,
  },
  container: {
    marginHorizontal: 10,
  },
  inputContainer: {
    marginVertical: 5,
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
    marginTop: 10,
  },
  errorMessageText: {
    color: 'red',
  },
  label: {
    marginBottom: 10,
  },
});

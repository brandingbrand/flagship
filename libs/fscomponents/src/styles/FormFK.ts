import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  button: {
    alignSelf: 'stretch',
    backgroundColor: '#555',
    height: 40,
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  buttonText: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 14,
    paddingHorizontal: 10,
  },
  container: {
    marginHorizontal: 10,
  },
  errorMessageText: {
    color: 'red',
  },
  inputContainer: {
    marginVertical: 5,
  },
  label: {
    marginBottom: 10,
  },
  textInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    height: 30,
    paddingHorizontal: 10,
  },
});

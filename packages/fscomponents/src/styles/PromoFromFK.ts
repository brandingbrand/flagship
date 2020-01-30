import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  textInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10
  },

  // Inline Styles
  containerInLine: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  textFieldContainerInLine: {
    flex: 3
  },
  buttonInLine: {
    flex: 1,
    height: 40,
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#EEE',
    alignItems: 'center',
    justifyContent: 'center'
  },

  // Block Styles
  buttonBlock: {
    height: 40,
    backgroundColor: '#555',
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingHorizontal: 10
  }
});

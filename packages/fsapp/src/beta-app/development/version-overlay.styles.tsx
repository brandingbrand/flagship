import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    flexBasis: 'auto'
  },
  devNoteContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.36)'
  },
  devNote: {
    paddingLeft: 5,
    paddingRight: 5,
    color: 'white',
    fontSize: 15
  }
});

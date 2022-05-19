import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  borderBox: {
    alignContent: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  colorContainerItem: {
    borderRadius: 25,
    height: 25,
    margin: 5,
    width: 25,
  },
  colorItem: {
    borderRadius: 25,
    flex: 1,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainerItem: {
    margin: 3,
  },
  imageItem: {
    height: 25,
    width: 25,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  labelTitle: {
    fontWeight: 'bold',
  },
  selectedColorContainerItem: {
    borderColor: 'black',
    borderWidth: 2,
    padding: 1,
  },
  selectedImageContainerItem: {
    borderColor: 'black',
    borderWidth: 2,
    padding: 1,
  },
  selectedImageItem: {
    height: 19,
    width: 19,
  },
  selectedTextContainerItem: {
    borderColor: 'black',
    borderWidth: 2,
    paddingBottom: 4,
    paddingLeft: 7,
    paddingRight: 7,
    paddingTop: 4,
  },
  textContainerItem: {
    borderColor: '#666666',
    borderWidth: 1,
    margin: 3,
    paddingBottom: 5,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 5,
  },
  textItem: {
    textAlign: 'center',
  },
});

export type { ImageStyle, RegisteredStyle, TextStyle, ViewStyle } from 'react-native';

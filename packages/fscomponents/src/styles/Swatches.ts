import {
  ImageStyle,
  RegisteredStyle,
  StyleSheet,
  TextStyle,
  ViewStyle
} from 'react-native';
export { RegisteredStyle, ViewStyle, TextStyle, ImageStyle };

export const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  borderBox: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center'
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: 6
  },
  labelTitle: {
    fontWeight: 'bold'
  },
  textContainerItem: {
    borderWidth: 1,
    borderColor: '#666666',
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 8,
    paddingLeft: 8,
    margin: 3
  },
  selectedTextContainerItem: {
    borderColor: 'black',
    borderWidth: 2,
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 7,
    paddingLeft: 7
  },
  textItem: {
    textAlign: 'center'
  },
  colorContainerItem: {
    width: 25,
    height: 25,
    margin: 5,
    borderRadius: 25
  },
  selectedColorContainerItem: {
    borderColor: 'black',
    borderWidth: 2,
    padding: 1
  },
  colorItem: {
    flex: 1,
    borderRadius: 25
  },
  imageContainerItem: {
    margin: 3
  },
  selectedImageContainerItem: {
    borderColor: 'black',
    borderWidth: 2,
    padding: 1
  },
  imageItem: {
    width: 25,
    height: 25
  },
  selectedImageItem: {
    width: 19,
    height: 19
  }
});

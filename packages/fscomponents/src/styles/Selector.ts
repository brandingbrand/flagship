import {
  ImageStyle,
  RegisteredStyle,
  StyleSheet,
  TextStyle,
  ViewStyle
} from 'react-native';
export { RegisteredStyle, ViewStyle, TextStyle, ImageStyle };

export default StyleSheet.create({
  selector: {
    padding: 10,
    height: 35,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  selectorLabel: {
    minWidth: 30
  },
  placeholderStyle: {
    color: '#ccc',
    fontSize: 13
  },
  dropdownArrow: {
    width: 15,
    height: 15,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'black',
    transform: [{ rotate: '-135deg' }],
    marginTop: -8,
    marginRight: 10
  },
  itemsContainer: {
    maxHeight: 300,
    backgroundColor: 'white'
  },
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.36)',
    flex: 1,
    justifyContent: 'center'
  },
  modalContent: {
    justifyContent: 'center',
    marginLeft: 40,
    marginRight: 40
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#eeeeee',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CDCDCD'
  },
  closeButtonContainer: {
    height: 35,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    padding: 10,
    fontWeight: '600'
  },
  closeButton: {
    fontSize: 30,
    lineHeight: 30
  },
  item: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CDCDCD'
  },
  selectedItem: {
    borderLeftWidth: 2,
    borderLeftColor: 'black'
  },
  itemText: {
    padding: 10,
    paddingTop: 15,
    paddingBottom: 15
  },
  selectedItemText: {
    fontWeight: '600'
  },
  disabledItem: {
    opacity: 0.5
  }
});

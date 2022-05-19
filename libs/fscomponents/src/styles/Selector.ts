import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  closeButton: {
    fontSize: 30,
    lineHeight: 30,
  },
  closeButtonContainer: {
    alignItems: 'center',
    height: 35,
    justifyContent: 'center',
    width: 35,
  },
  disabledItem: {
    opacity: 0.5,
  },
  dropdownArrow: {
    borderColor: 'black',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    height: 15,
    marginRight: 10,
    marginTop: -8,
    transform: [{ rotate: '-135deg' }],
    width: 15,
  },
  item: {
    borderBottomColor: '#CDCDCD',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemText: {
    padding: 10,
    paddingBottom: 15,
    paddingTop: 15,
  },
  itemsContainer: {
    backgroundColor: 'white',
    maxHeight: 300,
  },
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.36)',
    flex: 1,
    justifyContent: 'center',
  },
  modalContent: {
    justifyContent: 'center',
    marginLeft: 40,
    marginRight: 40,
  },
  modalHeader: {
    alignItems: 'center',
    backgroundColor: '#eeeeee',
    borderBottomColor: '#CDCDCD',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  placeholderStyle: {
    color: '#ccc',
    fontSize: 13,
  },
  selectedItem: {
    borderLeftColor: 'black',
    borderLeftWidth: 2,
  },
  selectedItemText: {
    fontWeight: '600',
  },
  selector: {
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    height: 35,
    justifyContent: 'space-between',
    padding: 10,
  },
  selectorLabel: {
    minWidth: 30,
  },
  title: {
    fontWeight: '600',
    padding: 10,
  },
});

export type { ImageStyle, RegisteredStyle, TextStyle, ViewStyle } from 'react-native';

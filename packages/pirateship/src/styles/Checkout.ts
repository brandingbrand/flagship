import { StyleSheet } from 'react-native';
import { color, fontSize, grays, palette } from '../styles/variables';

const cardSection = {
  borderBottomWidth: StyleSheet.hairlineWidth,
  borderBottomColor: color.lightGray,
  padding: 15,
  backgroundColor: color.white
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: grays.one
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 15,
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  shippingMethodMsg: {
    margin: 15,
    fontSize: 11
  },
  formContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.lightGray,
    backgroundColor: color.white,
    marginBottom: 25
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingInner: {
    width: 50,
    height: 50,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textWithEditContainer: {
    ...cardSection,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  textWithEditArea: {
    flex: 1
  },
  textWithEditTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4
  },
  textWithEditText: {
    fontSize: 13
  },
  editButton: {
    width: 50,
    alignItems: 'flex-end'
  },
  editButtonText: {
    color: palette.secondary,
    fontSize: fontSize.base,
    fontWeight: 'bold'
  },
  creditCardContainer: {
    backgroundColor: color.white
  },
  shippingMethodList: {
    backgroundColor: color.white,
    marginTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.lightGray
  },
  cartItemsContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.lightGray,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.lightGray,
    backgroundColor: color.white
  },
  cartItemContainer: {
    margin: 15,
    paddingBottom: 15,
    borderBottomColor: color.lightGray,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  totalContainer: {
    padding: 30
  },
  continueButton: {
    marginHorizontal: 15,
    marginBottom: 15
  },
  footerButtonsContainer: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 15
  },
  footerButton: {
    flex: 1,
    margin: 5
  },
  copyrightText: {
    fontSize: 12,
    color: color.gray,
    marginTop: 15
  },
  footerContainer: {
    marginBottom: 20
  },
  editSection: {
    marginTop: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.lightGray,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.lightGray
  },
  shippingMessage: {
    paddingHorizontal: 15
  },
  selectableRowText: {
    fontSize: 15,
    paddingHorizontal: 5,
    paddingRight: 50,
    backgroundColor: color.white
  },
  selectableRowPaymentText: {
    fontSize: 15,
    paddingHorizontal: 5,
    paddingRight: 50,
    paddingLeft: 50,
    backgroundColor: color.white
  },
  selectableRow: {
    backgroundColor: color.white
  },
  selectableRowPayment: {
    flexDirection: 'row'
  },
  billingAddressTypeSelect: {
    marginTop: 10,
    marginBottom: 25,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.lightGray
  },
  signInTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    marginBottom: 15
  },
  signInText: {
    fontSize: 15,
    marginBottom: 25,
    paddingHorizontal: 15
  },
  signInContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.lightGray,
    paddingTop: 15
  },
  seperator: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.lightGray,
    marginHorizontal: 15,
    marginVertical: 20
  },
  savedAddressSelector: {
    height: 50,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.lightGray,
    backgroundColor: color.white,
    paddingHorizontal: 15
  },
  savedAddressSelectorText: {
    fontSize: 15
  },
  cvvIconButtonContainer: {
    alignItems: 'flex-end'
  },
  cvvIconButton: {
    marginTop: -50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cvvIcon: {
    width: 20,
    height: 20
  },
  cvvDoneButton: {
    height: 50,
    justifyContent: 'center'
  },
  cvvDoneButtonText: {
    color: palette.secondary,
    fontSize: 15,
    fontWeight: 'bold'
  },
  cvvImg: {
    width: 220,
    height: 120,
    marginLeft: 30
  },
  cvvImgTitle: {
    fontWeight: 'bold',
    marginBottom: 10
  },
  cvvImgContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cvvContainer: {
    flex: 1
  },
  giftCardInputContainer: {
    paddingTop: 0,
    padding: 15
  },
  giftCardInput: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.lightGray,
    fontSize: 13,
    padding: 10,
    height: 40,
    backgroundColor: color.white
  },
  giftCardApplyButton: {
    position: 'absolute',
    right: 25,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  giftCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.lightGray,
    margin: 15,
    marginTop: 0,
    padding: 10
  },
  giftCardRemoveIcon: {
    width: 20,
    height: 20,
    transform: [{ rotate: '45deg' }]
  },
  giftCardInfo: {
    padding: 15
  },
  giftCardNumber: {
    marginLeft: 20,
    flex: 1
  },
  giftCardAmout: {
    alignItems: 'flex-end'
  },
  giftCardTitle: {
    fontWeight: 'bold',
    marginBottom: 5
  },
  giftCardValue: {
    fontSize: 13
  },
  receiptSection: {
    marginHorizontal: 15
  },
  receiptSectionTitle: {
    fontSize: 17,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  receiptAddressSection: {
    marginBottom: 20
  },
  receiptSectionSubtitle: {
    fontSize: 13,
    marginBottom: 5,
    fontWeight: 'bold'
  },
  orderNumText: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  orderNumLine: {
    marginBottom: 20
  },
  ccIconContainer: {
    height: 50,
    width: 50,
    paddingLeft: 15,
    position: 'absolute',
    justifyContent: 'center'
  },
  ccIcon: {
    width: 35,
    height: 25
  },
  paypaylIcon: {
    width: 35,
    height: 25
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15
  },
  errorText: {
    marginBottom: 15,
    textAlign: 'center'
  },
  shippingMethodError: {
    padding: 15,
    color: color.red
  },
  shipNote: {
    marginHorizontal: 15
  }
});

export const shipNoteStyle = StyleSheet.create({
  div: { fontSize: 13 },
  span: { color: color.red }
});

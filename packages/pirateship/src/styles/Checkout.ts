import { StyleSheet } from 'react-native';
import { border, fontSize, palette } from '../styles/variables';

const cardSection = {
  borderBottomWidth: border.width,
  borderBottomColor: border.color,
  padding: 15,
  backgroundColor: palette.surface
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background
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
    borderTopWidth: border.width,
    borderTopColor: border.color,
    backgroundColor: palette.background,
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
    backgroundColor: palette.surface
  },
  shippingMethodList: {
    backgroundColor: palette.surface,
    marginTop: 10,
    borderTopWidth: border.width,
    borderTopColor: border.color
  },
  cartItemsContainer: {
    borderTopWidth: border.width,
    borderTopColor: border.color,
    borderBottomWidth: border.width,
    borderBottomColor: border.color,
    backgroundColor: palette.surface
  },
  cartItemContainer: {
    margin: 15,
    paddingBottom: 15,
    borderBottomColor: border.color,
    borderBottomWidth: border.width
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
    marginTop: 15
  },
  footerContainer: {
    marginBottom: 20
  },
  editSection: {
    marginTop: 15,
    borderTopWidth: border.width,
    borderTopColor: border.color,
    borderBottomWidth: border.width,
    borderBottomColor: border.color
  },
  shippingMessage: {
    paddingHorizontal: 15
  },
  selectableRowText: {
    fontSize: 15,
    paddingHorizontal: 5,
    paddingRight: 50,
    backgroundColor: palette.surface
  },
  selectableRowPaymentText: {
    fontSize: 15,
    paddingHorizontal: 5,
    paddingRight: 50,
    paddingLeft: 50,
    backgroundColor: palette.surface
  },
  selectableRow: {
    backgroundColor: palette.surface
  },
  selectableRowPayment: {
    flexDirection: 'row'
  },
  billingAddressTypeSelect: {
    marginTop: 10,
    marginBottom: 25,
    borderTopWidth: border.width,
    borderTopColor: border.color
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
    borderTopWidth: border.width,
    borderTopColor: border.color,
    paddingTop: 15
  },
  seperator: {
    borderTopWidth: border.width,
    borderTopColor: border.color,
    marginHorizontal: 15,
    marginVertical: 20
  },
  savedAddressSelector: {
    height: 50,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderWidth: border.width,
    borderColor: border.color,
    backgroundColor: palette.surface,
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
    borderWidth: border.width,
    borderColor: border.color,
    fontSize: 13,
    padding: 10,
    height: 40,
    backgroundColor: palette.surface
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
    borderBottomWidth: border.width,
    borderBottomColor: border.color,
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
    color: palette.error
  },
  shipNote: {
    marginHorizontal: 15
  }
});

export const shipNoteStyle = StyleSheet.create({
  div: { fontSize: 13 },
  span: { color: palette.accent }
});

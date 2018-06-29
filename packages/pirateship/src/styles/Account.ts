import { StyleSheet} from 'react-native';
import { color, grays, palette } from './variables';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  formContainer: {
    backgroundColor: grays.one
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: grays.two
  },
  bottomRow: {
    flex: 1,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    minHeight: 60,
    maxHeight: 60,
    backgroundColor: 'white'
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 10
  },
  loadingButton: {
    marginVertical: 10
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  addressContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: color.lightGray
  },
  addressTitleText: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 5
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    paddingTop: 20
  },
  editLinkText: {
    fontWeight: 'bold',
    color: palette.secondary,
    fontSize: 15,
    paddingRight: 20,
    borderRightWidth: 1,
    borderRightColor: color.lightGray
  },
  deleteLinkText: {
    color: color.red,
    fontWeight: 'bold',
    fontSize: 15,
    paddingRight: 20,
    marginRight: 20,
    borderRightWidth: 1,
    borderRightColor: color.lightGray
  }
});

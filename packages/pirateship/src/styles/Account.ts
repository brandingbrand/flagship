import { StyleSheet} from 'react-native';
import { border, palette } from './variables';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  formContainer: {
    backgroundColor: palette.surface
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: border.width,
    borderBottomColor: border.color
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
    borderTopWidth: border.width,
    borderTopColor: border.color
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
    borderRightWidth: border.width,
    borderRightColor: border.color
  },
  deleteLinkText: {
    color: palette.accent,
    fontWeight: 'bold',
    fontSize: 15,
    paddingRight: 20,
    marginRight: 20,
    borderRightWidth: border.width,
    borderRightColor: border.color
  }
});

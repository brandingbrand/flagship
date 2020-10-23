import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
export { ViewStyle, TextStyle, ImageStyle };

export const style = StyleSheet.create({
  container: {
    flex: 1,
    flexBasis: 'auto'
  },
  loading: {
    paddingTop: 20
  },
  list: {
    flex: 1,
    backgroundColor: '#eee',
    paddingRight: 10
  },
  productImage: {
    width: 100,
    height: 100
  },
  productItem: {
    margin: 10,
    marginBottom: 0,
    marginRight: 0,
    padding: 10,
    backgroundColor: 'white',
    flex: 1
  },
  actionBar: {
    paddingLeft: 10,
    paddingTop: 10
  },
  modalHeader: {
    height: 70,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#eee'
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  modalHeaderCloseText: {},
  modalHeaderClose: {
    height: 70,
    paddingTop: 20,
    paddingHorizontal: 10,
    position: 'absolute',
    left: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  resetButton: {
    width: 150,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee'
  },
  noResultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  noResultText: {
    marginBottom: 20
  },
  modalContainer: {
    flex: 1
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadMoreButton: {
    height: 40,
    marginVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: 'white'
  },
  loadingLoadMore: {
    height: 40,
    paddingTop: 0,
    marginVertical: 10
  },
  error: {
    textAlign: 'center',
    margin: 20
  },
  modelLoadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

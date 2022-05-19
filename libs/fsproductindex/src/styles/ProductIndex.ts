import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  actionBar: {
    paddingLeft: 10,
    paddingTop: 10,
  },
  container: {
    flex: 1,
    flexBasis: 'auto',
  },
  error: {
    margin: 20,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    backgroundColor: '#eee',
    flex: 1,
    paddingRight: 10,
  },
  loadMoreButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  loading: {
    paddingTop: 20,
  },
  loadingLoadMore: {
    height: 40,
    marginVertical: 10,
    paddingTop: 0,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    alignItems: 'center',
    borderBottomColor: '#eee',
    borderBottomWidth: 2,
    height: 70,
    justifyContent: 'center',
    paddingTop: 20,
  },
  modalHeaderClose: {
    alignItems: 'center',
    bottom: 0,
    height: 70,
    justifyContent: 'center',
    left: 0,
    paddingHorizontal: 10,
    paddingTop: 20,
    position: 'absolute',
  },
  modalHeaderCloseText: {},
  modalHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modelLoadingContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
  },
  noResultContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  noResultText: {
    marginBottom: 20,
  },
  productImage: {
    height: 100,
    width: 100,
  },
  productItem: {
    backgroundColor: 'white',
    flex: 1,
    margin: 10,
    marginBottom: 0,
    marginRight: 0,
    padding: 10,
  },
  resetButton: {
    alignItems: 'center',
    backgroundColor: '#eee',
    height: 40,
    justifyContent: 'center',
    width: 150,
  },
});

export type { ImageStyle, TextStyle, ViewStyle } from 'react-native';

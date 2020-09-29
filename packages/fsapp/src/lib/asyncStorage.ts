import * as AsyncStorageFactory from '@react-native-community/async-storage';
import * as WebStorage from '@react-native-community/async-storage-backend-web';

const webStorage = new WebStorage.default();
interface StorageModel {
  devKeepPage: string;
  lastScreen: string;
}
const storage = AsyncStorageFactory.default.create<StorageModel>(webStorage);

export default storage;

import * as AsyncStorageFactory from '@react-native-community/async-storage';
import * as LegacyStorage from '@react-native-community/async-storage-backend-legacy';

const legacyStorage = new LegacyStorage.default();
interface StorageModel {
  devKeepPage: string;
  lastScreen: string;

}
const storage = AsyncStorageFactory.default.create<StorageModel>(legacyStorage);

export default storage;

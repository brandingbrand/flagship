import {Alert} from 'react-native';

function applyDiscount(...args: any) {
  Alert.alert('Apply Discount', JSON.stringify(args));
}

export default applyDiscount;

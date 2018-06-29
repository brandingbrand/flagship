import RNLeanplum from '@brandingbrand/react-native-leanplum';
const env = require('../../env/env');

const leanplum = new RNLeanplum(
  env.leanplum.appId,
  __DEV__ ? env.leanplum.devKey : env.leanplum.prodKey
);

export default leanplum;

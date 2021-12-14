import NativeConstants from '../../lib/native-constants';

const { ShowDevMenu } = NativeConstants;

export const shouldShowDevMenu = (): boolean => {
  return ShowDevMenu === 'true';
};

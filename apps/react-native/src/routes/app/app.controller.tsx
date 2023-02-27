// @ts-ignore
import openURLInBrowser from 'react-native/Libraries/Core/Devtools/openURLInBrowser';

import {env, useNavigator} from '@brandingbrand/fsapp';

export default (
  props: PropsWithChildrenFunction<
    {},
    {onPressDocs: () => void; onPressLink: (link: string) => () => void}
  >,
) => {
  const {children} = props;
  const navigator = useNavigator();

  const onPressDocs = () => {
    openURLInBrowser(env.app.docs.domain);
  };

  const onPressLink = (link: string) => () => {
    if (link !== 'plugin-permissions') {
      const path = link.replace('plugin-', '');

      return openURLInBrowser(
        new URL(`${env.app.docs.path.plugins}/${path}`, env.app.docs.domain),
      );
    }

    navigator.push(`/${link}`);
  };

  return children({
    onPressDocs,
    onPressLink,
  });
};
